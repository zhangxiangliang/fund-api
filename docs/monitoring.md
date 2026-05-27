# API 监控

`.github/workflows/api-monitor.yml` 每小时第 33 分钟检查一次基金数据源。

状态结果会推送到 `api-status` 分支：

- `status/index.json`
- `status/tencent.json`
- `status/status.json`

这些 JSON 可以被 shields.io endpoint badge 使用。
