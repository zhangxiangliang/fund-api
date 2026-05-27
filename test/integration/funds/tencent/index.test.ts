import tencent from "../../../../src/funds/tencent";

describe("tencent fund provider integration", () => {
  it("gets one fund quote", async () => {
    await expect(tencent.getFund("110022")).resolves.toMatchObject({
      code: "110022",
      name: expect.any(String),
      nav: expect.any(Number),
      accNav: expect.any(Number),
      change: expect.any(Number),
      navDate: expect.any(String),
      source: "tencent",
    });
  });

  it("gets batch fund quotes", async () => {
    const funds = await tencent.getFunds(["110022", "000001"]);

    expect(funds).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "110022", source: "tencent" }),
        expect.objectContaining({ code: "000001", source: "tencent" }),
      ])
    );
  });

  it("searches funds", async () => {
    await expect(tencent.searchFunds("易方达消费")).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "110022",
          name: expect.any(String),
          source: "tencent",
        }),
      ])
    );
  });

  it("gets NAV history", async () => {
    await expect(tencent.getNavHistory("110022")).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accNav: expect.any(Number),
          date: expect.any(String),
          nav: expect.any(Number),
          source: "tencent",
        }),
      ])
    );
  });
});
