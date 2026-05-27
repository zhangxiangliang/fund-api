<h1 align="center">fund-api</h1>

<p align="center">
  TypeScript fund data toolkit for fund quotes, NAV history, and fund search.
</p>

<p align="center">
  <a href="./README.EN.md">English</a> |
  <a href="./README.md">简体中文</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fund-api"><img src="https://img.shields.io/npm/v/fund-api.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/fund-api"><img src="https://img.shields.io/npm/l/fund-api.svg?sanitize=true" alt="License"></a>
  <a href="https://www.npmjs.com/package/fund-api"><img src="https://img.shields.io/badge/language-typescript-blue" alt="TypeScript"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/API%20status-up-brightgreen" alt="API Status">
  <img src="https://img.shields.io/badge/tencent-up-brightgreen" alt="Tencent Status">
  <img src="https://img.shields.io/badge/NAV%20history-up-brightgreen" alt="NAV History">
</p>

<p align="center">
  <a href="https://zhangxiangliang.github.io/fund-api/">
    <img src="https://img.shields.io/badge/Live%20Demo-WEB%20DEMO-3b82f6?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://zhangxiangliang.github.io/fund-api/">
    <img src="https://img.shields.io/badge/Home%20Page-HOME%20PAGE-24292f?style=for-the-badge" alt="Home Page">
  </a>
</p>

`fund-api` is a zero-runtime-dependency fund market data toolkit for Node.js, browsers, CLI, and MCP. Use `funds.auto` by default to fetch fund data from available providers.

## Supported Runtimes

<p>
  <img src="https://img.shields.io/badge/Node.js-TypeScript%20API-22c55e?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Browser-CDN%20%2F%20Bundler-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Browser">
  <img src="https://img.shields.io/badge/CLI-npx%20fund--api-f97316?style=for-the-badge&logo=gnubash&logoColor=white" alt="CLI">
  <img src="https://img.shields.io/badge/MCP-AI%20Tools-a855f7?style=for-the-badge&logo=openai&logoColor=white" alt="MCP">
</p>

## Features

- Node.js / browser bundler API + TypeScript types
- CLI for fund quotes, NAV history, and fund search
- MCP tools for AI clients
- Default provider entry: `funds.auto`
- Explicit provider entry: `funds.tencent`
- Fund code support, for example `110022`
- Zero runtime dependencies

## Node.js

### Install

Requires Node.js `>=18`.

```shell
npm install fund-api
```

### Usage

```typescript
import { funds } from "fund-api";

const fund = await funds.auto.getFund("110022");
const list = await funds.auto.getFunds(["110022", "000001"]);
const history = await funds.auto.getNavHistory("110022");
const results = await funds.auto.searchFunds("易方达消费");
```

## Browser

### Import

```html
<script src="https://cdn.jsdelivr.net/npm/fund-api/dist/browser/fund-api.iife.min.js"></script>
```

### Usage

```html
<script>
  FundApi.funds.auto.getFund("110022").then(console.log);
  FundApi.funds.auto.getFunds(["110022", "000001"]).then(console.log);
  FundApi.funds.auto.getNavHistory("110022").then(console.log);
  FundApi.funds.auto.searchFunds("易方达消费").then(console.log);
</script>
```

Browser example: [GitHub Pages](https://zhangxiangliang.github.io/fund-api/)

## CLI

```shell
npx fund-api get-fund 110022
npx fund-api get-funds 110022 000001
npx fund-api get-nav-history 110022
npx fund-api search-funds 易方达消费
```

## MCP

Connect `fund-api` to an MCP-compatible AI client:

```json
{
  "mcpServers": {
    "fund-api": {
      "command": "npx",
      "args": ["-y", "fund-api", "mcp"]
    }
  }
}
```

Built-in tools: `get_fund`, `get_funds`, `get_nav_history`, `search_funds`.

## Data Sources

Tencent fund data is built in. `funds.auto` uses it by default.

| Source | Usage | Capabilities |
| --- | --- | --- |
| Auto | `funds.auto` | Single fund, batch funds, NAV history, search |
| Tencent | `funds.tencent` | Single fund, batch funds, NAV history, search |

## Docs

| Doc | Content |
| --- | --- |
| [API](docs/api.EN.md) | TypeScript API, data shapes, browser usage |
| [CLI](docs/cli.md) | Commands, arguments, output |
| [MCP](docs/mcp.md) | MCP client config and tools |
| [Architecture](docs/architecture.EN.md) | Directory layout, provider factory, parsing and errors |
| [Development](docs/development.EN.md) | Local development, testing, release checks, adding providers |
| [API Monitoring](docs/monitoring.EN.md) | Scheduled provider checks and status badges |

## Disclaimer

`fund-api` uses third-party public fund data sources. It does not guarantee accuracy, completeness, timeliness, or availability. This project does not provide investment advice. For commercial, high-frequency, or production usage, confirm the data source terms and compliance requirements yourself.

## License

MIT
