import fundApi, { funds } from "../../src";

describe("package entry", () => {
  it("exports funds as named and default export", () => {
    expect(fundApi.funds).toBe(funds);
  });
});
