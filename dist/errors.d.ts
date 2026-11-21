export declare class FundApiError extends Error {
    constructor(message: string);
}
export declare class FundRequestError extends FundApiError {
}
export declare class FundCodeError extends FundApiError {
}
export declare class FundParseError extends FundApiError {
}
