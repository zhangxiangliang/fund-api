# 项目架构

`fund-api` 和 `stock-api` 保持相同的基础工程思路：

- `src/index.ts`：包入口
- `src/funds/index.ts`：基金数据源聚合
- `src/funds/auto`：默认自动入口
- `src/funds/tencent`：腾讯基金数据源
- `src/types/funds`：公开类型
- `src/cli.ts`：命令行入口
- `src/mcp/server.ts`：MCP server
- `scripts/build-browser.mjs`：浏览器 bundle 构建
- `examples/`：GitHub Pages 示例站

发布产物只从 `dist/`、`docs/` 和 README/License 输出。
