# 小红书 AI 账号运营系统 Checklist

日期：2026-06-25  
项目定位：由 Codex CLI 作为主 AI Agent，围绕 VSCode 本地项目维护一套小红书 AI 题材账号的半自动运营能力。  
当前阶段：单人验证，不使用 Notion 和飞书，本地 Markdown/CSV/脚本作为唯一事实源。

## 使用方式

给 Codex CLI 的总控提示词：

```text
请读取 `checklist.md`，从第一个未完成任务开始执行。

执行要求：
1. 每次只推进一个小阶段，完成后更新对应 checklist 勾选状态。
2. 修改文件前先说明将要修改哪些文件。
3. 不要写入项目目录以外的位置。
4. 不要保存账号密码、Cookie、Token 或小红书登录态。
5. 涉及联网时只访问 checklist 中允许的公开信源域名，优先使用 GET/HEAD 请求。
6. 每完成一个阶段，运行该阶段的审核命令，并把结果写入 `reviews/system_build_review.md`。
```

进度状态约定：

- `[ ]` 未开始
- `[x]` 已完成并通过验收
- `[!]` 阻塞，需要人工处理

## 0. 执行边界

- [x] 确认本项目只服务“小红书 AI 题材账号运营系统”，不混入其他项目文件。
  - 产物：无。
  - 验收：根目录至少包含策略文档、`checklist.md`，后续新增文件都服务本项目。

- [x] 确认当前阶段不接入 Notion、飞书、自动发布、自动私信回复。
  - 产物：写入 `AGENTS.md` 的项目边界。
  - 验收：`rg -n "Notion|飞书|自动发布|自动私信" AGENTS.md checklist.md` 能看到这些能力被标为“后续/不做”。

- [x] 建立变更审计习惯。
  - 建议：优先把当前目录初始化为 git 仓库，方便 Codex CLI 做 diff 和回滚审查。
  - 产物：`.git/`、`.gitignore`。
  - 验收：`git status --short` 可用。
  - 说明：如果暂时不初始化 git，使用 `codex exec` 时可能需要 `--skip-git-repo-check`，但这只应作为临时方案。

## 1. 项目目录规范

- [x] 创建标准目录。
  - 产物：

```text
sources/
data/
inbox/
inbox/screenshots/
briefs/
drafts/
factchecks/
reviews/
templates/
automations/
automations/scripts/
.agents/
.agents/skills/
.agents/skills/xhs-ai-operator/
.agents/skills/xhs-ai-operator/references/
.agents/skills/xhs-ai-operator/scripts/
```

  - 验收：

```bash
test -d sources
test -d data
test -d inbox/screenshots
test -d briefs
test -d drafts
test -d factchecks
test -d reviews
test -d templates
test -d automations/scripts
test -d .agents/skills/xhs-ai-operator/references
```

- [x] 建立空目录保留文件。
  - 产物：需要保留的空目录下放 `.gitkeep`。
  - 验收：`find . -name .gitkeep -print` 能看到空目录占位文件。

- [x] 统一文件命名规则。
  - 日期格式：`YYYY-MM-DD`。
  - 周格式：`YYYY-WW`，例如 `2026-W26`。
  - 每日原始链接：`inbox/raw_links_YYYY-MM-DD.md`。
  - 每日简报：`briefs/daily_brief_YYYY-MM-DD.md`。
  - 周简报：`briefs/weekly_brief_YYYY-WW.md`。
  - 小红书草稿：`drafts/xhs_YYYY-MM-DD_topic-slug.md`。
  - 事实核验：`factchecks/factcheck_YYYY-MM-DD_topic-slug.md`。
  - 周复盘：`reviews/weekly_review_YYYY-WW.md`。
  - 月复盘：`reviews/monthly_review_YYYY-MM.md`。
  - 系统建设复盘：`reviews/system_build_review.md`。
  - 验收：`templates/file_naming_rules.md` 写明上述规则。

## 2. 项目级 AGENTS.md

