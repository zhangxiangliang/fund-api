import funds, { getSources } from "../../../src/funds";

describe("funds", () => {
  it("exports sources like stock-api", () => {
    expect(getSources()).toEqual(["tencent"]);
    expect(funds.getSources()).toEqual(["tencent"]);
  });

  it("uses auto as the default provider", () => {
    expect(funds.auto).toBe(funds.tencent);
  });
});
