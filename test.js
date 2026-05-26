"use strict";

const assert = require("node:assert/strict");
const fundApi = require("./");

async function main() {
  assert.equal(typeof fundApi.funds.auto.getFund, "function");
  assert.equal(typeof fundApi.funds.auto.searchFunds, "function");
  assert.deepEqual(await fundApi.funds.auto.getFund("110022"), {});
  assert.deepEqual(await fundApi.funds.auto.searchFunds("易方达消费"), {});
  assert.equal(fundApi.default.funds, fundApi.funds);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