- [x] 创建根目录 `AGENTS.md`。
  - 产物：`AGENTS.md`。
  - 必须包含：
    - 账号定位。
    - 内容主线。
    - 输出语气。
    - 事实核验规则。
    - 文件写入规则。
    - 自动化边界。
    - 禁止事项。
  - 验收：Codex 在本项目启动时能自动读取该文件。

- [x] `AGENTS.md` 写入账号定位。
  - 内容要求：
    - 面向普通职场人、产品/运营/内容创作者、轻技术用户。
    - 做 AI 情报、工具实测、开源项目拆解、Agent 应用观察。
    - 不做泛泛 AI 新闻搬运号。
  - 验收：`rg -n "AI 情报|工具实测|开源项目|Agent|不做泛泛" AGENTS.md` 有结果。

- [x] `AGENTS.md` 写入内容红线。
  - 内容要求：
    - 不使用“炸裂、封神、全网最强”等夸张词。
    - 不编造来源。
    - 不把社区讨论当事实。
    - 不自动发布小红书。
    - 不自动回复私信。
    - 不保存密码、Cookie、Token。
  - 验收：`rg -n "不编造|不自动发布|不自动回复|Cookie|Token|炸裂|封神" AGENTS.md` 有结果。

- [x] `AGENTS.md` 写入固定输出路径。
  - 规则：
    - 候选选题写入 `data/topics.csv`。
    - 已发布数据写入 `data/posts.csv`。
    - 用户需求写入 `data/user_needs.csv`。
    - 每日简报写入 `briefs/`。
    - 草稿写入 `drafts/`。
    - 核验写入 `factchecks/`。
    - 复盘写入 `reviews/`。
  - 验收：`rg -n "data/topics.csv|data/posts.csv|briefs/|drafts/|factchecks/|reviews/" AGENTS.md` 有结果。

## 3. 数据主库

- [x] 创建 `data/topics.csv`。
  - 产物：`data/topics.csv`。
  - 首行表头：

```csv
topic_id,选题标题,原始链接,来源,来源等级,栏目,主线,发布时间,发现日期,AI摘要,用户价值,可靠性评分,传播性评分,实用性评分,事实核验,实测状态,发布状态,草稿路径,复盘结论
```

  - 验收：`head -n 1 data/topics.csv` 与表头一致。

- [x] 创建 `data/posts.csv`。
  - 产物：`data/posts.csv`。
  - 首行表头：

```csv
post_id,topic_id,发布日期,栏目,小红书标题,小红书链接,浏览,点赞,收藏,评论,关注转化,私信需求,D1复盘,D7复盘
```

  - 验收：`head -n 1 data/posts.csv` 与表头一致。

- [x] 创建 `data/user_needs.csv`。
  - 产物：`data/user_needs.csv`。
  - 首行表头：

```csv
need_id,日期,来源,用户原话,需求类型,关联post_id,关联topic_id,可做产品,优先级,处理状态,备注
```

  - 验收：`head -n 1 data/user_needs.csv` 与表头一致。

- [x] 创建数据字典。
  - 产物：`data/README.md`。
  - 必须说明：
    - 每张 CSV 的用途。
    - ID 命名规则：`TYYYYMMDD-001`、`PYYYYMMDD-001`、`NYYYYMMDD-001`。
    - 状态枚举：候选/写作中/待发布/已发布/放弃，待核验/已核验/证据不足，不需要/待实测/已实测/失败。
  - 验收：`rg -n "TYYYYMMDD|候选|写作中|待核验|已实测" data/README.md` 有结果。

## 4. 信源库

- [x] 创建 `sources/rss_sources.md`。
  - 产物：固定信源清单。
  - 至少分组：
    - 官方博客。
    - 论文与开源。
    - AI 产品与模型平台。
    - 技术社区。
    - 高质量媒体。
  - 验收：每个信源至少包含名称、URL、来源等级、适合栏目。

- [x] 创建 `sources/people_watchlist.md`。
  - 产物：AI 人物观察名单。
  - 字段：姓名、身份、平台链接、关注原因、可信度、适合栏目。
  - 验收：至少有 10 个候选人物或机构账号。

