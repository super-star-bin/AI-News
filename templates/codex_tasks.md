# Codex 常用任务 Prompt

## 初始化工作区

```text
请读取 `checklist.md`，执行项目初始化相关的未完成任务。完成后运行 `npm run audit`，并更新 checklist 勾选状态。
```

## 今日链接收集

```text
请使用 xhs-ai-operator，完成今天的小红书 AI 账号链接收集。

要求：
1. 先运行 `node automations/scripts/fetch_sources.mjs --dry-run`。
2. 如果 dry-run 正常，再请求联网权限访问白名单域名。
3. 输出 `inbox/raw_links_YYYY-MM-DD.md` 和 `briefs/daily_brief_YYYY-MM-DD.md`。
4. 更新 `data/topics.csv`。
```

## 生成每日简报

```text
请读取今天的 `inbox/raw_links_YYYY-MM-DD.md`，生成 `briefs/daily_brief_YYYY-MM-DD.md`，并推荐最值得发布的 1 个选题。
```

## 对指定 topic 做事实核验

```text
请对 topic_id 为 [填写 ID] 的选题做事实核验，输出到 `factchecks/factcheck_YYYY-MM-DD_topic-slug.md`，并更新 `data/topics.csv`。
```

## 生成小红书草稿

```text
请基于指定 topic 的每日简报和事实核验，生成小红书 7 页图文草稿，写入 `drafts/xhs_YYYY-MM-DD_topic-slug.md`。
```

## 更新发布数据

```text
我已经手动发布小红书，链接和数据如下：[粘贴]。请更新 `data/posts.csv` 和 `data/topics.csv`。
```

## 周复盘

```text
请读取 `data/posts.csv`、`data/topics.csv` 和 `data/user_needs.csv`，生成本周复盘，写入 `reviews/weekly_review_YYYY-WW.md`。
```

## 审核脚本输出

```text
请运行 `npm run validate:data` 和 `npm run audit`。如果失败，只修复失败项，不做无关重构。
```

