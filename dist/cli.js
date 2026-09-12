#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const server_1 = require("./mcp/server");
const sourceNames = ["tencent"];
const cliSourceNames = ["auto", ...sourceNames];
run(process.argv.slice(2)).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
});
async function run(args) {
    const parsed = parseArgs(args);
    if (!parsed.command || parsed.command === "help" || parsed.command === "--help") {
        printHelp();
        return;
    }
    if (parsed.command === "mcp") {
        await (0, server_1.runMcpServer)();
        return;
    }
    const source = index_1.funds[parsed.source];
    switch (parsed.command) {
        case "get-fund":
            requireValues(parsed.values, "get-fund <code>");
            printJson(await source.getFund(parsed.values[0]));
            return;
        case "get-funds":
            requireValues(parsed.values, "get-funds <code...>");
            printJson(await source.getFunds(parsed.values));
            return;
        case "get-nav-history":
            requireValues(parsed.values, "get-nav-history <code>");
            printJson(await source.getNavHistory(parsed.values[0]));
            return;
        case "search-funds":
        case "search":
            requireValues(parsed.values, "search-funds <keyword>");
            printJson(await source.searchFunds(parsed.values.join(" ")));
            return;
        default:
            throw new Error(`Unknown command: ${parsed.command}`);
    }
}
function parseArgs(args) {
    const values = [];
    let command;
    let source = "auto";
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (arg === "--source" || arg === "-s") {
            const value = args[index + 1];
            if (!isCliSourceName(value)) {
                throw new Error(`Invalid source: ${value || ""}`);
            }
            source = value;
            index += 1;
            continue;
        }
        if (!command) {
            command = arg;
            continue;
        }
        values.push(arg);
    }
    return { command, source, values };
}
function isCliSourceName(value) {
    return cliSourceNames.includes(value);
}
function requireValues(values, usage) {
    if (values.length === 0) {
        throw new Error(`Usage: fund-api ${usage}`);
    }
}
function printJson(value) {
    console.log(JSON.stringify(value, null, 2));
}
function printHelp() {
    console.log(`Usage:
  fund-api get-fund <code> [--source auto|tencent]
  fund-api get-funds <code...> [--source auto|tencent]
  fund-api get-nav-history <code> [--source auto|tencent]
  fund-api search-funds <keyword> [--source auto|tencent]
  fund-api mcp

Examples:
  fund-api get-fund 110022
  fund-api get-funds 110022 000001
  fund-api get-nav-history 110022
  fund-api search-funds 易方达消费
  fund-api mcp`);
}
