/**
 * Copyright (c) 2020 - 2023 Persanix LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import chalk from "chalk";
import ora from "ora";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

import {
    DEFAULT_CHAT_FUNCTION,
    DEFAULT_MESSAGE_LIMIT,
    DEFAULT_PORT,
    DEFAULT_SYSTEM_PROMPT,
    EnvironmentVariable,
    Function,
    Prompt
} from "./constants";
import { getSystem } from "./endrpi";
import { isChatFunction, isPromptVariant } from "./type-guards";
import { ChatFunction, EnvironmentVariableKey } from "./types";


/**
 * Iterates through each {@link EnvironmentVariable} used by Chatrpi
 * and logs progress to the console.
 *
 * @returns {boolean} - true if all required environment variables exist
 */
export async function checkEnvironmentVariables(): Promise<boolean> {
    console.log(`Checking environment variables...`);
    Object.entries(EnvironmentVariable).forEach(environmentVariable => {
        const [ key, value ] = environmentVariable;
        const spinner = ora({
            spinner: "dots2",
            text: `Checking ${ chalk.blue(key) } environment variable`
        });
        spinner.start();
        if (value) {
            spinner.succeed(`${ chalk.blue(key) } found`);
        } else {
            spinner.fail(`${ chalk.blue(key) } not found`);
        }
    });

    if (!EnvironmentVariable.OPENAI_KEY) {
        console.log(
            `\nThe ${ chalk.blue(EnvironmentVariableKey.OPENAI_KEY) } environment variable ` +
            `${ chalk.bold("must") } be set in order to run ${ chalk.hex("#14b8a6")("Chatrpi") }.`
        );
        console.log(`Visit https://openai.com to create an account and get an API key.`);
        return false;
    }

    if (!EnvironmentVariable.ENDRPI_URL) {
        console.log(
            `\nThe ${ chalk.blue(EnvironmentVariableKey.ENDRPI_URL) } environment variable ` +
            `is required to control GPIO.`
        );
        console.log(`You can still use ${ chalk.hex("#14b8a6")("Chatrpi") } for general conversations.\n`);
    } else {
        console.log(`\nChecking servers...`);
        const spinner = ora({
            spinner: "dots2",
            text: `Contacting ${ chalk.hex("#cc3366")("Endrpi") }`
        });
        spinner.start();

        const system = await getSystem();
        if (system) {
            spinner.succeed(`${ chalk.hex("#cc3366")("Endrpi") } found`);
            const socTemp = system.temperature.systemOnChip;
            console.log(
                `\nBy the way, your Raspberry Pi system on chip temperature is ${ chalk.yellow(socTemp.quantity) } ` +
                `degrees ${ chalk.bold(socTemp.unitOfMeasurement.toLowerCase()) } and the system has been awake for ` +
                `${ chalk.blue(system.uptime.seconds) } seconds.`
            );
            console.log(`Neat huh?\n`);
        } else {
            spinner.fail(`Failed to reach the ${ chalk.hex("#cc3366")("Endrpi") } server `);
            console.log(
                `Ensure the ${ chalk.blue(EnvironmentVariableKey.ENDRPI_URL) } environment variable is correct ` +
                `and that you can reach ${ EnvironmentVariable.ENDRPI_URL } on this LAN.\n`
            );
        }
    }

    return true;
}

/**
 * Returns the port provided via command-line argument '--port' or the default port.
 * @returns {number} - Value of '--port' or {@link DEFAULT_PORT}.
 */
export function getPort(): number {
    const args = yargs(hideBin(process.argv)).argv;
    if ("port" in args && typeof args.port === "number") {
        return args.port;
    }
    return DEFAULT_PORT;
}

/**
 * Returns the maximum number of conversation messages Chatrpi should keep provided via
 * command-line argument '--message-limit' or the default limit.
 * @returns {number} - Value of '--message-limit' or {@link DEFAULT_MESSAGE_LIMIT}.
 */
export function getMessageLimit(): number {
    const args = yargs(hideBin(process.argv)).argv;
    if ("messageLimit" in args && typeof args.messageLimit === "number") {
        return args.messageLimit;
    }
    return DEFAULT_MESSAGE_LIMIT;
}

/**
 * Returns the system prompt Chatrpi should use to base its conversations on.
 * Provided via command-line argument '--system-prompt' or defaults to a base prompt.
 * @returns {number} - Prompt derived from '--system-prompt' or {@link DEFAULT_SYSTEM_PROMPT}.
 */
export function getSystemPrompt(): string {
    function cleansePrompt(prompt: string): string {
        return prompt.replace(/[\n\r]+/g, "");
    }

    const args = yargs(hideBin(process.argv)).argv;
    if ("systemPrompt" in args) {
        const { systemPrompt } = args;
        if (isPromptVariant(systemPrompt)) {
            return cleansePrompt(Prompt[systemPrompt]);
        }
    }
    return cleansePrompt(DEFAULT_SYSTEM_PROMPT);
}

/**
 * Returns the chat function Chatrpi should use to respond to conversations with.
 * Provided via command-line argument '--chat-function' or defaults to the Raspberry Pi.
 * @returns {ChatFunction} - Chat function derived from '--chat-function' or {@link DEFAULT_CHAT_FUNCTION}.
 */
export function getChatFunction(): ChatFunction {
    const args = yargs(hideBin(process.argv)).argv;
    if ("chatFunction" in args) {
        const { chatFunction } = args;
        if (isChatFunction(chatFunction)) {
            return Function[chatFunction];
        }
    }
    return DEFAULT_CHAT_FUNCTION;
}

/**
 * Returns true if CORS should be enabled.
 * @returns {number} - Value of '--enable-cors' if provided or `false`.
 */
export function getCorsEnabled(): boolean {
    const args = yargs(hideBin(process.argv)).argv;
    return "enableCors" in args && args.enableCors === "true";
}
