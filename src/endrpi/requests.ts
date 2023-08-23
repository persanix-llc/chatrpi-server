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

import axios from "axios";
import chalk from "chalk";

import { Pin, System } from "./types";

import { EnvironmentVariable } from "../constants";
import { logger } from "../logging";
import { EnvironmentVariableKey } from "../types";


/**
 * Sends a GET request to '/system' to retrieve system information.
 * @returns {Promise<System | undefined>}
 */
export function getSystem(): Promise<System | undefined> {
    return request<System>({
        method: "get",
        path: `/system`
    });
}

/**
 * Sends a PUT request to '/pins/{ pin }' to control a pin's output.
 * @param {`GPIO${number}`} pin
 * @param {boolean} output
 * @returns {Promise<Pin | undefined>}
 */
export function putPin(pin: `GPIO${ number }`, output: boolean): Promise<Pin | undefined> {
    return request<Pin>({
        method: "put",
        path: `/pins/${ pin }`,
        body: {
            io: "OUTPUT",
            state: output ? 1 : 0
        }
    });
}


interface RequestParams {
    method: "get" | "put";
    path: `/${ string }`;
    body?: Record<string, unknown>;
}

async function request<T>(params: RequestParams): Promise<T | undefined> {
    const { method, path, body = undefined } = params;

    const formattedRequest = `${ chalk.bold(method.toUpperCase()) } '${ path }' request`;

    const endrpiUrl = EnvironmentVariable.ENDRPI_URL;
    if (!endrpiUrl) {
        logger.warn(
            `No ${ EnvironmentVariableKey.ENDRPI_URL } environment variable set, ` +
            `aborting ${ formattedRequest }`
        );
        return undefined;
    }

    try {
        const { data }: { data: T } = await axios[method](`${ endrpiUrl }${ path }`, body);
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "No error message provided";
        logger.error(`Endrpi ${ formattedRequest } failed with error: ${ errorMessage }`);
    }

    return undefined;
}
