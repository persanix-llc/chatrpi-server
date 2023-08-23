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
import winston from "winston";


export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.printf((info) => {
            return `[${ colorizeLevel(info.level) }] ${ info.message }`;
        })
    ),
    transports: [ new winston.transports.Console() ]
});


/**
 * Returns colorized level text corresponding to the severity of the level.
 * @param {"info" | "warn" | "error" | string} level
 * @returns {string}
 */
function colorizeLevel(level: "info" | "warn" | "error" | string): string {
    switch (level) {
        case "info":
            return chalk.blue("INFO");
        case "warn":
            return chalk.yellow("WARN");
        case "error":
            return chalk.red("RED");
        default:
            return level;
    }
}
