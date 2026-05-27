import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Readable, Writable } from "node:stream";

import { funds } from "../index";

type SourceName = "tencent";
type McpSourceName = "auto" | SourceName;
type JsonRpcId = number | string | null;

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: unknown;
};

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type McpTool = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties: false;
  };
};

type ToolResult = {
  content: Array<{
    type: "text";
    text: string;
  }>;
  structuredContent: Record<string, unknown>;
  isError?: boolean;
};

type ToolCallParams = {
  name?: string;
  arguments?: unknown;
};

type GetFundArgs = {
  code?: unknown;
  source?: unknown;
};

type GetFundsArgs = {
  codes?: unknown;
  source?: unknown;
};

type SearchFundsArgs = {
  query?: unknown;
  source?: unknown;
};

type GetNavHistoryArgs = {
  code?: unknown;
  source?: unknown;
};

const sourceNames: SourceName[] = ["tencent"];
const mcpSourceNames: McpSourceName[] = ["auto", ...sourceNames];
const packageVersion = readPackageVersion();

const tools: McpTool[] = [
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

export async function runMcpServer(
  input: Readable = process.stdin,
  output: Writable = process.stdout
): Promise<void> {
  input.setEncoding("utf8");

  let buffer = "";

  input.on("data", (chunk: string) => {
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

export async function handleMcpRequest(
  request: JsonRpcRequest
): Promise<JsonRpcResponse | undefined> {
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
  } catch (error) {
    return createError(request.id, -32603, getErrorMessage(error));
  }
}

async function handleLine(line: string, output: Writable): Promise<void> {
  let payload: unknown;

  try {
    payload = JSON.parse(line);
  } catch (error) {
    writeMessage(output, createError(null, -32700, getErrorMessage(error)));
    return;
  }

  const messages = Array.isArray(payload) ? payload : [payload];

  for (const message of messages) {
    const response = await handleMcpRequest(message as JsonRpcRequest);

    if (response) {
      writeMessage(output, response);
    }
  }
}

async function routeRequest(request: JsonRpcRequest): Promise<unknown> {
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

async function handleNotification(request: JsonRpcRequest): Promise<void> {
  if (request.method === "notifications/initialized") {
    return;
  }
}

async function callTool(params: ToolCallParams): Promise<unknown> {
  const name = requireString(params.name, "name");
  const args = asObject(params.arguments);

  try {
    const data = await executeTool(name, args);
    return createToolResult(data);
  } catch (error) {
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

async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<Record<string, unknown>> {
  switch (name) {
    case "get_fund": {
      const values = args as GetFundArgs;
      const input = {
        code: requireString(values.code, "code"),
        source: optionalSource(values.source),
      };
      const fund = await funds[input.source].getFund(input.code);
      return {
        input,
        response: { fund },
      };
    }

    case "get_funds": {
      const values = args as GetFundsArgs;
      const input = {
        codes: requireStringArray(values.codes, "codes"),
        source: optionalSource(values.source),
      };
      const fundList = await funds[input.source].getFunds(input.codes);
      return {
        input,
        response: {
          count: fundList.length,
          funds: fundList,
        },
      };
    }

    case "search_funds": {
      const values = args as SearchFundsArgs;
      const input = {
        query: requireString(values.query, "query"),
        source: optionalSource(values.source),
      };
      const fundList = await funds[input.source].searchFunds(input.query);
      return {
        input,
        response: {
          count: fundList.length,
          funds: fundList,
        },
      };
    }

    case "get_nav_history": {
      const values = args as GetNavHistoryArgs;
      const input = {
        code: requireString(values.code, "code"),
        source: optionalSource(values.source),
      };
      const history = await funds[input.source].getNavHistory(input.code);
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

function optionalSource(value: unknown): McpSourceName {
  if (value === undefined) {
    return "auto";
  }

  const source = requireString(value, "source");

  if (!mcpSourceNames.includes(source as McpSourceName)) {
    throw new Error(`Invalid source: ${source}`);
  }

  return source as McpSourceName;
}

function parseToolCallParams(value: unknown): ToolCallParams {
  return asObject(value) as ToolCallParams;
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function requireString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or invalid ${name}`);
  }

  return value.trim();
}

function requireStringArray(value: unknown, name: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Missing or invalid ${name}`);
  }

  return value.map((item) => requireString(item, name));
}

function createToolResult(data: Record<string, unknown>): ToolResult {
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

function toJsonObject(data: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
}

function fundCodeSchema(): Record<string, unknown> {
  return {
    type: "string",
    minLength: 1,
    description: "Fund code, such as 110022 or 000001.",
  };
}

function sourceSchema(): Record<string, unknown> {
  return {
    type: "string",
    enum: mcpSourceNames,
    description: "Data source. Defaults to auto.",
  };
}

function isRequest(value: unknown): value is JsonRpcRequest {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as JsonRpcRequest).jsonrpc === "2.0" &&
      typeof (value as JsonRpcRequest).method === "string"
  );
}

function createError(
  id: JsonRpcId,
  code: number,
  message: string,
  data?: unknown
): JsonRpcResponse {
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

function writeMessage(output: Writable, message: unknown): void {
  output.write(`${JSON.stringify(message)}\n`);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readPackageVersion(): string {
  try {
    const packageJsonPath = resolve(__dirname, "../../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      version?: unknown;
    };

    return typeof packageJson.version === "string" ? packageJson.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}
