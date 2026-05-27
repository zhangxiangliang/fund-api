import { mkdir, writeFile } from "node:fs/promises";
import { funds } from "../dist/index.js";

const checks = [
  {
    name: "tencent",
    run: async () => {
      const fund = await funds.tencent.getFund("110022");
      if (!("code" in fund) || fund.code !== "110022") {
        throw new Error("Unexpected fund quote response");
      }
    },
  },
];

const results = [];

for (const check of checks) {
  const startedAt = Date.now();
  try {
    await check.run();
    results.push({
      name: check.name,
      ok: true,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    results.push({
      name: check.name,
      ok: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const available = results.filter((item) => item.ok).length;
const total = results.length;

await mkdir("status", { recursive: true });
await writeFile(
  "status/index.json",
  `${JSON.stringify({
    schemaVersion: 1,
    label: "api status",
    message: `${available}/${total} up`,
    color: available === total ? "brightgreen" : available > 0 ? "yellow" : "red",
  })}\n`
);

await writeFile(
  "status/index.zh-CN.json",
  `${JSON.stringify({
    schemaVersion: 1,
    label: "接口状态",
    message: `${available}/${total} 可用`,
    color: available === total ? "brightgreen" : available > 0 ? "yellow" : "red",
  })}\n`
);

for (const result of results) {
  await writeFile(
    `status/${result.name}.json`,
    `${JSON.stringify({
      schemaVersion: 1,
      label: result.name,
      message: result.ok ? "up" : "down",
      color: result.ok ? "brightgreen" : "red",
    })}\n`
  );

  const zhName = result.name === "tencent" ? "腾讯" : result.name;
  await writeFile(
    `status/${result.name}.zh-CN.json`,
    `${JSON.stringify({
      schemaVersion: 1,
      label: zhName,
      message: result.ok ? "可用" : "不可用",
      color: result.ok ? "brightgreen" : "red",
    })}\n`
  );
}

await writeFile("status/status.json", `${JSON.stringify({ results }, null, 2)}\n`);
