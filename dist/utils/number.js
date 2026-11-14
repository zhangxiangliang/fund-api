"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = toNumber;
function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}