- [x] 创建 `sources/source_rating_rules.md`。
  - 产物：来源分级规则。
  - 必须包含：
    - S 级：官方博客、论文、GitHub、产品文档、Release Notes。
    - A 级：研究者/创始人/核心员工公开发言、会议演讲。
    - B 级：Reuters、FT、TechCrunch、The Verge、MIT Tech Review 等主流媒体。
    - C 级：HN、Reddit、Product Hunt、Discord 社区。
    - D 级：二手中文搬运、短视频爆料、未标来源截图。
  - 验收：`rg -n "S 级|A 级|B 级|C 级|D 级" sources/source_rating_rules.md` 有结果。

- [x] 明确网络允许域名。
  - 产物：`sources/network_allowlist.md`。
  - 初始允许域名：

```text
arxiv.org
export.arxiv.org
api.github.com
github.com
huggingface.co
hn.algolia.com
news.ycombinator.com
openai.com
anthropic.com
deepmind.google
ai.meta.com
microsoft.com
techcrunch.com
theverge.com
technologyreview.com
```

  - 验收：脚本和 AGENTS 均引用该文件。

## 5. Prompt 模板

- [x] 创建 `templates/prompts.md`。
  - 必须包含以下 Prompt：
    - 今日链接收集。
    - 每日 AI 简报。
    - 事实核验。
    - 小红书 7 页图文草稿。
    - 实测后修稿。
    - 评论区回复建议。
    - 周复盘。
    - 月度资产盘点。
  - 验收：`rg -n "今日链接收集|事实核验|7 页|周复盘|月度资产" templates/prompts.md` 有结果。

- [x] 创建 `templates/xhs_card_template.md`。
  - 必须包含：
    - 封面页。
    - 问题/结论页。
    - 背景页。
    - 关键事实页。
    - 实测/案例页。
    - 适合谁/不适合谁。
    - 总结和评论引导。
  - 验收：模板能直接用于 7 页图文草稿。

- [x] 创建 `templates/factcheck_template.md`。
  - 必须包含：
    - 原始链接。
    - 可验证事实列表。
    - 来源等级。
    - 事实/观点/推测/用户评论分类。
    - 发布风险。
    - 不确定内容。
  - 验收：`rg -n "事实|观点|推测|用户评论|发布风险" templates/factcheck_template.md` 有结果。

- [x] 创建 `templates/review_template.md`。
  - 必须包含：
    - 本周发布。
    - 数据表现。
    - 收藏率/评论率/转粉判断。
    - 高频需求。
    - 下周选题。
    - 可资产化内容。
  - 验收：模板可直接生成 `reviews/weekly_review_YYYY-WW.md`。

## 6. Repo Skill：xhs-ai-operator

- [x] 创建 `.agents/skills/xhs-ai-operator/SKILL.md`。
  - 必须包含 YAML frontmatter：

```yaml
---
name: xhs-ai-operator
description: 用于小红书 AI 题材账号的单人运营工作流，包括每日链接收集、选题简报、事实核验、图文草稿、发布后数据复盘和内容资产化。适用于用户提到小红书、AI 账号、选题、简报、事实核验、草稿、复盘、资料包时。
---
```

  - 必须包含工作流：
    - 每日链接收集。
    - 选题评分。
    - 事实核验。
    - 图文草稿。
    - 发布后记录。
    - 周复盘。
  - 验收：新开 Codex 会话时，任务匹配描述后应能选择该 skill。

- [x] 创建 skill references。
  - 产物：
    - `.agents/skills/xhs-ai-operator/references/source_rating_rules.md`
    - `.agents/skills/xhs-ai-operator/references/xhs_style_guide.md`
    - `.agents/skills/xhs-ai-operator/references/factcheck_checklist.md`
    - `.agents/skills/xhs-ai-operator/references/content_columns.md`
  - 验收：`SKILL.md` 明确要求在相关任务中读取这些 reference。

