#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [, , htmlArg, catalogArg] = process.argv;
if (!htmlArg || !catalogArg) {
  console.error("用法：node verify-gallery-catalog.mjs <组件展廊.html> <组件目录.json>");
  process.exit(2);
}
const html = fs.readFileSync(path.resolve(htmlArg), "utf8");
const catalog = JSON.parse(fs.readFileSync(path.resolve(catalogArg), "utf8"));
const declared = new Set([...html.matchAll(/data-component=["']([^"']+)["']/g)].map(match => match[1]));
const ids = new Set(catalog.components.map(component => component.id));
const missingExamples = [...ids].filter(id => !declared.has(id)).sort();
const undocumented = [...declared].filter(id => !ids.has(id)).sort();
const result = {
  catalogComponents: ids.size,
  galleryComponents: declared.size,
  missingExamples,
  undocumented,
  passed: missingExamples.length === 0 && undocumented.length === 0
};
console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
