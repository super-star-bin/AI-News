# 系统建设记录

## 2026-06-25

- 开始按照 `checklist.md` 建设小红书 AI 账号运营系统。
- 创建项目目录、`AGENTS.md`、本地 CSV 主库、信源库、模板、repo skill 和自动化脚本。
- 修复中文路径下 ESM CLI 判断问题，统一使用 `fileURLToPath(import.meta.url)`。
- 修复网络失败项误入库问题：失败来源只记录错误，不进入候选选题。
- 使用提升权限运行 `npm run fetch:today`，成功收集 20 条候选并生成今日简报。
- 生成样例事实核验：`factchecks/factcheck_2026-06-25_realtime-voice-ai.md`。
- 生成样例小红书草稿：`drafts/xhs_2026-06-25_realtime-voice-ai.md`。
- 生成周复盘和月度资产盘点样例。

## 验证结果

- `npm run validate:data`：PASS。
- `npm run audit`：PASS。
- `node automations/scripts/fetch_sources.mjs --dry-run`：PASS。
- `node automations/scripts/record_post.mjs --dry-run`：PASS。

## 2026-06-25 优化记录

- 在 `AGENTS.md` 中补充沙箱拦截处理规则：低风险项目内动作被沙箱拦截时，直接使用提升权限机制重试，不再先单独聊天询问。
- 在 `AGENTS.md`、`templates/prompts.md` 和 `README.md` 中补充英文资讯中文说明要求。
- 在 `automations/scripts/common.mjs` 和 `fetch_sources.mjs` 中为英文标题/摘要候选生成 `中文说明`，并写入 `inbox/raw_links_YYYY-MM-DD.md` 和 `briefs/daily_brief_YYYY-MM-DD.md`。
- 在 `README.md` 中补充当前目录每个文件夹的中文名称和作用。
- 重新运行 `npm run fetch:today`，今日候选和简报已包含中文说明。

## 2026-06-25 优化验证

- `npm run validate:data`：PASS。
- `npm run audit`：PASS。
- `node automations/scripts/fetch_sources.mjs --dry-run`：PASS。
