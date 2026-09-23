#!/usr/bin/env node
const pairs = [
  ["正文 / 页面背景", "#172b3d", "#edf2f6", 4.5],
  ["次要文字 / 纸张背景", "#607286", "#ffffff", 4.5],
  ["导航文字 / 导航背景", "#dceaf2", "#082946", 4.5],
  ["导航次要文字 / 导航背景", "#a8c7da", "#082946", 4.5],
  ["白色文字 / 深蓝背景", "#ffffff", "#0b2e4f", 4.5],
  ["中性主题正文 / 页面背景", "#25313d", "#eef1f4", 4.5],
  ["中性主题次要文字 / 纸张背景", "#6b7785", "#ffffff", 4.5]
];

function luminance(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function ratio(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const results = pairs.map(([name, foreground, background, minimum]) => {
  const contrast = ratio(foreground, background);
  return { name, foreground, background, minimum, contrast: Number(contrast.toFixed(2)), passed: contrast >= minimum };
});
const passed = results.every(result => result.passed);
console.log(JSON.stringify({ standard: "WCAG AA 普通文本", passed, results }, null, 2));
process.exit(passed ? 0 : 1);
