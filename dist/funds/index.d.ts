import auto from "./auto";
import tencent from "./tencent";
import type { FundProviderName } from "../types/funds";
export declare function getSources(): FundProviderName[];
export { auto, tencent };
export type { Fund, FundNavHistoryItem, FundProviderName, FundSearchResult, } from "../types/funds";
declare const _default: {
    auto: {
        getFund: typeof import("./tencent").getFund;
        getFunds: typeof import("./tencent").getFunds;
        getNavHistory: typeof import("./tencent").getNavHistory;
        searchFunds: typeof import("./tencent").searchFunds;
    };
    getSources: typeof getSources;
    tencent: {
        getFund: typeof import("./tencent").getFund;
        getFunds: typeof import("./tencent").getFunds;
        getNavHistory: typeof import("./tencent").getNavHistory;
        searchFunds: typeof import("./tencent").searchFunds;
    };
};
export default _default;
