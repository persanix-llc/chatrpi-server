#!/usr/bin/env node
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

import * as path from "path";

import chalk from "chalk";
import express from "express";

import { checkEnvironmentVariables, getPort } from "./environment";
import { corsMiddleware, loggingMiddleware } from "./middleware";
import { chatRouter } from "./routes";


// Use an IIFE to ensure promises execute in sequence
(async () => {
    console.log(`Welcome to ${ chalk.hex("#14b8a6")("Chatrpi") }!`);
    console.log(`Built by ${ chalk.hex("#a968f7")("Persanix") } - check us out at https://persanix.com\n`);

    const environmentVariablesValid = await checkEnvironmentVariables();
    if (!environmentVariablesValid) {
        process.exit(1);
    }

    const port = getPort();
    const app = express();
    app.use("/api/*", express.json());
    app.use("/api/*", corsMiddleware());
    app.use("/api/*", loggingMiddleware());
    app.use("/api/chat", chatRouter);

    app.use("/", express.static(path.join(__dirname, "public"), { index: false }));
    app.use("/", (request, response) => {
        const paths = request.path.split("/").filter(Boolean);
        if (paths.length > 0) {
            paths[paths.length - 1] = paths[paths.length - 1] + ".html";
            return response.sendFile(path.join(__dirname, "public", ...paths));
        }
        return response.redirect("/welcome");
    });

    app.listen(port, () => {
        console.log(
            `Starting ${ chalk.hex("#14b8a6")("Chatrpi") } on port ${ chalk.green(port) } - ` +
            `http://localhost:${ port }\n`
        );
    });
})();

