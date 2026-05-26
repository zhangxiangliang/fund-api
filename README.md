# fund-api

`fund-api` is a placeholder package for the upcoming fund data API.

For now it exposes the future API shape and returns empty objects, so the package name can be reserved while the real fund data implementation is being designed.

```bash
npm install fund-api
```

```js
const { funds } = require("fund-api");

const fund = await funds.auto.getFund("110022");
const results = await funds.auto.searchFunds("易方达消费");

console.log(fund); // {}
console.log(results); // {}
```

Planned direction:

- `funds.auto.getFund(code)` for fund profile and latest net value
- `funds.auto.searchFunds(query)` for fund search
- more fund net value and history APIs later

If you need stock, ETF, or exchange-traded fund quotes today, use [`stock-api`](https://www.npmjs.com/package/stock-api).
