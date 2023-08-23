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
import { NextFunction, Request, Response } from "express";

import { logger } from "../logging";


/**
 * Simple logging middleware for express requests.
 * @returns {(request: Request, response: Response, next: NextFunction) => void}
 */
export function loggingMiddleware(): (request: Request, response: Response, next: NextFunction) => void {
    return (request: Request, response: Response, next: NextFunction) => {
        const startTime = process.hrtime.bigint();
        logger.info(`Started ${ chalk.green(request.method) } for ${ chalk.bold(request.url) }`);
        response.on("finish", () => {
            const completeTime = process.hrtime.bigint();
            const elapsedTime = (completeTime - startTime) / BigInt(1e6);
            logger.info(`Completed with ${ chalk.bold(response.statusCode) } in ${ elapsedTime }ms\n`);
        });
        next();
    };
}
