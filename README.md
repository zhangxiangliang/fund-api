# fund-api

`fund-api` is a zero-runtime-dependency fund data toolkit for Node.js, browsers, CLI, and MCP. It defaults to `funds.auto` and currently uses Tencent public fund quote data.

[English](README.md) | [简体中文](docs/api.md)

```bash
npm install fund-api
```

## Usage

```js
const { funds } = require("fund-api");

const fund = await funds.auto.getFund("110022");
const list = await funds.auto.getFunds(["110022", "000001"]);
const history = await funds.auto.getNavHistory("110022");
const results = await funds.auto.searchFunds("易方达消费");
```

## Browser

```html
<script src="https://cdn.jsdelivr.net/npm/fund-api/dist/browser/fund-api.iife.min.js"></script>
<script>
  FundApi.funds.auto.getFund("110022").then(console.log);
  FundApi.funds.auto.getFunds(["110022", "000001"]).then(console.log);
  FundApi.funds.auto.getNavHistory("110022").then(console.log);
  FundApi.funds.auto.searchFunds("易方达消费").then(console.log);
</script>
```

## CLI

```bash
npx fund-api get-fund 110022
npx fund-api get-funds 110022 000001
npx fund-api get-nav-history 110022
npx fund-api search-funds 易方达消费
```

## MCP

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

## API

| API | Description |
| --- | --- |
| `funds.auto.getFund(code)` | Get one fund quote and latest NAV |
| `funds.auto.getFunds(codes)` | Get batch fund quotes |
| `funds.auto.getNavHistory(code)` | Get fund NAV history |
| `funds.auto.searchFunds(query)` | Search funds |
| `funds.getSources()` | List supported data sources |

```ts
interface Fund {
  code: string;
  name: string;
  nav: number;
  accNav: number;
  change: number;
  navDate: string;
  source: "tencent";
}

interface FundNavHistoryItem {
  date: string;
  nav: number;
  accNav: number;
  source: "tencent";
}
```

More docs:

- [中文 API 文档](docs/api.md)
- [English API docs](docs/api.EN.md)
- [CLI](docs/cli.md)
- [MCP](docs/mcp.md)
- [Architecture](docs/architecture.EN.md)
- [Development](docs/development.EN.md)
- [Monitoring](docs/monitoring.EN.md)

## Disclaimer

`fund-api` uses third-party public data sources. It does not guarantee accuracy, completeness, timeliness, or availability. This project does not provide investment advice. For commercial, high-frequency, or production usage, confirm the data source terms and compliance requirements yourself.
