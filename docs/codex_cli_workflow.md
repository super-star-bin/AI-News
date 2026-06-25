# Codex CLI 工作流

## 启动位置

始终从项目根目录启动 Codex：

```bash
cd /Users/bytedance/Documents/私人资料/AI宇宙
codex
```

Codex 会读取项目级 `AGENTS.md`，并在任务匹配时使用 repo skill：`xhs-ai-operator`。

## 常用命令

```bash
codex exec --sandbox workspace-write "请读取 checklist.md，执行下一个未完成任务。"
codex exec --sandbox workspace-write "请使用 xhs-ai-operator，生成今日 AI 简报。"
codex exec --sandbox workspace-write "请运行 npm run validate:data 和 npm run audit，修复失败项。"
```

## Git 审核

每轮自动化后执行：

```bash
git status --short
git diff
```

确认无异常后再提交。

## 临时非 Git 目录

Codex exec 通常要求在 git 仓库中运行。如果未来在未初始化 git 的临时目录中测试，可以临时使用 `--skip-git-repo-check`，但本项目不建议这样做。

## 安全边界

- 不保存密码、Cookie、Token、API Key。
- 不自动发布小红书。
- 不自动回复私信。
- 不登录 X/Twitter、小红书、Reddit 等账号态页面。
- 联网只访问 `sources/network_allowlist.md` 中的公开信源。