- [x] 创建 skill 脚本说明。
  - 产物：`.agents/skills/xhs-ai-operator/scripts/README.md`。
  - 内容：说明 skill 优先调用 `automations/scripts/` 下的实际脚本，避免维护两套重复脚本。
  - 验收：`rg -n "automations/scripts" .agents/skills/xhs-ai-operator/scripts/README.md` 有结果。

- [x] 测试 skill 触发。
  - 测试 Prompt：

```text
请使用 xhs-ai-operator，读取今天的 raw links，生成小红书 AI 账号每日简报。
```

  - 验收：Codex 会先读取 `.agents/skills/xhs-ai-operator/SKILL.md`，再按 workflow 执行。

## 7. 自动化脚本

- [x] 创建脚本运行说明。
  - 产物：`automations/README.md`。
  - 必须说明：
    - Node.js 版本要求。
    - 如何运行每日链接收集。
    - 如何运行数据校验。
    - 网络权限边界。
    - 失败时如何降级为手动输入。

- [x] 创建 `package.json`。
  - 产物：`package.json`。
  - 初始脚本建议：

```json
{
  "scripts": {
    "fetch:today": "node automations/scripts/fetch_sources.mjs",
    "validate:data": "node automations/scripts/validate_data.mjs",
    "review:weekly": "node automations/scripts/weekly_review_stub.mjs"
  }
}
```

  - 验收：`node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('ok')"` 输出 `ok`。

- [x] 创建 `automations/scripts/fetch_sources.mjs`。
  - 目标：
    - 调用各来源抓取模块。
    - 合并结果。
    - 去重。
    - 输出 `inbox/raw_links_YYYY-MM-DD.md`。
    - 追加 `data/topics.csv`。
  - 验收：

```bash
node automations/scripts/fetch_sources.mjs --dry-run
```

  - 通过标准：dry-run 不写文件，但能打印计划访问的来源和输出路径。

- [x] 创建 `automations/scripts/fetch_arxiv.mjs`。
  - 数据源：arXiv API。
  - 范围：`cs.CL`、`cs.AI`、`cs.LG`，最近 24-48 小时。
  - 验收：dry-run 返回标准 JSON 数组，字段包含 `title,url,source,publishedAt,summary`。

- [x] 创建 `automations/scripts/fetch_github_ai.mjs`。
  - 数据源：GitHub Search API 或公开页面。
  - 范围：最近一周 AI/LLM/agent 相关高星项目。
  - 验收：请求失败时给出清晰错误，不保存 token。

- [x] 创建 `automations/scripts/fetch_hf_daily.mjs`。
  - 数据源：Hugging Face Daily Papers、Models 或公开页面。
  - 验收：输出标准 JSON 数组。

- [x] 创建 `automations/scripts/fetch_hn_ai.mjs`。
  - 数据源：HN Algolia API。
  - 关键词：`AI`、`LLM`、`agent`、`OpenAI`、`Claude`、`Gemini`。
  - 验收：输出标准 JSON 数组。

- [x] 创建 `automations/scripts/fetch_rss.mjs`。
  - 输入：`sources/rss_sources.md` 或单独的 RSS 配置。
  - 输出：标准 JSON 数组。
  - 验收：不能解析的 RSS 不阻断整体流程，只记录 warning。

- [x] 创建 `automations/scripts/merge_sources.mjs`。
  - 目标：按 URL 和标题相似度去重。
  - 验收：重复链接不会重复写入 `raw_links` 和 `topics.csv`。

- [x] 创建 `automations/scripts/score_topics.mjs`。
  - 评分维度：
    - 新鲜度。
    - 可靠性。
    - 实用性。
    - 传播性。
    - 账号匹配度。
  - 验收：每条候选输出 1-5 分，并给出一句评分理由。

- [x] 创建 `automations/scripts/append_topics.mjs`。
  - 目标：安全追加 `data/topics.csv`。
  - 要求：
    - 自动生成 `topic_id`。
    - 不重复追加同 URL。
    - 保留原 CSV 表头。
  - 验收：重复运行同一输入不会重复写入。

