#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [, , htmlArg, catalogArg] = process.argv;
if (!htmlArg || !catalogArg) {
  console.error("用法：node verify-legacy-map.mjs <历史版本.html> <组件目录.json>");
  process.exit(2);
}

const html = fs.readFileSync(path.resolve(htmlArg), "utf8");
const catalog = JSON.parse(fs.readFileSync(path.resolve(catalogArg), "utf8"));
const used = new Set(
  [...html.matchAll(/class=["']([^"']+)["']/g)]
    .flatMap(match => match[1].trim().split(/\s+/))
    .filter(Boolean)
);
const mapped = catalog.legacy_class_groups.flatMap(group => group.classes);
const mappedSet = new Set(mapped);
const missing = [...used].filter(name => !mappedSet.has(name)).sort();
const extra = [...mappedSet].filter(name => !used.has(name)).sort();
const duplicates = [...new Set(mapped.filter((name, index) => mapped.indexOf(name) !== index))].sort();
const result = {
  used: used.size,
  mapped: mappedSet.size,
  missing,
  extra,
  duplicates,
  components: catalog.components.length,
  passed: missing.length === 0 && extra.length === 0 && duplicates.length === 0
};
console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
