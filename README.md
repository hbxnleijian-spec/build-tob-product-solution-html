# build-tob-product-solution-html

面向中文 ToB 产品方案、建设方案、规划方案和领导审议稿的 Codex Skill。它提供可复用的纯 HTML/CSS/JavaScript 组件体系、内容治理规则、响应式布局、A4 打印规范与自动校验脚本。

## 适用范围

- 新建中文 ToB 产品方案、建设方案、规划方案、专项方案和实施路线图 HTML。
- 在不擅自改写业务内容的前提下，改造既有方案 HTML 的组件、布局和主题。
- 审查方案的事实边界、组件使用、离线资源、响应式表现、打印分页和可访问性。

不用于后台产品界面、数据看板、营销网站、PPT、Word 文档或通用 Web 应用。

## 目录结构

```text
skills/
└── build-tob-product-solution-html/
    ├── SKILL.md
    ├── agents/
    ├── assets/
    ├── references/
    ├── scripts/
    └── release-manifest.json
```

组件展廊位于 `skills/build-tob-product-solution-html/assets/component-gallery.html`，空白模板位于 `assets/starter-template.html`。

## 安装

### 使用 Codex skill-installer

在 Codex 中输入：

```text
请使用 $skill-installer 从 https://github.com/hbxnleijian-spec/build-tob-product-solution-html/tree/v1.0.2/skills/build-tob-product-solution-html 安装 Skill。
```

对应的安装参数为：

```text
--repo hbxnleijian-spec/build-tob-product-solution-html --path skills/build-tob-product-solution-html --ref v1.0.2
```

安装完成后，新建任务或重启 Codex，使技能列表重新扫描。

### 手工安装

将 `skills/build-tob-product-solution-html` 整个目录复制到：

```text
$CODEX_HOME/skills/build-tob-product-solution-html
```

未设置 `CODEX_HOME` 时，默认使用用户目录下的 `.codex/skills`。

## 使用

显式调用：

```text
$build-tob-product-solution-html 创建一份面向领导审议的建设方案 HTML。
```

也可使用自然语言：

```text
请按 ToB 产品方案 HTML 组件标准创建、改造或审查这份方案。
```

## 本地校验

进入 Skill 目录后运行：

```text
node scripts/verify-gallery-catalog.mjs assets/component-gallery.html references/component-catalog.json
node scripts/validate-html.mjs assets/component-gallery.html
node scripts/validate-html.mjs assets/starter-template-standalone.html
node scripts/verify-theme-contrast.mjs
```

正式交付方案时运行：

```text
node scripts/build-standalone.mjs <源文件.html> <输出文件.html>
node scripts/validate-html.mjs <输出文件.html>
```

## 版本与公开边界

- Skill 版本：`1.0.2`
- 组件目录版本：`1.0.0`
- 数据结构版本：`1.0.0`
- 最低兼容版本：`1.0.0`

该组件体系源自真实项目的 V1.3 方案基线验证，但原始项目文件、客户信息、本机路径和源文件哈希未随公开仓库发布。仓库中的示例均为通用示例，不代表任何真实项目已经实现相关能力或成效。

## 许可证

本项目采用 [MIT License](LICENSE)。
