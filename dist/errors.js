"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundParseError = exports.FundCodeError = exports.FundRequestError = exports.FundApiError = void 0;
class FundApiError extends Error {
    constructor(message) {
        super(message);
        this.name = new.target.name;
    }
}
exports.FundApiError = FundApiError;
class FundRequestError extends FundApiError {
}
exports.FundRequestError = FundRequestError;
class FundCodeError extends FundApiError {
}
exports.FundCodeError = FundCodeError;
class FundParseError extends FundApiError {
}
exports.FundParseError = FundParseError;
