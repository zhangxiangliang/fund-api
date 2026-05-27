# MCP

`fund-api` 可以作为本地 MCP server 使用：

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

工具：

| Tool | 说明 |
| --- | --- |
| `get_fund` | 查询单只基金 |
| `get_funds` | 批量查询基金 |
| `get_nav_history` | 查询基金历史净值 |
| `search_funds` | 搜索基金 |

工具返回值统一为：

```json
{
  "input": {},
  "response": {}
}
```
