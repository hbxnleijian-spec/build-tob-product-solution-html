#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [, , fileArg] = process.argv;
if (!fileArg) {
  console.error("用法：node validate-html.mjs <HTML文件>");
  process.exit(2);
}

const file = path.resolve(fileArg);
const html = fs.readFileSync(file, "utf8");
const errors = [];
const warnings = [];
const checks = {};

function requireCheck(name, condition, message) {
  checks[name] = Boolean(condition);
  if (!condition) errors.push(message);
}

requireCheck("doctype", /^\s*<!doctype html>/i.test(html), "缺少 HTML5 doctype 声明。");
requireCheck("lang", /<html\b[^>]*\blang=["']zh-CN["']/i.test(html), "html 的 lang 必须为 zh-CN。");
requireCheck("charset", /<meta\b[^>]*charset=["']?utf-8/i.test(html), "缺少 UTF-8 字符集声明。");
requireCheck("viewport", /<meta\b[^>]*name=["']viewport["']/i.test(html), "缺少 viewport 元信息。");
requireCheck("title", /<title>\s*[^<]+\s*<\/title>/i.test(html), "缺少非空标题。");
requireCheck("version", /data-tob-version=["'][^"']+["']/i.test(html), "缺少 data-tob-version。");
requireCheck("theme", /data-tob-theme=["'][^"']+["']/i.test(html), "缺少 data-tob-theme。");
requireCheck("print", /@media\s+print/i.test(html), "缺少打印样式。");

const remoteResources = [...html.matchAll(/(?:src|href)=["']((?:https?:)?\/\/[^"']+)/gi)].map(m => m[1]);
checks.offline = remoteResources.length === 0;
if (remoteResources.length) errors.push(`不允许使用远程资源：${remoteResources.join(", ")}`);

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]);
const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
checks.unique_ids = duplicateIds.length === 0;
if (duplicateIds.length) errors.push(`存在重复 ID：${duplicateIds.join(", ")}`);

const idSet = new Set(ids);
const anchors = [...html.matchAll(/\bhref=["']#([^"']+)["']/gi)].map(m => m[1]);
const brokenAnchors = [...new Set(anchors.filter(id => !idSet.has(id)))];
checks.anchors = brokenAnchors.length === 0;
if (brokenAnchors.length) errors.push(`存在失效的内部锚点：${brokenAnchors.join(", ")}`);

const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
const missingAlt = images.filter(m => !/\balt=["'][^"']*["']/i.test(m[1]));
checks.image_alt = missingAlt.length === 0;
if (missingAlt.length) errors.push(`${missingAlt.length} 个图片缺少 alt 属性。`);

const componentTags = [...html.matchAll(/<[^>]+\bdata-component=["'][^"']+["'][^>]*>/gi)].map(m => m[0]);
const missingOrigin = componentTags.filter(tag => !/\bdata-origin=["'](?:v13|supplemental)["']/i.test(tag));
checks.component_origin = missingOrigin.length === 0;
if (missingOrigin.length) errors.push(`${missingOrigin.length} 个组件缺少有效的 data-origin。`);

const semantics = [...html.matchAll(/\bdata-semantic=["']([^"']+)["']/gi)].map(m => m[1]);
const allowed = new Set(["confirmed", "requirement", "inference", "recommendation", "target", "tbd", "risk"]);
const invalidSemantics = [...new Set(semantics.filter(value => !allowed.has(value)))];
checks.semantics = invalidSemantics.length === 0;
if (invalidSemantics.length) errors.push(`存在无效的 data-semantic 值：${invalidSemantics.join(", ")}`);

const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map(m => Number(m[1]));
for (let i = 1; i < headings.length; i += 1) {
  if (headings[i] - headings[i - 1] > 1) {
    warnings.push(`第 ${i + 1} 个标题附近发生标题层级跳跃：h${headings[i - 1]} 到 h${headings[i]}。`);
  }
}

if (!/focus-visible/i.test(html)) warnings.push("未找到 :focus-visible 规则。");
if (!/\.tob-table-wrap/i.test(html)) warnings.push("未找到 tob-table-wrap 组件。");
if (!/aria-label=/i.test(html)) warnings.push("未找到 aria-label 属性。");

const result = {
  file,
  bytes: Buffer.byteLength(html),
  components: componentTags.length,
  images: images.length,
  internalAnchors: anchors.length,
  checks,
  errors,
  warnings,
  passed: errors.length === 0
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
