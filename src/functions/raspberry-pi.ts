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

import { ChatFunction as ChatFunctionType, ChatResponse as ChatResponseType, } from "../types";


/**
 * The 'function' ChatGPT will call with every response configured specifically for
 * the Raspberry Pi system.
 *
 * We use functions to normalize the responses coming from ChatGPT as they will
 * have a consistent structure and enumerated constraints.
 *
 * Part of the function parameters returned by ChatGPT will be returned to the client
 * via JSON, other parts (notably 'action') will be sent to Endrpi.
 *
 * Theoretically, other boards can be configured with their own action.
 *
 * @type {ChatFunctionType}
 */
export const ChatFunction: ChatFunctionType = {
    name: "respondFunction",
    description: "Responds to the user input and optionally controls a GPIO pin.",
    parameters: {
        type: "object",
        properties: {
            message: {
                type: "string",
                description: "A succinct chat message response.",
            },
            continue: {
                type: "boolean",
                description: "True if you are asking the user a question or for clarification in the 'message' field.",
            },
            action: {
                type: "object",
                properties: {
                    pin: {
                        type: "string",
                        enum: [
                            "GPIO2", "GPIO3", "GPIO4", "GPIO14", "GPIO15", "GPIO17",
                            "GPIO18", "GPIO27", "GPIO22", "GPIO23", "GPIO24", "GPIO10",
                            "GPIO9", "GPIO25", "GPIO11", "GPIO7", "GPIO5", "GPIO6", "GPIO12",
                            "GPIO13", "GPIO19", "GPIO16", "GPIO26", "GPIO20", "GPIO21"
                        ],
                        description: "The GPIO pin to be controlled.",
                    },
                    output: {
                        type: "boolean",
                        description: "Whether the device should be turned on or not.",
                    },
                }
            },
        },
        required: [ "message", "continue" ],
    },
} as const;

export type ChatResponse = ChatResponseType<{
    pin: `GPIO${ number }`,
    output: boolean
}>;