- [x] 创建 `automations/scripts/validate_data.mjs`。
  - 校验：
    - CSV 表头正确。
    - 必填字段非空。
    - URL 格式基本有效。
    - ID 不重复。
    - 草稿路径存在。
  - 验收：`npm run validate:data` 能输出通过/失败原因。

- [x] 创建脚本测试样例。
  - 产物：
    - `automations/fixtures/sample_raw_items.json`
    - `automations/fixtures/sample_topics.csv`
  - 验收：脚本可用 fixture 在无网络环境下跑通核心逻辑。

## 8. 每日运营能力

- [x] 交付“今日链接收集”能力。
  - 输入：你打开 VPN 后发起任务。
  - 输出：
    - `inbox/raw_links_YYYY-MM-DD.md`
    - `briefs/daily_brief_YYYY-MM-DD.md`
    - `data/topics.csv`
  - 验收：
    - 原始候选 10-20 条。
    - Top 10 选题有推荐理由。
    - 每条都有来源链接和风险提示。

- [x] 交付“事实核验”能力。
  - 输入：选中的 `topic_id`。
  - 输出：`factchecks/factcheck_YYYY-MM-DD_topic-slug.md`。
  - 验收：
    - 至少列出 5 条可验证事实或明确说明事实不足。
    - 每条事实都有来源链接或标注“待确认”。
    - 明确发布风险：低/中/高。

- [x] 交付“小红书图文草稿”能力。
  - 输入：每日简报 + 事实核验。
  - 输出：`drafts/xhs_YYYY-MM-DD_topic-slug.md`。
  - 验收：
    - 7 页卡片文案。
    - 正文。
    - 5 个标题。
    - 3 个封面文案。
    - 需要人工补截图/实测的位置。
    - 适合谁/不适合谁。

- [x] 交付“发布后记录”能力。
  - 输入：小红书链接和初始数据。
  - 输出：更新 `data/posts.csv` 和 `data/topics.csv`。
  - 验收：`post_id` 与 `topic_id` 能关联。

## 9. 周/月复盘能力

- [x] 交付周复盘能力。
  - 输入：
    - `data/posts.csv`
    - `data/topics.csv`
    - `data/user_needs.csv`
  - 输出：`reviews/weekly_review_YYYY-WW.md`。
  - 验收：
    - 本周表现 Top 3。
    - 收藏率最高内容规律。
    - 评论/私信高频需求。
    - 下周 10 个选题。
    - 可沉淀资料包/模板/咨询方向。

- [x] 交付月度资产盘点能力。
  - 输入：当月 `drafts/`、`briefs/`、`reviews/`、`data/`。
  - 输出：`reviews/monthly_review_YYYY-MM.md`。
  - 验收：
    - 内容资产清单。
    - 免费资料包主题。
    - 低价产品主题。
    - B 端服务主题。
    - 下月 4 周内容日历。

## 10. Codex CLI 工作流

- [x] 写入 Codex CLI 使用说明。
  - 产物：`README.md` 或 `docs/codex_cli_workflow.md`。
  - 必须包含：
    - 从项目根目录启动 Codex。
    - 优先使用 `AGENTS.md` 和 repo skill。
    - 使用 `codex exec --sandbox workspace-write` 做脚本化任务。
    - 若尚未 git init，说明 `--skip-git-repo-check` 是临时选项。
    - 每次自动化后查看 diff。
  - 验收：`rg -n "codex exec|workspace-write|AGENTS.md|xhs-ai-operator|git" README.md docs/codex_cli_workflow.md` 有结果。

- [x] 创建常用 Codex 任务 Prompt。
  - 产物：`templates/codex_tasks.md`。
  - 至少包含：
    - 初始化工作区。
    - 今日链接收集。
    - 生成每日简报。
    - 对指定 topic 做事实核验。
    - 生成小红书草稿。
    - 更新发布数据。
    - 周复盘。
    - 审核脚本输出。
  - 验收：后续可以直接复制其中任意 Prompt 给 Codex。

