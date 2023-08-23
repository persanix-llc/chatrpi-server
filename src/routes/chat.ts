/**
 * Copyright (c) 2020 - 2023 Persanix LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import chalk from "chalk";
import express, { Request, Response } from "express";
import { ChatCompletionRequestMessage } from "openai/api";

import { openAIApi } from "../clients";
import { EnvironmentVariable } from "../constants";
import { putPin } from "../endrpi";
import { getChatFunction, getMessageLimit, getSystemPrompt } from "../environment";
import { logger } from "../logging";
import { isRaspberryPiResponse } from "../type-guards";
import { ChatResponse, EnvironmentVariableKey } from "../types";

const MESSAGE_LIMIT = getMessageLimit();
const SYSTEM_PROMPT = getSystemPrompt();
const CHAT_FUNCTION = getChatFunction();

// Chatrpi/user message list used for contextual conversations
const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: SYSTEM_PROMPT }
];

export const chatRouter = express.Router();


type PostMessageRequest = Request<unknown, unknown, {
    message?: string
}>;
type PostMessageResponse = Response<{
    message: string,
    continue: boolean
}>;
chatRouter.post(
    "/",
    async (request: PostMessageRequest, response: PostMessageResponse) => {
        const { message } = request.body;

        if (typeof message !== "string") {
            logger.warn(`Request body did not contain a 'message' field`);
            return response.sendStatus(400);
        }

        messages.push({ role: "user", content: message });

        try {
            const { data } = await openAIApi.createChatCompletion({
                model: "gpt-3.5-turbo-0613",
                messages,
                functions: [ CHAT_FUNCTION ],
                function_call: { "name": "respondFunction" }
            });

            logger.info(`Total tokens used '${ data?.usage?.total_tokens ?? "<unknown>" }'`);

            const chatResponseJson = data?.choices[0]?.message?.["function_call"]?.["arguments"];
            if (!chatResponseJson) {
                logger.error(`Failed to parse ChatGPT response`);
                return response.sendStatus(500);
            }

            const chatResponse: ChatResponse<unknown> = JSON.parse(chatResponseJson);

            // TODO (jmp-12)
            // We should explore whether the content here could be minimized and maintain the original context
            messages.push({ role: "assistant", content: chatResponseJson });

            // Respond to the request before acting upon an action for quicker conversational responses
            // The hope is that Chatrpi will still be talking as the request completes
            response.json({
                message: chatResponse.message,
                continue: chatResponse.continue,
            });

            // Remove some messages if approaching the limit but keep the system prompt message
            if (messages.length > MESSAGE_LIMIT) {
                logger.info(`Surpassing message limit of '${ MESSAGE_LIMIT }'`);
                messages.splice(1, 4);
                logger.info(`Removed some older messages, some conversational context may be lost`);
            }

            // Not all responses will have an action associated with them
            if (!chatResponse.action) {
                logger.info(`No action received on response`);
                return;
            }

            if (isRaspberryPiResponse(chatResponse)) {
                const { action } = chatResponse;
                logger.info(`Received Raspberry Pi action '${ JSON.stringify(action) }'`);

                const endrpiUrl = EnvironmentVariable.ENDRPI_URL;
                if (endrpiUrl) {
                    logger.info(`Sending request to Endrpi at '${ EnvironmentVariable.ENDRPI_URL }'`);
                    const { pin, output } = action;
                    const pinResponse = await putPin(pin, output);
                    if (pinResponse) {
                        logger.info(
                            `Successfully set pin ${ chalk.green(pin) } I/O to ` +
                            `${ chalk.bold(pinResponse.io) } with state ${ chalk.yellow(pinResponse.state) }`
                        );
                    }
                } else {
                    logger.warn(
                        `No ${ chalk.blue(EnvironmentVariableKey.ENDRPI_URL) } environment ` +
                        `variable set, can't complete action`
                    );
                }
            } else {
                logger.warn(`Unknown response action '${ chatResponse.action }'`);
            }

            return;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "No error message provided";
            logger.warn(`Failed to communicate with ChatGPT with error: ${ errorMessage }`);
        }

        return response.sendStatus(500);
    });
