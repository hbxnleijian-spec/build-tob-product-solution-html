---
name: build-tob-product-solution-html
description: 使用可复用的咨询式组件体系、事实状态语义、响应式布局和 A4 打印规则，创建、改造或审查中文 ToB 产品方案独立 HTML。适用于企业产品方案、建设方案、规划方案、专项方案、领导审议稿、实施路线图及其他以 HTML 交付的决策型文档。不适用于后台产品界面、数据看板、营销网站、演示文稿、Word 文档或通用 Web 应用。
---

# 构建 ToB 产品方案 HTML

使用内置组件体系构建面向决策、可离线独立运行的 HTML 文档。除非用户明确授权修改业务内容，否则必须保留证据边界和原有内容。

## 工作流程

1. 明确受众、文档类型、决策阶段、输出位置，以及任务属于新建、视觉改造还是仅审查。
2. 将内容区分为已确认事实、来源要求、分析推断、建议方案、规划目标、风险或待确认事项。不得把目标、建议、示例或 AI 输出描述为已经实现的事实。
3. 阅读 `references/component-selection.md`，选择能够清楚表达决策结构的最小组件集合。遇到证据敏感、AI、财务、合规或领导审议内容时，再阅读 `references/content-governance.md`。
4. 从 `assets/starter-template.html` 开始编制。使用 `assets/component-gallery.html` 查看完整示例，使用 `references/component-catalog.json` 查询组件标识、必填字段、来源、变体、历史映射和打印策略。
5. 使用源自 V1.3 的默认咨询式主题，或仅覆盖 `--tob-*` 语义变量进行客户品牌换肤。所有新增类名必须位于 `.tob-*` 命名空间。
6. 为可复用区块声明 `data-component`、`data-origin="v13|supplemental"`；区块包含事实或决策判断时，还必须声明恰当的 `data-semantic` 值。
7. 编制源文件时不得引用远程字体、脚本、样式、图片或 CDN。源文件使用内置资源时，通过 `node scripts/build-standalone.mjs <源文件.html> <输出文件.html>` 将本地 CSS 和 JavaScript 内联为最终单文件。
8. 运行 `node scripts/validate-html.mjs <输出文件.html>` 和 `node scripts/verify-theme-contrast.mjs`。修复全部错误；将警告作为评审事项处理，并明确说明已接受的警告。
9. 在条件允许时，使用 Chrome 和 Edge 验证桌面、窄屏、移动端与打印效果。检查标题、锚点、溢出、图片、表格、分页、键盘焦点，以及客户主题覆盖后的颜色对比度。
10. 交付方案 HTML、校验结果、已使用的组件族，以及仍未验证的事项或风险。

## 编制规则

- 仅调整展示时必须保留用户原文，不得静默改写事实、范围、指标、日期、组织、职责或审批状态。
- 卡片只用于表达同层级并列概念，不用于包装普通段落。连续论述优先使用正文，重复字段比较优先使用表格。
- 每个章节只保留一个最高强调级别的结论，并使用文字语义标签，不得只依靠颜色传达含义。
- 宽表必须放入 `.tob-table-wrap`，不得产生页面级横向滚动。
- 金额、权限、状态、审批、计算和正式记录等确定性结果必须由规则或程序负责；AI 仅用于检索、抽取、解释、起草和提出建议。
- 使用待确认、假设、依赖或证据缺口组件显式呈现材料不足，不得用虚构的企业事实填补空白。
- 最终 HTML 必须独立于已安装 Skill 运行，确保后续 Skill 更新不会改变历史交付文件。

## 资源调用规则

- 选择或组合组件时，读取 `references/component-selection.md`。
- 处理事实分级、领导表达、AI 边界、示例和验收措辞时，读取 `references/content-governance.md`。
- 仅在安装、升级、废弃或回滚本 Skill 时，读取 `references/update-policy.md`。
- 需要精确组件元数据或 V1.3 历史类名覆盖情况时，查询 `references/component-catalog.json`。
- 新建方案时复制 `assets/starter-template.html`；需要查看视觉示例时打开 `assets/component-gallery.html`。
- 交付前先运行 `scripts/build-standalone.mjs` 内联 CSS/JavaScript，再运行 `scripts/validate-html.mjs` 和 `scripts/verify-theme-contrast.mjs`。

## 完成门槛

只有同时满足以下条件，才能将文档标记为已完成：校验器无错误；全部导航锚点可用；不存在不可控外部资源；桌面与窄屏无页面级溢出；打印规则完整；所有重大不确定事项均已显式标识。
