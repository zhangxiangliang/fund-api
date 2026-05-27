<h1 align="center">fund-api</h1>

<p align="center">
  支持基金净值查询、历史净值和基金搜索的 TypeScript 基金数据工具。
</p>

<p align="center">
  <a href="./README.EN.md">English</a> |
  <a href="./README.md">简体中文</a>
</p>

<p align="center">
  <a href="https://npmcharts.com/compare/fund-api?minimal=true"><img src="https://img.shields.io/npm/dm/fund-api.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/fund-api"><img src="https://img.shields.io/npm/v/fund-api.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/fund-api"><img src="https://img.shields.io/npm/l/fund-api.svg?sanitize=true" alt="License"></a>
  <a href="https://www.npmjs.com/package/fund-api"><img src="https://img.shields.io/badge/language-typescript-blue" alt="TypeScript"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/%E6%8E%A5%E5%8F%A3%E7%8A%B6%E6%80%81-%E5%8F%AF%E7%94%A8-brightgreen" alt="接口状态">
  <img src="https://img.shields.io/badge/%E8%85%BE%E8%AE%AF-%E5%8F%AF%E7%94%A8-brightgreen" alt="腾讯状态">
</p>

<p align="center">
  <a href="https://zhangxiangliang.github.io/fund-api/">
    <img src="https://img.shields.io/badge/%E5%9C%A8%E7%BA%BF%E4%BD%93%E9%AA%8C-WEB%20DEMO-3b82f6?style=for-the-badge" alt="在线体验">
  </a>
  <a href="https://zhangxiangliang.github.io/fund-api/">
    <img src="https://img.shields.io/badge/%E9%A1%B9%E7%9B%AE%E4%B8%BB%E9%A1%B5-HOME%20PAGE-24292f?style=for-the-badge" alt="项目主页">
  </a>
</p>

`fund-api` 是一个零运行时依赖的基金行情工具，支持 Node.js、浏览器、CLI 和 MCP。默认使用 `funds.auto`，自动从可用数据源获取基金数据。

## 支持使用方式

<p>
  <img src="https://img.shields.io/badge/Node.js-TypeScript%20API-22c55e?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Browser-CDN%20%2F%20Bundler-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Browser">
  <img src="https://img.shields.io/badge/CLI-npx%20fund--api-f97316?style=for-the-badge&logo=gnubash&logoColor=white" alt="CLI">
  <img src="https://img.shields.io/badge/MCP-AI%20Tools-a855f7?style=for-the-badge&logo=openai&logoColor=white" alt="MCP">
</p>

## 特性

- Node.js / Browser bundler API + TypeScript 类型
- CLI 查询基金净值、历史净值和搜索基金
- MCP tools 给 AI 客户端直接调用基金接口
- 默认自动数据源：`funds.auto`
- 指定数据源：`funds.tencent`
- 支持基金代码格式，例如 `110022`
- 零运行时依赖

## Node.js

### 安装

Node.js 环境要求 `>=18`。

```shell
npm install fund-api
```

### 使用

```typescript
import { funds } from "fund-api";

const fund = await funds.auto.getFund("110022");
const list = await funds.auto.getFunds(["110022", "000001"]);
const history = await funds.auto.getNavHistory("110022");
const results = await funds.auto.searchFunds("易方达消费");
```

## 浏览器

### 引用

```html
<script src="https://cdn.jsdelivr.net/npm/fund-api/dist/browser/fund-api.iife.min.js"></script>
```

### 使用

```html
<script>
  FundApi.funds.auto.getFund("110022").then(console.log);
  FundApi.funds.auto.getFunds(["110022", "000001"]).then(console.log);
  FundApi.funds.auto.getNavHistory("110022").then(console.log);
  FundApi.funds.auto.searchFunds("易方达消费").then(console.log);
</script>
```

浏览器示例：[GitHub Pages](https://zhangxiangliang.github.io/fund-api/)

## CLI

```shell
npx fund-api get-fund 110022
npx fund-api get-funds 110022 000001
npx fund-api get-nav-history 110022
npx fund-api search-funds 易方达消费
```

## MCP

把 `fund-api` 接到支持 MCP 的 AI 客户端：

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

内置工具：`get_fund`、`get_funds`、`get_nav_history`、`search_funds`。

## 数据源

内置腾讯基金数据源，默认由 `funds.auto` 自动处理。

| 数据源 | 用法 | 能力 |
| --- | --- | --- |
| 自动 | `funds.auto` | 单只基金、批量基金、历史净值、搜索 |
| 腾讯 | `funds.tencent` | 单只基金、批量基金、历史净值、搜索 |

## 文档

| 文档 | 内容 |
| --- | --- |
| [API 使用](docs/api.md) | TypeScript API、数据结构、浏览器使用 |
| [CLI 使用](docs/cli.md) | 命令、参数、输出 |
| [MCP 使用](docs/mcp.md) | MCP 客户端配置和工具列表 |
| [项目架构](docs/architecture.md) | 目录结构、provider 工厂、解析和错误模型 |
| [开发指南](docs/development.md) | 本地开发、测试、发布前检查、新增数据源 |
| [API 监控](docs/monitoring.md) | 定时检查第三方数据源并更新状态徽章 |

## 免责声明

`fund-api` 使用第三方公开基金接口作为数据来源，不保证数据的准确性、完整性、实时性或持续可用性。本项目不提供投资建议，任何交易或投资决策都应由你自行判断。商业、高频或生产使用前，请自行确认第三方数据源的服务条款、授权范围和合规要求。

## License

MIT
