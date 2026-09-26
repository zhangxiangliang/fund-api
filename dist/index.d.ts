import funds from "./funds";
export { funds };
export { FundApiError, FundCodeError, FundParseError, FundRequestError, } from "./errors";
export type { Fund, FundNavHistoryItem, FundProviderName, FundSearchResult } from "./funds";
declare const _default: {
    funds: {
        auto: {
            getFund: typeof import("./funds/tencent").getFund;
            getFunds: typeof import("./funds/tencent").getFunds;
            getNavHistory: typeof import("./funds/tencent").getNavHistory;
            searchFunds: typeof import("./funds/tencent").searchFunds;
        };
        getSources: typeof import("./funds").getSources;
        tencent: {
            getFund: typeof import("./funds/tencent").getFund;
            getFunds: typeof import("./funds/tencent").getFunds;
            getNavHistory: typeof import("./funds/tencent").getNavHistory;
            searchFunds: typeof import("./funds/tencent").searchFunds;
        };
    };
};
export default _default;
