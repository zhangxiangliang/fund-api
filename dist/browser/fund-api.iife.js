"use strict";
var FundApi = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    FundApiError: () => FundApiError,
    FundCodeError: () => FundCodeError,
    FundParseError: () => FundParseError,
    FundRequestError: () => FundRequestError,
    default: () => index_default,
    funds: () => funds_default
  });

  // src/errors.ts
  var FundApiError = class extends Error {
    constructor(message) {
      super(message);
      this.name = new.target.name;
    }
  };
  var FundRequestError = class extends FundApiError {
  };
  var FundCodeError = class extends FundApiError {
  };
  var FundParseError = class extends FundApiError {
  };

  // src/utils/constant.ts
  var TENCENT_QUOTE_URL = "https://qt.gtimg.cn/";
  var TENCENT_SEARCH_URL = "https://smartbox.gtimg.cn/s3/";
  var TENCENT_NAV_HISTORY_URL = "https://stockjs.finance.qq.com/fundUnitNavAll/data/year_all";

  // src/utils/browser-script.ts
  function isBrowserRuntime() {
    return Boolean(globalThis.document);
  }
  async function loadBrowserScript(options) {
    const runtime = globalThis;
    const document = runtime.document;
    const parent = document?.head || document?.body || document?.documentElement;
    if (!document || !parent) {
      throw new FundRequestError("Browser document is not available");
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = options.timeout || 15e3;
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new FundRequestError(`Script request timed out after ${timeout}ms`));
      }, timeout);
      function cleanup() {
        clearTimeout(timeoutId);
        script.onload = null;
        script.onerror = null;
        script.parentNode?.removeChild?.(script);
      }
      script.async = true;
      script.charset = options.charset || "utf-8";
      script.onload = () => {
        cleanup();
        resolve();
      };
      script.onerror = () => {
        cleanup();
        reject(new FundRequestError("Script request failed"));
      };
      script.src = options.url;
      parent.appendChild(script);
    });
  }
  function getBrowserValue(name) {
    const runtime = globalThis;
    const value = runtime[name];
    delete runtime[name];
    return typeof value === "string" ? value : "";
  }
  function getBrowserGlobal(name) {
    const runtime = globalThis;
    const value = runtime[name];
    delete runtime[name];
    return value;
  }

  // src/utils/number.ts
  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  // src/utils/text.ts
  function decodeUnicode(value) {
    return value.replace(
      /\\u([0-9a-fA-F]{4})/g,
      (_, hex) => String.fromCharCode(Number.parseInt(hex, 16))
    );
  }

  // src/funds/tencent/index.ts
  function parseTencentResponse(text) {
    return text.split(";").map((line) => line.trim()).filter(Boolean).map((line) => {
      const match = line.match(/^v_[^=]+="(.*)"$/);
      return match ? match[1].split("~") : [];
    });
  }
  function parseFund(fields) {
    return {
      code: fields[0] || "",
      name: fields[1] || "",
      nav: toNumber(fields[5]),
      accNav: toNumber(fields[6]),
      change: toNumber(fields[7]),
      navDate: fields[8] || "",
      source: "tencent"
    };
  }
  function parseSearchBody(text) {
    const match = text.match(/^v_hint="(.*)"$/);
    const body = match ? match[1] : text;
    if (!body || body === "N") return [];
    return body.split("^").filter(Boolean).map((item) => {
      const fields = item.split("~");
      return {
        code: fields[1] || "",
        name: decodeUnicode(fields[2] || ""),
        pinyin: fields[3] || "",
        type: fields[4] || "",
        source: "tencent"
      };
    }).filter((item) => item.code && item.name);
  }
  function normalizeFundCode(code) {
    return code.replace(/^jj/i, "").trim();
  }
  function formatDate(value) {
    if (!/^\d{8}$/.test(value)) return value;
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  function parseNavHistoryPayload(payload) {
    return (payload.data || []).map((item) => ({
      date: formatDate(item[0] || ""),
      nav: toNumber(item[1]),
      accNav: toNumber(item[2]),
      source: "tencent"
    })).filter((item) => item.date && Number.isFinite(item.nav) && Number.isFinite(item.accNav));
  }
  function parseNavHistoryBody(text) {
    const match = text.match(/fundNavAllYearData\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
    const body = match ? match[1] : text;
    const payload = JSON.parse(body);
    return parseNavHistoryPayload(payload);
  }
  async function getFund(code) {
    const [fund] = await getFunds([code]);
    return fund || {};
  }
  async function getFunds(codes) {
    if (!codes.length) return [];
    const query = codes.map((code) => `jj${code}`).join(",");
    const url = `${TENCENT_QUOTE_URL}?q=${encodeURIComponent(query)}`;
    if (isBrowserRuntime()) {
      await loadBrowserScript({ charset: "gbk", url });
      return codes.map((code) => getBrowserValue(`v_jj${code}`).split("~")).filter((fields) => fields[0] && fields[1]).map(parseFund);
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new FundRequestError(`Tencent fund quote request failed: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const text = new TextDecoder("gbk").decode(buffer);
    return parseTencentResponse(text).filter((fields) => fields[0] && fields[1]).map(parseFund);
  }
  async function searchFunds(query) {
    const url = `${TENCENT_SEARCH_URL}?v=2&t=all&q=${encodeURIComponent(query)}`;
    if (isBrowserRuntime()) {
      await loadBrowserScript({ charset: "utf-8", url });
      return parseSearchBody(getBrowserValue("v_hint"));
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new FundRequestError(`Tencent fund search request failed: ${response.status}`);
    }
    return parseSearchBody(await response.text());
  }
  async function getNavHistory(code) {
    const normalizedCode = normalizeFundCode(code);
    const url = `${TENCENT_NAV_HISTORY_URL}/${encodeURIComponent(normalizedCode)}.js`;
    if (isBrowserRuntime()) {
      await loadBrowserScript({ charset: "gb2312", url });
      return parseNavHistoryPayload(getBrowserGlobal("fundNavAllYearData") || {});
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new FundRequestError(
        `Tencent fund NAV history request failed: ${response.status}`
      );
    }
    return parseNavHistoryBody(await response.text());
  }
  var tencent_default = {
    getFund,
    getFunds,
    getNavHistory,
    searchFunds
  };

  // src/funds/auto/index.ts
  var auto_default = tencent_default;

  // src/funds/index.ts
  var sourceNames = ["tencent"];
  function getSources() {
    return [...sourceNames];
  }
  var funds_default = {
    auto: auto_default,
    getSources,
    tencent: tencent_default
  };

  // src/index.ts
  var index_default = { funds: funds_default };
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=fund-api.iife.js.map
