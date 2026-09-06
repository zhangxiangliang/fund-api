"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tencent = exports.auto = void 0;
exports.getSources = getSources;
const auto_1 = __importDefault(require("./auto"));
exports.auto = auto_1.default;
const tencent_1 = __importDefault(require("./tencent"));
exports.tencent = tencent_1.default;
const sourceNames = ["tencent"];
function getSources() {
    return [...sourceNames];
}
exports.default = {
    auto: auto_1.default,
    getSources,
    tencent: tencent_1.default,
};
