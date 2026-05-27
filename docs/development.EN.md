# Development

Common commands:

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

Before committing, run:

```bash
npm run validate
```

`ci` runs build, typecheck, and unit tests. Real provider checks live in `test:integration` and API Monitor.
