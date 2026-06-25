# AI News Operations

这是一个由 Codex CLI 主控的小红书 AI 题材账号运营工作区。

当前阶段：单人验证，不使用 Notion 和飞书。本地 Markdown、CSV 和脚本是唯一事实源。

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
npm run validate:data
npm run audit
```

联网前请确认 VPN 和网络权限。脚本只应访问 `sources/network_allowlist.md` 中的公开域名。

