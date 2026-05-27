# Architecture

`fund-api` follows the same project shape as `stock-api`:

- `src/index.ts`: package entry
- `src/funds/index.ts`: fund provider aggregation
- `src/funds/auto`: default auto entry
- `src/funds/tencent`: Tencent fund provider
- `src/types/funds`: public types
- `src/cli.ts`: CLI entry
- `src/mcp/server.ts`: MCP server
- `scripts/build-browser.mjs`: browser bundle build
- `examples/`: GitHub Pages examples

Published files come from `dist/`, `docs/`, README, and license files.
