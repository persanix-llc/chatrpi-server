/**
 * Copyright (c) 2020 - 2023 Persanix LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


export interface System {
    platform: {
        machineType: string
        networkName: string
        operatingSystem: {
            name: string,
            release: string,
            version: string
        }
    },
    temperature: {
        systemOnChip: {
            quantity: number,
            prefix: null,
            unitOfMeasurement: "CELSIUS"
        }
    },
    throttle: {
        throttling: boolean,
        throttlingHasOccurred: boolean,
        underVoltageDetected: boolean,
        underVoltageHasOccurred: boolean,
        armFrequencyCapped: boolean,
        armFrequencyCappingHasOccurred: boolean,
        softTemperatureLimitActive: boolean,
        softTemperatureLimitHasOccurred: boolean
    },
    uptime: {
        seconds: number,
        formatted: string
    },
    frequency: {
        arm: {
            quantity: 0,
            prefix: null,
            unitOfMeasurement: "HERTZ"
        },
        core: {
            quantity: 0,
            prefix: null,
            unitOfMeasurement: "HERTZ"
        }
    },
    memory: {
        total: {
            quantity: number,
            prefix: "KILO",
            unitOfMeasurement: "BYTE"
        },
        free: {
            quantity: number,
            prefix: "KILO",
            unitOfMeasurement: "BYTE"
        },
        available: {
            quantity: number,
            prefix: "KILO",
            unitOfMeasurement: "BYTE"
        }
    }
}

export interface Pin {
    io: "INPUT" | "OUTPUT",
    state: number,
    pull: "FLOATING" | "UP" | "DOWN"
}
