"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeUnicode = decodeUnicode;
function decodeUnicode(value) {
    return value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
}
