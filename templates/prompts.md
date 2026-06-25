# 常用 Prompt

## 今日链接收集

```text
请帮我完成今天的小红书 AI 账号链接收集。

前提：
- 我已经打开 VPN。
- 只访问 `sources/` 中列出的信源和公开网页。
- 不登录任何账号，不自动发布，不自动评论。

请执行：
1. 读取 `sources/rss_sources.md`、`sources/people_watchlist.md`、`sources/source_rating_rules.md`。
2. 收集最近 24-48 小时内值得关注的 AI 相关链接 10-20 条。
3. 优先级：官方博客 / GitHub / arXiv / Hugging Face / HN / Reddit / 高质量媒体 / 核心人物公开发言。
4. 过滤二手搬运、无来源截图、标题党、重复报道。
5. 每条链接给出：标题、URL、来源、发布时间、来源等级、推荐栏目、用户价值、风险提示。
6. 如果标题、摘要或引用内容包含英文，必须在英文后补充中文说明，解释它讲什么、为什么值得关注、对目标用户有什么意义。
7. 将原始候选写入 `inbox/raw_links_YYYY-MM-DD.md`。
8. 生成 Top 10 选题简报，写入 `briefs/daily_brief_YYYY-MM-DD.md`。
9. 将候选选题追加到 `data/topics.csv`。

要求：
- 不要编造来源。
- 不要把社区热帖当成事实，只能当选题线索。
- 如果网络访问失败，请说明失败域名和下一步手动替代方案。
- 最后推荐今天最值得发布的 1 个选题。
```

## 每日 AI 简报

```text
请读取 `inbox/raw_links_YYYY-MM-DD.md` 和 `sources/` 下的信源规则，生成今天的小红书 AI 选题简报。

要求：
1. 输出 Top 10 候选选题。
2. 每个选题标注来源等级、适合栏目、主线、用户价值、核验风险。
3. 如果选题标题、摘要或引用内容包含英文，必须在英文后补充中文说明。
4. 推荐今天最值得发布的 1 个选题。
5. 写入 `briefs/daily_brief_YYYY-MM-DD.md`。
6. 将候选选题追加到 `data/topics.csv`。
```

## 事实核验

```text
今天选择这个选题：[粘贴 topic_id、选题标题和链接]。

请做发布前事实核验：
1. 抽取所有可验证事实。
2. 找出必须打开原始链接确认的点。
3. 标注哪些说法只能作为观点，不能当事实。
4. 给出发布风险：低/中/高。
5. 输出到 `factchecks/factcheck_YYYY-MM-DD_topic-slug.md`。
6. 更新 `data/topics.csv` 中这个选题的事实核验和发布状态。
```

## 小红书 7 页图文草稿

```text
基于 `briefs/daily_brief_YYYY-MM-DD.md` 和 `factchecks/factcheck_YYYY-MM-DD_topic-slug.md`，写一篇小红书图文草稿。

栏目：[今日值得看/工具实测/开源项目拆解/论文变应用/避坑指南]

要求：
1. 输出 7 页卡片文案。
2. 输出正文。
3. 输出标题备选 5 个。
4. 输出封面文案 3 个。
5. 标注需要我补充截图、实测或链接的地方。
6. 写入 `drafts/xhs_YYYY-MM-DD_topic-slug.md`。
7. 更新 `data/topics.csv` 的草稿路径和发布状态。
```

## 实测后修稿

```text
我补充了实测结论和截图说明：[粘贴简短说明]。

请更新 `drafts/xhs_YYYY-MM-DD_topic-slug.md`：
1. 把未实测的表达改成已实测口吻。
2. 保留限制和缺点。
3. 生成 10 条评论区回复。
4. 输出最终发布版。
```

## 评论区回复建议

```text
请基于这篇草稿和评论问题，生成小红书评论区回复建议。

要求：
1. 不引导违规站外跳转。
2. 不承诺收益。
3. 不夸大工具效果。
4. 对价格、可用性、替代方案保持谨慎。
5. 输出 10 条可直接改写使用的回复。
```

## 周复盘

```text
请读取 `data/posts.csv`、`data/topics.csv` 和 `data/user_needs.csv`，生成本周小红书复盘。

请输出：
1. 本周表现最好的 3 篇和原因。
2. 收藏率最高的选题规律。
3. 评论和私信中的高频需求。
4. 下周最值得做的 10 个选题。
5. 哪些内容适合沉淀为资料包、模板、训练营或咨询服务。
6. 写入 `reviews/weekly_review_YYYY-WW.md`。
```

## 月度资产盘点

```text
请复盘本月 `drafts/`、`briefs/`、`reviews/`、`data/topics.csv` 和 `data/posts.csv`。

请输出：
1. 本月内容资产清单。
2. 可以做成免费资料包的主题。
3. 可以做成低价产品的主题。
4. 可以做成 B 端服务的主题。
5. 下个月 4 周内容日历。
6. 需要补充实测或案例的空白。
7. 写入 `reviews/monthly_review_YYYY-MM.md`。
```
