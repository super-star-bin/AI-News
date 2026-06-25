---
name: xhs-ai-operator
description: 用于小红书 AI 题材账号的单人运营工作流，包括每日链接收集、选题简报、事实核验、图文草稿、发布后数据复盘和内容资产化。适用于用户提到小红书、AI 账号、选题、简报、事实核验、草稿、复盘、资料包时。
---

# xhs-ai-operator

使用本技能时，Codex 必须围绕当前仓库的本地文件工作，不使用 Notion 和飞书，不自动发布小红书，不自动回复私信。

## 必读上下文

根据任务类型读取对应 reference：

- 选题、链接收集、简报：读取 `references/source_rating_rules.md` 和 `references/content_columns.md`。
- 草稿、标题、正文：读取 `references/xhs_style_guide.md` 和 `references/content_columns.md`。
- 事实核验：读取 `references/factcheck_checklist.md` 和 `references/source_rating_rules.md`。

同时优先使用根目录：

- `AGENTS.md`
- `sources/`
- `templates/`
- `data/`

## 每日链接收集

1. 读取 `sources/rss_sources.md`、`sources/people_watchlist.md`、`sources/source_rating_rules.md`。
2. 优先调用 `automations/scripts/fetch_sources.mjs --dry-run` 检查配置。
3. 如用户已允许联网，再运行 `npm run fetch:today` 或等价脚本。
4. 输出 `inbox/raw_links_YYYY-MM-DD.md`。
5. 生成 `briefs/daily_brief_YYYY-MM-DD.md`。
6. 更新 `data/topics.csv`。

## 选题评分

评分维度：

- 新鲜度
- 可靠性
- 实用性
- 传播性
- 账号匹配度

只推荐有一手来源、能实测、能形成收藏价值的选题。

## 事实核验

1. 抽取可验证事实。
2. 区分事实、观点、推测、用户评论。
3. 每条事实尽量绑定来源链接和来源等级。
4. 不确定内容写“不确定”。
5. 输出到 `factchecks/factcheck_YYYY-MM-DD_topic-slug.md`。

## 图文草稿

默认输出：

- 7 页卡片脚本
- 正文
- 标题备选 5 个
- 封面文案 3 个
- 需要人工补截图、实测或链接的位置
- 适合谁/不适合谁

写入 `drafts/xhs_YYYY-MM-DD_topic-slug.md`。

## 发布后记录

发布动作必须由用户手动完成。用户提供小红书链接和数据后，更新：

- `data/posts.csv`
- `data/topics.csv`

## 周复盘

读取：

- `data/posts.csv`
- `data/topics.csv`
- `data/user_needs.csv`

输出：

- 本周表现 Top 3
- 收藏率最高内容规律
- 高频需求
- 下周 10 个选题
- 可资产化内容

写入 `reviews/weekly_review_YYYY-WW.md`。

## 禁止事项

- 不编造来源。
- 不自动发布小红书。
- 不自动回复私信。
- 不保存密码、Cookie、Token。
- 不绕过登录或反爬。
- 不把社区讨论当事实。
- 不把未实测内容写成已实测。

