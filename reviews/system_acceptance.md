# 系统验收清单

## 当前状态

- 目录是否完整：通过。
- 关键文件是否存在：通过。
- CSV 表头是否正确：通过。
- AGENTS 是否可读：通过。
- Skill 是否有 frontmatter：通过。
- 脚本是否 dry-run 通过：通过。
- Prompt 是否覆盖日/周/月流程：通过。
- 是否没有秘密信息：通过。

## 验收命令

```bash
npm run validate:data
npm run audit
node automations/scripts/fetch_sources.mjs --dry-run
```

## 结论

第一版小红书 AI 账号 Agent 运营能力已达到 MVP 验收标准。

已验证命令：

- `npm run validate:data`：PASS
- `npm run audit`：PASS
- `node automations/scripts/fetch_sources.mjs --dry-run`：PASS
- `npm run fetch:today`：已成功生成 20 条候选链接、每日简报并更新 `data/topics.csv`
- `node automations/scripts/record_post.mjs --dry-run`：PASS
