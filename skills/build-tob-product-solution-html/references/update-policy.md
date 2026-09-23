# 更新与回滚规范

## 稳定标识

已安装目录和 Skill 名称始终固定为 `build-tob-product-solution-html`，不得并行创建 `-v1`、`-v2` 等重复 Skill。

## 版本规则

- 补丁版本：修正文案、CSS 或校验规则，不改变组件接口。
- 次版本：新增组件或可选字段，现有模板必须继续可用。
- 主版本：对类名、目录、数据结构或必填字段进行破坏性变更，必须提供迁移映射。

在 `release-manifest.json` 中分别维护 `skill_version`、`component_catalog_version`、`schema_version` 和 `minimum_compatible_version`。

## 升级流程

1. 在已安装目录之外构建候选版本。
2. 校验 Skill 结构、组件目录覆盖率、模板、脚本、两份代表性方案和向后兼容性。
3. 将当前安装目录备份到 `$CODEX_HOME/skill-backups/build-tob-product-solution-html/<版本-时间>`；未设置 `CODEX_HOME` 时使用用户目录下的 `.codex`。
4. 只有全部门槛通过后，才能替换固定安装目录。
5. 新建 Codex 任务或重启 Codex，使技能列表重新扫描。
6. 分别验证 `$build-tob-product-solution-html` 显式调用和自然语言触发。
7. 更新可浏览的组件规范和发布清单。

不得实施无人值守的自动更新。

## 兼容性

废弃别名至少保留一个次版本，并在组件目录中记录历史标识到当前标识的映射。生成的单文件 HTML 在运行时不得依赖已安装 Skill。

## 回滚

候选版本校验失败时不得替换稳定安装。安装后发现回归时，恢复最近一次备份，重新执行结构校验，并在新任务中复测显式调用。
