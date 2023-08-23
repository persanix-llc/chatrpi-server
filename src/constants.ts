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
import { base as basePrompt } from "./prompts";
import { EnvironmentVariableKey, EnvironmentVariableMap, FunctionMap, PromptMap } from "./types";


export const EnvironmentVariable: EnvironmentVariableMap = {
    [EnvironmentVariableKey.OPENAI_KEY]: process.env.OPENAI_KEY,
    [EnvironmentVariableKey.ENDRPI_URL]: process.env.ENDRPI_URL
} as const;

export const Prompt: PromptMap = {
    base: basePrompt
} as const;

export const Function: FunctionMap = {
    RaspberryPi: RaspberryPi.ChatFunction
} as const;

export const DEFAULT_PORT = 5000;
export const DEFAULT_MESSAGE_LIMIT = 50;
export const DEFAULT_SYSTEM_PROMPT = Prompt.base;
export const DEFAULT_CHAT_FUNCTION = Function.RaspberryPi;
