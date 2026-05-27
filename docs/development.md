# 开发指南

常用命令：

```bash
npm run lint
npm run build
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:browser
npm run ci
npm run examples
```

提交前建议至少运行：

```bash
npm run validate
```

`ci` 默认只跑构建、类型检查和单元测试；真实数据源测试由 `test:integration` 和 API Monitor 覆盖。
