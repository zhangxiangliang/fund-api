import type { Fund, FundNavHistoryItem, FundSearchResult } from "../../types/funds";
import { FundRequestError } from "../../errors";
import {
  TENCENT_NAV_HISTORY_URL,
  TENCENT_QUOTE_URL,
  TENCENT_SEARCH_URL,
} from "../../utils/constant";
import {
  getBrowserGlobal,
  getBrowserValue,
  isBrowserRuntime,
  loadBrowserScript,
} from "../../utils/browser-script";
import { toNumber } from "../../utils/number";
import { decodeUnicode } from "../../utils/text";

function parseTencentResponse(text: string): string[][] {
  return text
    .split(";")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^v_[^=]+="(.*)"$/);
      return match ? match[1].split("~") : [];
    });
}

function parseFund(fields: string[]): Fund {
  return {
    code: fields[0] || "",
    name: fields[1] || "",
    nav: toNumber(fields[5]),
    accNav: toNumber(fields[6]),
    change: toNumber(fields[7]),
    navDate: fields[8] || "",
    source: "tencent",
  };
}

function parseSearchBody(text: string): FundSearchResult[] {
  const match = text.match(/^v_hint="(.*)"$/);
  const body = match ? match[1] : text;

  if (!body || body === "N") return [];

  return body
    .split("^")
    .filter(Boolean)
    .map((item) => {
      const fields = item.split("~");
      return {
        code: fields[1] || "",
        name: decodeUnicode(fields[2] || ""),
        pinyin: fields[3] || "",
        type: fields[4] || "",
        source: "tencent" as const,
      };
    })
    .filter((item) => item.code && item.name);
}

type TencentNavHistoryPayload = {
  code?: string;
  data?: string[][];
};

function normalizeFundCode(code: string): string {
  return code.replace(/^jj/i, "").trim();
}

function formatDate(value: string): string {
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function parseNavHistoryPayload(payload: TencentNavHistoryPayload): FundNavHistoryItem[] {
  return (payload.data || [])
    .map((item) => ({
      date: formatDate(item[0] || ""),
      nav: toNumber(item[1]),
      accNav: toNumber(item[2]),
      source: "tencent" as const,
    }))
    .filter((item) => item.date && Number.isFinite(item.nav) && Number.isFinite(item.accNav));
}

function parseNavHistoryBody(text: string): FundNavHistoryItem[] {
  const match = text.match(/fundNavAllYearData\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  const body = match ? match[1] : text;
  const payload = JSON.parse(body) as TencentNavHistoryPayload;
  return parseNavHistoryPayload(payload);
}

export async function getFund(code: string): Promise<Fund | Record<string, never>> {
  const [fund] = await getFunds([code]);
  return fund || {};
}

export async function getFunds(codes: string[]): Promise<Fund[]> {
  if (!codes.length) return [];

  const query = codes.map((code) => `jj${code}`).join(",");
  const url = `${TENCENT_QUOTE_URL}?q=${encodeURIComponent(query)}`;

  if (isBrowserRuntime()) {
    await loadBrowserScript({ charset: "gbk", url });
    return codes
      .map((code) => getBrowserValue(`v_jj${code}`).split("~"))
      .filter((fields) => fields[0] && fields[1])
      .map(parseFund);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new FundRequestError(`Tencent fund quote request failed: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const text = new TextDecoder("gbk").decode(buffer);

  return parseTencentResponse(text)
    .filter((fields) => fields[0] && fields[1])
    .map(parseFund);
}

export async function searchFunds(query: string): Promise<FundSearchResult[]> {
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

export async function getNavHistory(code: string): Promise<FundNavHistoryItem[]> {
  const normalizedCode = normalizeFundCode(code);
  const url = `${TENCENT_NAV_HISTORY_URL}/${encodeURIComponent(normalizedCode)}.js`;

  if (isBrowserRuntime()) {
    await loadBrowserScript({ charset: "gb2312", url });
    return parseNavHistoryPayload(getBrowserGlobal<TencentNavHistoryPayload>("fundNavAllYearData") || {});
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new FundRequestError(
      `Tencent fund NAV history request failed: ${response.status}`
    );
  }

  return parseNavHistoryBody(await response.text());
}

export default {
  getFund,
  getFunds,
  getNavHistory,
  searchFunds,
};
