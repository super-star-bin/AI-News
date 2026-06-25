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
