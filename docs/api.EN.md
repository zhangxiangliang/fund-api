# fund-api API

`fund-api` is a zero-runtime-dependency fund data toolkit for Node.js, browsers, CLI, and MCP. Use `funds.auto` by default.

## Install

```bash
npm install fund-api
```

## Node.js

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
  FundApi.funds.auto.getNavHistory("110022").then(console.log);
  FundApi.funds.auto.searchFunds("易方达消费").then(console.log);
</script>
```

## Shape

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

## APIs

| API | Description |
| --- | --- |
| `funds.auto.getFund(code)` | Get one fund quote and latest NAV |
| `funds.auto.getFunds(codes)` | Get batch fund quotes |
| `funds.auto.getNavHistory(code)` | Get fund NAV history |
| `funds.auto.searchFunds(query)` | Search funds |
| `funds.getSources()` | List supported data sources |

## Note

The current provider is Tencent public fund quote data. Data may be delayed or unavailable and is not investment advice.
