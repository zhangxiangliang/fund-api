"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFund = getFund;
exports.getFunds = getFunds;
exports.searchFunds = searchFunds;
exports.getNavHistory = getNavHistory;
const errors_1 = require("../../errors");
const constant_1 = require("../../utils/constant");
const browser_script_1 = require("../../utils/browser-script");
const number_1 = require("../../utils/number");
const text_1 = require("../../utils/text");
function parseTencentResponse(text) {
    return text
        .split(";")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
        const match = line.match(/^v_[^=]+="(.*)"$/);
        return match ? match[1].split("~") : [];
    });
}
function parseFund(fields) {
    return {
        code: fields[0] || "",
        name: fields[1] || "",
        nav: (0, number_1.toNumber)(fields[5]),
        accNav: (0, number_1.toNumber)(fields[6]),
        change: (0, number_1.toNumber)(fields[7]),
        navDate: fields[8] || "",
        source: "tencent",
    };
}
function parseSearchBody(text) {
    const match = text.match(/^v_hint="(.*)"$/);
    const body = match ? match[1] : text;
    if (!body || body === "N")
        return [];
    return body
        .split("^")
        .filter(Boolean)
        .map((item) => {
        const fields = item.split("~");
        return {
            code: fields[1] || "",
            name: (0, text_1.decodeUnicode)(fields[2] || ""),
            pinyin: fields[3] || "",
            type: fields[4] || "",
            source: "tencent",
        };
    })
        .filter((item) => item.code && item.name);
}
function normalizeFundCode(code) {
    return code.replace(/^jj/i, "").trim();
}
function formatDate(value) {
    if (!/^\d{8}$/.test(value))
        return value;
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}
function parseNavHistoryPayload(payload) {
    return (payload.data || [])
        .map((item) => ({
        date: formatDate(item[0] || ""),
        nav: (0, number_1.toNumber)(item[1]),
        accNav: (0, number_1.toNumber)(item[2]),
        source: "tencent",
    }))
        .filter((item) => item.date && Number.isFinite(item.nav) && Number.isFinite(item.accNav));
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
    if (!codes.length)
        return [];
    const query = codes.map((code) => `jj${code}`).join(",");
    const url = `${constant_1.TENCENT_QUOTE_URL}?q=${encodeURIComponent(query)}`;
    if ((0, browser_script_1.isBrowserRuntime)()) {
        await (0, browser_script_1.loadBrowserScript)({ charset: "gbk", url });
        return codes
            .map((code) => (0, browser_script_1.getBrowserValue)(`v_jj${code}`).split("~"))
            .filter((fields) => fields[0] && fields[1])
            .map(parseFund);
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new errors_1.FundRequestError(`Tencent fund quote request failed: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const text = new TextDecoder("gbk").decode(buffer);
    return parseTencentResponse(text)
        .filter((fields) => fields[0] && fields[1])
        .map(parseFund);
}
async function searchFunds(query) {
    const url = `${constant_1.TENCENT_SEARCH_URL}?v=2&t=all&q=${encodeURIComponent(query)}`;
    if ((0, browser_script_1.isBrowserRuntime)()) {
        await (0, browser_script_1.loadBrowserScript)({ charset: "utf-8", url });
        return parseSearchBody((0, browser_script_1.getBrowserValue)("v_hint"));
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new errors_1.FundRequestError(`Tencent fund search request failed: ${response.status}`);
    }
    return parseSearchBody(await response.text());
}
async function getNavHistory(code) {
    const normalizedCode = normalizeFundCode(code);
    const url = `${constant_1.TENCENT_NAV_HISTORY_URL}/${encodeURIComponent(normalizedCode)}.js`;
    if ((0, browser_script_1.isBrowserRuntime)()) {
        await (0, browser_script_1.loadBrowserScript)({ charset: "gb2312", url });
        return parseNavHistoryPayload((0, browser_script_1.getBrowserGlobal)("fundNavAllYearData") || {});
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new errors_1.FundRequestError(`Tencent fund NAV history request failed: ${response.status}`);
    }
    return parseNavHistoryBody(await response.text());
}
exports.default = {
    getFund,
    getFunds,
    getNavHistory,
    searchFunds,
};
