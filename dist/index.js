"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRequestError = exports.FundParseError = exports.FundCodeError = exports.FundApiError = exports.funds = void 0;
const funds_1 = __importDefault(require("./funds"));
exports.funds = funds_1.default;
var errors_1 = require("./errors");
Object.defineProperty(exports, "FundApiError", { enumerable: true, get: function () { return errors_1.FundApiError; } });
Object.defineProperty(exports, "FundCodeError", { enumerable: true, get: function () { return errors_1.FundCodeError; } });
Object.defineProperty(exports, "FundParseError", { enumerable: true, get: function () { return errors_1.FundParseError; } });
Object.defineProperty(exports, "FundRequestError", { enumerable: true, get: function () { return errors_1.FundRequestError; } });
exports.default = { funds: funds_1.default };
