# 事实核验：操作型 Agent，别只看会不会点屏幕

## 基本信息

- topic_id：`T20260628-006`
- 栏目：AI Agent 应用观察
- 来源：arXiv
- 论文：`GUI vs. CLI: Execution Bottlenecks in Screen-Only and Skill-Mediated Computer-Use Agents`
- 链接：https://arxiv.org/abs/2606.24551
- 核验日期：2026-06-28
- 结论：可发布为 Agent 应用观察，需保留预印本和未本地复现边界。

## 已核验事实

1. 论文比较 `screen-only GUI agents` 和 `skill-mediated CLI agents`。前者可解释为只看屏幕并点击/输入的图形界面 Agent；后者可解释为通过命令行或预定义技能执行任务的 Agent。
2. 论文构建 matched execution-layer evaluation，即匹配执行层评估，让两类 Agent 接收相同目标、状态、最终状态验证器，并使用各自原生动作空间。
3. 论文摘要称评测覆盖 440 个桌面任务、18 个应用和 12 类工作流。
4. 论文摘要称最强 GUI Agent full-pass rate 为 59.1%，原始技能 CLI 为 48.2%，加入 verifier-guided skill augmentation 后 CLI 为 69.3%。
5. 论文结论指向两类瓶颈：GUI 侧更像可靠交互瓶颈，CLI/技能侧更像技能覆盖和可扩展瓶颈。

## 未核验 / 未实测

- 未本地复现 benchmark。
- 未验证具体 GUI Agent 或 CLI Agent 在真实办公软件中的表现。
- 未测试中文系统、国内软件或企业内网应用。

## 不能写成的说法

- 不能写成“GUI Agent 一定更差”。
- 不能写成“CLI Agent 一定更好”。
- 不能把 benchmark 数字泛化到所有桌面任务。
- 不能写成普通用户已可直接部署论文系统。

## 发布转译

- 核心判断：操作型 Agent 不要只看“能不能像人一样点屏幕”，还要看任务是否能被抽象成稳定技能和可验证步骤。
- 用户建议：临时、视觉依赖强的任务可先看 GUI；高频、标准化、可验收的流程优先沉淀接口、脚本和技能。

## 风险等级

- 来源等级：S
- 事实风险：低
- 解读风险：中
- 处理方式：强调不同路线各有瓶颈，不做单边结论。
