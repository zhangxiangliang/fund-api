"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowserRuntime = isBrowserRuntime;
exports.loadBrowserScript = loadBrowserScript;
exports.getBrowserValue = getBrowserValue;
exports.getBrowserGlobal = getBrowserGlobal;
function isBrowserRuntime() {
    return Boolean(globalThis.document);
}
async function loadBrowserScript(options) {
    const runtime = globalThis;
    const document = runtime.document;
    const parent = (document === null || document === void 0 ? void 0 : document.head) || (document === null || document === void 0 ? void 0 : document.body) || (document === null || document === void 0 ? void 0 : document.documentElement);
    if (!document || !parent) {
        throw new errors_1.FundRequestError("Browser document is not available");
    }
    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const timeout = options.timeout || 15000;
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new errors_1.FundRequestError(`Script request timed out after ${timeout}ms`));
        }, timeout);
        function cleanup() {
            var _a, _b;
            clearTimeout(timeoutId);
            script.onload = null;
            script.onerror = null;
            (_b = (_a = script.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild) === null || _b === void 0 ? void 0 : _b.call(_a, script);
        }
        script.async = true;
        script.charset = options.charset || "utf-8";
        script.onload = () => {
            cleanup();
            resolve();
        };
        script.onerror = () => {
            cleanup();
            reject(new errors_1.FundRequestError("Script request failed"));
        };
        script.src = options.url;
        parent.appendChild(script);
    });
}
function getBrowserValue(name) {
    const runtime = globalThis;
    const value = runtime[name];
    delete runtime[name];
    return typeof value === "string" ? value : "";
}
function getBrowserGlobal(name) {
    const runtime = globalThis;
    const value = runtime[name];
    delete runtime[name];
    return value;
}
const errors_1 = require("../errors");
