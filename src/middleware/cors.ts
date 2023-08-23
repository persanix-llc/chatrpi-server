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
import cors from "cors";
import { NextFunction, Request, Response } from "express";

import { getCorsEnabled } from "../environment";


/**
 * Cors enablement middleware.
 * @returns {(request: Request, response: Response, next: NextFunction) => void}
 */
export function corsMiddleware(): (request: Request, response: Response, next: NextFunction) => void {
    const corsEnabled = getCorsEnabled();
    if (corsEnabled) {
        console.log(`${ chalk.yellow("Warning:") } CORS has been enabled with ${ chalk.bold("--enable-cors") }.`);
        console.log(
            `Any webpage on your network will be able to send ` +
            `requests to ${ chalk.hex("#14b8a6")("Chatrpi") }!\n`
        );
        return cors();
    }

    // Cors disabled, do nothing
    return (_request: Request, _response: Response, next: NextFunction) => {
        next();
    };
}
