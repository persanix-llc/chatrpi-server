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

import { ChatCompletionFunctions } from "openai";


export enum EnvironmentVariableKey {
    OPENAI_KEY = "OPENAI_KEY",
    ENDRPI_URL = "ENDRPI_URL"
}

export type EnvironmentVariableMap = Record<EnvironmentVariableKey, string | undefined>;

export type PromptVariant = "base";
export type PromptMap = Record<PromptVariant, string>;

export type ChatResponse<T> = {
    message: string,
    continue: boolean,
    action: T extends unknown ? T : undefined
}

export type ChatFunction = ChatCompletionFunctions & { name: "respondFunction" };
export type FunctionVariant = "RaspberryPi";
export type FunctionMap = Record<FunctionVariant, ChatFunction>;
