# API Monitoring

`.github/workflows/api-monitor.yml` checks fund providers every hour at minute 33.

Status files are pushed to the `api-status` branch:

- `status/index.json`
- `status/tencent.json`
- `status/status.json`

These JSON files can be used by shields.io endpoint badges.
