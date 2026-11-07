"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMcpServer = runMcpServer;
exports.handleMcpRequest = handleMcpRequest;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const index_1 = require("../index");
const sourceNames = ["tencent"];
const mcpSourceNames = ["auto", ...sourceNames];
const packageVersion = readPackageVersion();
const tools = [
    {
        name: "get_fund",
        description: "Get one normalized fund quote and latest NAV by fund code.",
        inputSchema: {
            type: "object",
            additionalProperties: false,
            required: ["code"],
            properties: {
                code: fundCodeSchema(),
                source: sourceSchema(),
            },
        },
    },
    {
        name: "get_funds",
        description: "Get normalized fund quotes for multiple fund codes.",
        inputSchema: {
            type: "object",
            additionalProperties: false,
            required: ["codes"],
            properties: {
                codes: {
                    type: "array",
                    items: fundCodeSchema(),
                    minItems: 1,
                    description: "Fund codes, such as 110022 or 000001.",
                },
                source: sourceSchema(),
            },
        },
    },
    {
        name: "search_funds",
        description: "Search fund symbols by keyword.",
        inputSchema: {
            type: "object",
            additionalProperties: false,
            required: ["query"],
            properties: {
                query: {
                    type: "string",
                    minLength: 1,
                    description: "Search keyword, such as 易方达消费.",
                },
                source: sourceSchema(),
            },
        },
    },
    {
        name: "get_nav_history",
        description: "Get normalized fund NAV history by fund code.",
        inputSchema: {
            type: "object",
            additionalProperties: false,
            required: ["code"],
            properties: {
                code: fundCodeSchema(),
                source: sourceSchema(),
            },
        },
    },
];
async function runMcpServer(input = process.stdin, output = process.stdout) {
    input.setEncoding("utf8");
    let buffer = "";
    input.on("data", (chunk) => {
        buffer += chunk;
        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex >= 0) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            if (line !== "") {
                void handleLine(line, output);
            }
            newlineIndex = buffer.indexOf("\n");
        }
    });
}
async function handleMcpRequest(request) {
    if (!isRequest(request)) {
        return createError(null, -32600, "Invalid Request");
    }
    if (request.id === undefined) {
        await handleNotification(request);
        return undefined;
    }
    try {
        const result = await routeRequest(request);
        return {
            jsonrpc: "2.0",
            id: request.id,
            result,
        };
    }
    catch (error) {
        return createError(request.id, -32603, getErrorMessage(error));
    }
}
async function handleLine(line, output) {
    let payload;
    try {
        payload = JSON.parse(line);
    }
    catch (error) {
        writeMessage(output, createError(null, -32700, getErrorMessage(error)));
        return;
    }
    const messages = Array.isArray(payload) ? payload : [payload];
    for (const message of messages) {
        const response = await handleMcpRequest(message);
        if (response) {
            writeMessage(output, response);
        }
    }
}
async function routeRequest(request) {
    switch (request.method) {
        case "initialize":
            return {
                protocolVersion: "2025-06-18",
                capabilities: {
                    tools: {},
                },
                serverInfo: {
                    name: "fund-api",
                    version: packageVersion,
                },
            };
        case "tools/list":
            return { tools };
        case "tools/call":
            return callTool(parseToolCallParams(request.params));
        default:
            throw new Error(`Unknown method: ${request.method}`);
    }
}
async function handleNotification(request) {
    if (request.method === "notifications/initialized") {
        return;
    }
}
async function callTool(params) {
    const name = requireString(params.name, "name");
    const args = asObject(params.arguments);
    try {
        const data = await executeTool(name, args);
        return createToolResult(data);
    }
    catch (error) {
        const data = {
            input: {
                arguments: args,
                tool: name,
            },
            response: {
                code: "FUND_API_TOOL_ERROR",
                message: getErrorMessage(error),
            },
        };
        return {
            ...createToolResult(data),
            isError: true,
        };
    }
}
async function executeTool(name, args) {
    switch (name) {
        case "get_fund": {
            const values = args;
            const input = {
                code: requireString(values.code, "code"),
                source: optionalSource(values.source),
            };
            const fund = await index_1.funds[input.source].getFund(input.code);
            return {
                input,
                response: { fund },
            };
        }
        case "get_funds": {
            const values = args;
            const input = {
                codes: requireStringArray(values.codes, "codes"),
                source: optionalSource(values.source),
            };
            const fundList = await index_1.funds[input.source].getFunds(input.codes);
            return {
                input,
                response: {
                    count: fundList.length,
                    funds: fundList,
                },
            };
        }
        case "search_funds": {
            const values = args;
            const input = {
                query: requireString(values.query, "query"),
                source: optionalSource(values.source),
            };
            const fundList = await index_1.funds[input.source].searchFunds(input.query);
            return {
                input,
                response: {
                    count: fundList.length,
                    funds: fundList,
                },
            };
        }
        case "get_nav_history": {
            const values = args;
            const input = {
                code: requireString(values.code, "code"),
                source: optionalSource(values.source),
            };
            const history = await index_1.funds[input.source].getNavHistory(input.code);
            return {
                input,
                response: {
                    count: history.length,
                    history,
                },
            };
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
function optionalSource(value) {
    if (value === undefined) {
        return "auto";
    }
    const source = requireString(value, "source");
    if (!mcpSourceNames.includes(source)) {
        throw new Error(`Invalid source: ${source}`);
    }
    return source;
}
function parseToolCallParams(value) {
    return asObject(value);
}
function asObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }
    return value;
}
function requireString(value, name) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Missing or invalid ${name}`);
    }
    return value.trim();
}
function requireStringArray(value, name) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`Missing or invalid ${name}`);
    }
    return value.map((item) => requireString(item, name));
}
function createToolResult(data) {
    const structuredContent = toJsonObject(data);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(structuredContent, null, 2),
            },
        ],
        structuredContent,
    };
}
function toJsonObject(data) {
    return JSON.parse(JSON.stringify(data));
}
function fundCodeSchema() {
    return {
        type: "string",
        minLength: 1,
        description: "Fund code, such as 110022 or 000001.",
    };
}
function sourceSchema() {
    return {
        type: "string",
        enum: mcpSourceNames,
        description: "Data source. Defaults to auto.",
    };
}
function isRequest(value) {
    return Boolean(value &&
        typeof value === "object" &&
        value.jsonrpc === "2.0" &&
        typeof value.method === "string");
}
function createError(id, code, message, data) {
    return {
        jsonrpc: "2.0",
        id,
        error: {
            code,
            message,
            data,
        },
    };
}
function writeMessage(output, message) {
    output.write(`${JSON.stringify(message)}\n`);
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function readPackageVersion() {
    try {
        const packageJsonPath = (0, node_path_1.resolve)(__dirname, "../../package.json");
        const packageJson = JSON.parse((0, node_fs_1.readFileSync)(packageJsonPath, "utf8"));
        return typeof packageJson.version === "string" ? packageJson.version : "0.0.0";
    }
    catch {
        return "0.0.0";
    }
}
