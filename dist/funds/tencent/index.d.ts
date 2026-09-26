import type { Fund, FundNavHistoryItem, FundSearchResult } from "../../types/funds";
export declare function getFund(code: string): Promise<Fund | Record<string, never>>;
export declare function getFunds(codes: string[]): Promise<Fund[]>;
export declare function searchFunds(query: string): Promise<FundSearchResult[]>;
export declare function getNavHistory(code: string): Promise<FundNavHistoryItem[]>;
declare const _default: {
    getFund: typeof getFund;
    getFunds: typeof getFunds;
    getNavHistory: typeof getNavHistory;
    searchFunds: typeof searchFunds;
};
export default _default;