## 11. 结果审核

- [x] 创建系统验收清单。
  - 产物：`reviews/system_acceptance.md`。
  - 必须覆盖：
    - 目录是否完整。
    - 关键文件是否存在。
    - CSV 表头是否正确。
    - AGENTS 是否可读。
    - Skill 是否有 frontmatter。
    - 脚本是否 dry-run 通过。
    - Prompt 是否覆盖日/周/月流程。
    - 是否没有秘密信息。
  - 验收：每项都有通过/失败状态。

- [x] 创建一键审计脚本。
  - 产物：`automations/scripts/audit_workspace.mjs`。
  - 检查：
    - 必需目录。
    - 必需文件。
    - CSV 表头。
    - Skill frontmatter。
    - 是否包含明显 secret 字段。
  - 验收：

```bash
node automations/scripts/audit_workspace.mjs
```

  - 通过标准：输出 `PASS` 或列出明确失败项。

- [x] 创建人工审核规则。
  - 产物：`templates/human_review_checklist.md`。
  - 必须包含：
    - 发布前是否有一手来源。
    - 是否标注不确定内容。
    - 是否有夸张词。
    - 是否有未实测却写成已实测。
    - 是否可能违规引流。
    - 是否泄露隐私或账号信息。

## 12. 安全与合规

- [x] 写入网络访问边界。
  - 产物：`sources/network_allowlist.md` 和 `AGENTS.md`。
  - 规则：
    - 优先公开 RSS/API。
    - 只读请求优先。
    - 不登录 X/Twitter、小红书、Reddit 账号态页面。
    - 不下载受版权保护全文。
  - 验收：`rg -n "只读|GET|不登录|版权|Cookie|Token" AGENTS.md sources/network_allowlist.md` 有结果。

- [x] 写入发布边界。
  - 规则：
    - Codex 不自动发布小红书。
    - Codex 不自动回复私信。
    - Codex 只生成草稿、回复建议和复盘。
  - 验收：`rg -n "不自动发布|不自动回复|回复建议" AGENTS.md` 有结果。

- [x] 写入事实边界。
  - 规则：
    - 不确定写“不确定”。
    - 社区讨论只能做线索。
    - 工具实测必须区分“官网信息”和“实际测试”。
  - 验收：`rg -n "不确定|社区讨论|官网信息|实际测试" AGENTS.md templates/factcheck_template.md` 有结果。

## 13. MVP 交付定义

当以下任务全部完成，视为交付第一版“小红书 AI 账号 Agent 运营能力”：

- [x] 目录结构完整。
- [x] `AGENTS.md` 完成。
- [x] `.agents/skills/xhs-ai-operator/SKILL.md` 完成。
- [x] `data/topics.csv`、`data/posts.csv`、`data/user_needs.csv` 完成。
- [x] `sources/` 下至少有信源、人物、来源分级、网络白名单。
- [x] `templates/` 下至少有日常 Prompt、图文模板、事实核验模板、复盘模板。
- [x] `automations/scripts/fetch_sources.mjs --dry-run` 可执行。
- [x] `automations/scripts/validate_data.mjs` 可执行。
- [x] 能生成一份 `briefs/daily_brief_YYYY-MM-DD.md`。
- [x] 能生成一份 `factchecks/factcheck_YYYY-MM-DD_topic-slug.md`。
- [x] 能生成一份 `drafts/xhs_YYYY-MM-DD_topic-slug.md`。
- [x] 能生成一份 `reviews/weekly_review_YYYY-WW.md`。
- [x] `reviews/system_acceptance.md` 显示所有关键项通过。

## 14. 后续增强，不进入第一版

- [ ] 接入 Notion 或飞书。
- [ ] 自动发布小红书。
- [ ] 自动回复私信。
- [ ] 抓取需要登录态的网站。
- [ ] 复杂 dashboard。
- [ ] 多人协作权限系统。
- [ ] 品牌合作 CRM。

这些能力只有在账号连续运营 30 天、有稳定数据和明确协作需求后再评估。

