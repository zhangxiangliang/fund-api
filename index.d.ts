export type Fund = Record<string, never>;
export type FundSearchResult = Record<string, never>;

export interface FundApi {
  getFund(code: string): Promise<Fund>;
  searchFunds(query: string): Promise<FundSearchResult>;
}

export interface Funds {
  auto: FundApi;
}

export const funds: Funds;

declare const fundApi: {
  funds: Funds;
};

export default fundApi;
