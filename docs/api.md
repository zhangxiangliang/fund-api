# fund-api API

`fund-api` 是一个零运行时依赖的基金数据工具，支持 Node.js、浏览器、CLI 和 MCP。默认使用 `funds.auto`。

## 安装

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

## 浏览器

```html
<script src="https://cdn.jsdelivr.net/npm/fund-api/dist/browser/fund-api.iife.min.js"></script>
<script>
  FundApi.funds.auto.getFund("110022").then(console.log);
  FundApi.funds.auto.getNavHistory("110022").then(console.log);
  FundApi.funds.auto.searchFunds("易方达消费").then(console.log);
</script>
```

## 数据结构

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

## 接口

| API | 说明 |
| --- | --- |
| `funds.auto.getFund(code)` | 查询单只基金净值 |
| `funds.auto.getFunds(codes)` | 批量查询基金净值 |
| `funds.auto.getNavHistory(code)` | 查询基金历史净值 |
| `funds.auto.searchFunds(query)` | 搜索基金 |
| `funds.getSources()` | 查看支持的数据源 |

## 说明

当前数据源为腾讯公开基金行情接口。数据可能延迟或不可用，不构成投资建议。
