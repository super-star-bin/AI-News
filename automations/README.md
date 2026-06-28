# 自动化脚本说明

本目录用于维护小红书 AI 账号的本地自动化能力。当前阶段只做公开信息收集、去重、评分、入库和审核，不做自动发布。

## Node.js 要求

- Node.js 18 或更高版本。
- 不依赖第三方 npm 包。

## 常用命令

```bash
npm run fetch:today
npm run translate:topics
npm run format:topics
npm run render:xhs -- outputs/xhs/2026-06-25/realtime-voice-ai/source.json
npm run validate:data
npm run audit
npm run record:post -- --topic-id T20260625-004 --title "标题" --url "https://www.xiaohongshu.com/..."
```

## 每日链接收集

```bash
node automations/scripts/fetch_sources.mjs --dry-run
node automations/scripts/fetch_sources.mjs
```

`--dry-run` 不访问网络、不写文件，只打印计划访问的来源和输出路径。

正式运行会尝试访问公开 RSS/API，输出：

- `inbox/raw_links_YYYY-MM-DD.md`
- `briefs/daily_brief_YYYY-MM-DD.md`
- `data/topics.csv`

抓取后如果 `data/topics.csv` 中的 `选题标题` 或 `AI摘要` 是英文，运行：

```bash
npm run translate:topics
```

该命令会补齐 `选题标题中文翻译` 和 `AI摘要中文翻译`。如果原文已经是中文，对应翻译列可以留空。

刷新人工浏览表格：

```bash
npm run format:topics
```

`data/topics.csv` 是机器处理的主库，保持标准 CSV；`data/topics.md` 是自动生成的对齐浏览视图，不要手工编辑。

## 网络权限边界

- 优先使用 `sources/network_allowlist.md` 中的公开域名。
- 优先使用 GET/HEAD 请求。
- 不登录任何账号。
- 不保存 Cookie、Token、API Key。
- 不抓取付费墙或受版权保护全文。

## 失败降级

如果网络访问失败：

1. 将手动收集的链接写入 `inbox/raw_links_YYYY-MM-DD.md`。
2. 让 Codex 读取该文件生成每日简报。
3. 后续再修复对应来源脚本。

## 发布后记录

小红书仍然由人工发布。发布后用脚本记录链接和初始数据：

```bash
npm run record:post -- --topic-id T20260625-004 --title "标题" --url "https://www.xiaohongshu.com/..." --views 0 --likes 0 --collects 0 --comments 0
```

## 图文素材生成

先把单篇图文源数据写入：

```text
outputs/xhs/YYYY-MM-DD/topic-slug/source.json
```

再运行：

```bash
npm run render:xhs -- outputs/xhs/YYYY-MM-DD/topic-slug/source.json
```

脚本会生成：

- `assets/brand/logo_avatar.png`
- `assets/brand/logo_lockup.png`
- `outputs/xhs/YYYY-MM-DD/topic-slug/cards/*.png`

所有图文必须遵守 `docs/xhs_design_spec.md`。
