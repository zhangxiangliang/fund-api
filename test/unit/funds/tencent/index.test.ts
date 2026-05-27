import tencent from "../../../../src/funds/tencent";

const originalFetch = global.fetch;

function createResponse(body: string | ArrayBuffer, ok = true, status = 200): Response {
  return {
    ok,
    status,
    text: async () => String(body),
    arrayBuffer: async () =>
      body instanceof ArrayBuffer ? body : new TextEncoder().encode(String(body)).buffer,
  } as Response;
}

describe("tencent fund provider", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("gets one fund quote", async () => {
    const body = 'v_jj110022="110022~E Fund Consumer~0.0000~0.0000~~2.9170~2.9170~0.2750~2026-05-25~";';
    global.fetch = jest.fn().mockResolvedValue(createResponse(body));

    await expect(tencent.getFund("110022")).resolves.toEqual({
      code: "110022",
      name: "E Fund Consumer",
      nav: 2.917,
      accNav: 2.917,
      change: 0.275,
      navDate: "2026-05-25",
      source: "tencent",
    });
  });

  it("gets batch fund quotes", async () => {
    const body = [
      'v_jj110022="110022~E Fund Consumer~0.0000~0.0000~~2.9170~2.9170~0.2750~2026-05-25~"',
      'v_jj000001="000001~China Growth~0.0000~0.0000~~0.8900~3.5710~-0.1122~2026-05-25~"',
    ].join(";\n");
    global.fetch = jest.fn().mockResolvedValue(createResponse(body));

    const funds = await tencent.getFunds(["110022", "000001"]);

    expect(funds).toHaveLength(2);
    expect(funds[0]).toMatchObject({ code: "110022", source: "tencent" });
    expect(funds[1]).toMatchObject({ code: "000001", source: "tencent" });
  });

  it("searches funds", async () => {
    const body = 'v_hint="jj~110022~\\u6613\\u65b9\\u8fbe\\u6d88\\u8d39\\u884c\\u4e1a\\u80a1\\u7968~yfdxfhygp~KJ"';
    global.fetch = jest.fn().mockResolvedValue(createResponse(body));

    await expect(tencent.searchFunds("易方达消费")).resolves.toEqual([
      {
        code: "110022",
        name: "易方达消费行业股票",
        pinyin: "yfdxfhygp",
        type: "KJ",
        source: "tencent",
      },
    ]);
  });

  it("gets NAV history", async () => {
    const body =
      'fundNavAllYearData={"code":"jj110022","data":[["20260523","2.9100","2.9100"],["20260526","2.9130","2.9130"]]}';
    global.fetch = jest.fn().mockResolvedValue(createResponse(body));

    await expect(tencent.getNavHistory("110022")).resolves.toEqual([
      {
        date: "2026-05-23",
        nav: 2.91,
        accNav: 2.91,
        source: "tencent",
      },
      {
        date: "2026-05-26",
        nav: 2.913,
        accNav: 2.913,
        source: "tencent",
      },
    ]);
  });

  it("returns an empty object when fund quote is missing", async () => {
    global.fetch = jest.fn().mockResolvedValue(createResponse('v_jj000000="";'));

    await expect(tencent.getFund("000000")).resolves.toEqual({});
  });

  it("throws when quote request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue(createResponse("", false, 503));

    await expect(tencent.getFund("110022")).rejects.toThrow(
      "Tencent fund quote request failed: 503"
    );
  });
});
