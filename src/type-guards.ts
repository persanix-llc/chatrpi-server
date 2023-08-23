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

import { RaspberryPi } from "./functions";
import { ChatResponse, FunctionVariant, PromptVariant } from "./types";


export function isPromptVariant(object: unknown): object is PromptVariant {
    return typeof object === "string" &&
        object === "base";
}

export function isChatFunction(object: unknown): object is FunctionVariant {
    return typeof object === "string" &&
        object === "raspberryPi";
}

export function isRaspberryPiResponse(object: ChatResponse<unknown>): object is RaspberryPi.ChatResponse {
    if (object.action && typeof object.action === "object") {
        return "pin" in object.action && "output" in object.action;
    }
    return false;
}
