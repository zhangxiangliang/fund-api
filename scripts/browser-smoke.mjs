import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import vm from "node:vm";

const bundle = await readFile(
  resolve("dist/browser/fund-api.iife.min.js"),
  "utf8"
);

const createdScripts = [];
const context = {
  clearTimeout,
  console,
  document: {
    createElement() {
      const script = {};
      createdScripts.push(script);
      return script;
    },
    head: {
      appendChild(script) {
        setTimeout(() => {
          if (script.src.includes("qt.gtimg.cn")) {
            context.v_jj110022 =
              "110022~E Fund Consumer~0.0000~0.0000~~2.9170~2.9170~0.2750~2026-05-25~";
          }
          if (script.src.includes("smartbox.gtimg.cn")) {
            context.v_hint =
              "jj~110022~\\u6613\\u65b9\\u8fbe\\u6d88\\u8d39\\u884c\\u4e1a\\u80a1\\u7968~yfdxfhygp~KJ";
          }
          script.onload?.();
        }, 0);
      },
      removeChild() {},
    },
  },
  setTimeout,
};

vm.createContext(context);
vm.runInContext(bundle, context);

if (!context.FundApi?.funds?.auto) {
  throw new Error("FundApi global is not available");
}

const fund = await context.FundApi.funds.auto.getFund("110022");
if (fund.code !== "110022" || fund.source !== "tencent") {
  throw new Error("Browser getFund smoke failed");
}

const results = await context.FundApi.funds.auto.searchFunds("易方达消费");
if (!Array.isArray(results) || results[0]?.code !== "110022") {
  throw new Error("Browser searchFunds smoke failed");
}
