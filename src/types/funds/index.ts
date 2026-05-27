export type FundProviderName = "tencent";

export interface Fund {
  code: string;
  name: string;
  nav: number;
  accNav: number;
  change: number;
  navDate: string;
  source: FundProviderName;
}

export interface FundNavHistoryItem {
  date: string;
  nav: number;
  accNav: number;
  source: FundProviderName;
}

export interface FundSearchResult {
  code: string;
  name: string;
  pinyin: string;
  type: string;
  source: FundProviderName;
}
