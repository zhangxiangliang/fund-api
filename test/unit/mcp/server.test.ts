import { handleMcpRequest } from "../../../src/mcp/server";
import { funds } from "../../../src";

jest.mock("../../../src", () => ({
  funds: {
    auto: {
      getFund: jest.fn(),
      getFunds: jest.fn(),
      getNavHistory: jest.fn(),
      searchFunds: jest.fn(),
    },
    tencent: {
      getFund: jest.fn(),
      getFunds: jest.fn(),
      getNavHistory: jest.fn(),
      searchFunds: jest.fn(),
    },
  },
}));

const mockedFunds = funds as unknown as {
  auto: {
    getFund: jest.Mock;
    getFunds: jest.Mock;
    getNavHistory: jest.Mock;
    searchFunds: jest.Mock;
  };
};

describe("mcp server", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("lists fund tools", async () => {
    const response = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    });

    expect(response?.result).toMatchObject({
      tools: expect.arrayContaining([
        expect.objectContaining({ name: "get_fund" }),
        expect.objectContaining({ name: "get_funds" }),
        expect.objectContaining({ name: "get_nav_history" }),
        expect.objectContaining({ name: "search_funds" }),
      ]),
    });
  });

  it("returns mcp-compatible object content for get_funds", async () => {
    mockedFunds.auto.getFunds.mockResolvedValue([
      {
        accNav: 2.917,
        change: 0.275,
        code: "110022",
        name: "E Fund Consumer",
        nav: 2.917,
        navDate: "2026-05-25",
        source: "tencent",
      },
    ]);

    const response = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "get_funds",
        arguments: {
          codes: ["110022"],
        },
      },
    });

    const result = response?.result as {
      content: Array<{ text: string; type: "text" }>;
      structuredContent: Record<string, unknown>;
    };

    expect(result.structuredContent).toMatchObject({
      input: {
        codes: ["110022"],
        source: "auto",
      },
      response: {
        count: 1,
        funds: [expect.objectContaining({ code: "110022" })],
      },
    });
    expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
  });

  it("returns mcp-compatible object content for get_nav_history", async () => {
    mockedFunds.auto.getNavHistory.mockResolvedValue([
      {
        accNav: 2.913,
        date: "2026-05-26",
        nav: 2.913,
        source: "tencent",
      },
    ]);

    const response = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "get_nav_history",
        arguments: {
          code: "110022",
        },
      },
    });

    expect(response?.result).toMatchObject({
      structuredContent: {
        input: {
          code: "110022",
          source: "auto",
        },
        response: {
          count: 1,
          history: [expect.objectContaining({ date: "2026-05-26" })],
        },
      },
    });
  });

  it("wraps tool errors in structured content", async () => {
    mockedFunds.auto.getFund.mockRejectedValue(new Error("boom"));

    const response = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "get_fund",
        arguments: {
          code: "110022",
        },
      },
    });

    expect(response?.result).toMatchObject({
      isError: true,
      structuredContent: {
        response: {
          code: "FUND_API_TOOL_ERROR",
          message: "boom",
        },
      },
    });
  });
});
