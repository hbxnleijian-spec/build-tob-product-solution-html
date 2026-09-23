#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const [, , rootArg, outputArg, ...extras] = process.argv;
if (!rootArg || !outputArg) {
  console.error("用法：node create-release-manifest.mjs <Skill根目录> <输出.json> [标签=路径 ...]");
  process.exit(2);
}

const root = path.resolve(rootArg);
const output = path.resolve(outputArg);
function hashFile(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (full === output || entry.name === "release-manifest.json") return [];
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(root).sort().map(file => ({
  path: path.relative(root, file).replaceAll("\\", "/"),
  bytes: fs.statSync(file).size,
  sha256: hashFile(file)
}));
const external = extras.map(item => {
  const index = item.indexOf("=");
  if (index < 1) throw new Error(`无效的外部交付项：${item}`);
  const label = item.slice(0, index);
  const file = path.resolve(item.slice(index + 1));
  const relative = path.relative(root, file);
  const publicPath = relative.startsWith("..") || path.isAbsolute(relative)
    ? path.basename(file)
    : relative.replaceAll("\\", "/");
  return { label, path: publicPath, bytes: fs.statSync(file).size, sha256: hashFile(file) };
});
const manifest = {
  skill_name: "build-tob-product-solution-html",
  skill_version: "1.0.2",
  component_catalog_version: "1.0.0",
  schema_version: "1.0.0",
  minimum_compatible_version: "1.0.0",
  compatibility: "初始稳定版本；后续次版本只能增加兼容能力，必须保持向后兼容",
  generated_at: new Date().toISOString(),
  update_policy: "仅允许经过校验的人工更新；不得进行无人值守自动更新",
  files,
  external_deliverables: external
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output, files: files.length, external: external.length }, null, 2));
