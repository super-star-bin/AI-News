# AI News Operations

这是一个由 Codex CLI 主控的小红书 AI 题材账号运营工作区。

当前阶段：单人验证，不使用 Notion 和飞书。本地 Markdown、CSV 和脚本是唯一事实源。

## 目录说明

| 目录/文件 | 中文名称 | 作用 |
| --- | --- | --- |
| `AGENTS.md` | Codex 项目规则 | Codex CLI 每次进入项目后优先读取的工作规则，包含账号定位、事实核验、自动化边界和沙箱处理方式。 |
| `checklist.md` | 建设清单 | 追踪项目从目录、数据表、skill、脚本到验收的建设进度。 |
| `README.md` | 项目说明 | 说明项目用途、启动方式、目录结构和常用命令。 |
| `.agents/skills/xhs-ai-operator/` | 小红书 AI 运营 Skill | repo 级 Codex skill，封装每日链接收集、选题、核验、草稿和复盘流程。 |
| `sources/` | 信源库 | 存放 RSS/网页信源、人物观察名单、来源分级规则和网络白名单。 |
| `data/` | 本地主库 | 存放候选选题、已发布笔记数据、评论/私信需求等 CSV 数据。 |
| `data/topics.md` | 选题浏览表 | 由 `data/topics.csv` 自动生成的对齐表格视图，用于在 VSCode/GitHub 中快速浏览和审核。 |
| `assets/brand/` | 品牌资产 | 存放账号 Logo、头像、横版标识和后续统一视觉资产。 |
| `outputs/xhs/` | 发布素材 | 存放每篇小红书图文的结构化源数据、SVG 源文件、PNG 发布图和发布说明。 |
| `inbox/` | 输入箱 | 存放每日收集到的原始链接和人工补充材料。 |
| `inbox/screenshots/` | 截图素材 | 存放工具实测截图、网页截图和发布前素材。 |
| `briefs/` | 简报库 | 存放每日 AI 选题简报和周简报。 |
| `drafts/` | 草稿库 | 存放小红书图文草稿、正文、标题和封面文案。 |
| `factchecks/` | 事实核验库 | 存放发布前事实核验记录、来源等级和风险判断。 |
| `reviews/` | 复盘库 | 存放周复盘、月度资产盘点、系统建设记录和验收结果。 |
| `templates/` | 模板库 | 存放 Prompt、7 页图文模板、事实核验模板、复盘模板和人工审核清单。 |
| `automations/` | 自动化说明 | 存放自动化脚本说明、测试样例和脚本入口。 |
| `automations/scripts/` | 自动化脚本 | 存放抓取、去重、评分、入库、数据校验、工作区审计和发布后记录脚本。 |
| `docs/` | 使用文档 | 存放 Codex CLI 工作流等补充说明。 |

## 快速开始

从项目根目录启动 Codex：

```bash
codex
```

优先让 Codex 读取：

- `AGENTS.md`
- `checklist.md`
- `.agents/skills/xhs-ai-operator/SKILL.md`

常用任务：

```text
请使用 xhs-ai-operator，完成今天的小红书 AI 账号链接收集和每日简报。
```

## Codex CLI 自动化

脚本化任务建议使用：

```bash
codex exec --sandbox workspace-write "请读取 checklist.md，执行下一个未完成任务。"
```

本项目已经初始化 git。每次自动化后都应查看 diff：

```bash
git status --short
git diff
```

如果未来在未初始化 git 的临时目录中运行 `codex exec`，`--skip-git-repo-check` 只能作为临时选项，不建议作为常规流程。

## 本地命令

```bash
npm run fetch:today
npm run translate:topics
npm run format:topics
npm run render:xhs -- outputs/xhs/2026-06-25/realtime-voice-ai/source.json
npm run validate:data
npm run audit
```

联网前请确认 VPN 和网络权限。脚本只应访问 `sources/network_allowlist.md` 中的公开域名。

## 内容语言规则

抓取到的资讯、论文、项目、标题或摘要如果包含英文，输出到 `inbox/`、`briefs/`、`drafts/` 或 `factchecks/` 时，必须在英文后补充中文解释说明。中文说明至少解释三点：

1. 这条英文内容大概讲什么。
2. 为什么值得关注。
3. 对小红书目标用户有什么意义。

`data/topics.csv` 有两个专门字段：

- `选题标题中文翻译`
- `AI摘要中文翻译`

如果 `选题标题` 或 `AI摘要` 是英文，必须补充对应中文翻译；如果原文已经是中文，则对应翻译字段可以留空。抓取新选题后可运行：

```bash
npm run translate:topics
```

刷新选题浏览表：

```bash
npm run format:topics
```

`data/topics.csv` 是唯一机器可读主库；`data/topics.md` 只作为对齐浏览视图，不要手工编辑。

生成小红书图文素材：

```bash
npm run render:xhs -- outputs/xhs/2026-06-25/realtime-voice-ai/source.json
```

图文必须遵守 `docs/xhs_design_spec.md`。发布用 PNG 在 `outputs/xhs/.../cards/`，Logo 在 `assets/brand/`。
