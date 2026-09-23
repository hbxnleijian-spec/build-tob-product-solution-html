#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [, , inputArg, outputArg] = process.argv;
if (!inputArg || !outputArg) {
  console.error("用法：node build-standalone.mjs <源文件.html> <输出文件.html>");
  process.exit(2);
}

const input = path.resolve(inputArg);
const output = path.resolve(outputArg);
const base = path.dirname(input);
let html = fs.readFileSync(input, "utf8");

function readLocal(relativePath) {
  if (/^(?:https?:)?\/\//i.test(relativePath) || /^data:/i.test(relativePath)) {
    throw new Error(`只能内联本地资源：${relativePath}`);
  }
  const resolved = path.resolve(base, relativePath);
  const rel = path.relative(base, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`资源路径超出源文件目录：${relativePath}`);
  }
  return fs.readFileSync(resolved, "utf8");
}

html = html.replace(
  /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
  (_, href) => `<style data-inlined-from="${href}">\n${readLocal(href)}\n</style>`
);
html = html.replace(
  /<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi,
  (_, src) => `<script data-inlined-from="${src}">\n${readLocal(src)}\n</script>`
);

const remainingRemote = [...html.matchAll(/(?:src|href)=["'](?:https?:)?\/\//gi)];
if (remainingRemote.length) {
  throw new Error(`构建后仍存在远程资源：${remainingRemote.length}`);
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, "utf8");
console.log(JSON.stringify({ input, output, bytes: Buffer.byteLength(html), standalone: true }, null, 2));
