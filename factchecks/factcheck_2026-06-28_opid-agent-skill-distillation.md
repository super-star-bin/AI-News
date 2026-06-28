# 事实核验：OPID 值得收藏，但不适合普通人直接跑

## 基本信息

- topic_id：`T20260628-003`
- 栏目：开源项目拆解
- 来源：GitHub + arXiv
- GitHub：https://github.com/jinyangwu/OPID
- 论文：https://arxiv.org/abs/2606.26790
- 核验日期：2026-06-28
- 结论：可发布为开源拆解，但未做本地安装实测。

## 已核验事实

1. GitHub 仓库 `jinyangwu/OPID` 公开，README 写明这是 `Official implementation of OPID`。
2. 仓库页面显示 license 为 MIT。
3. README 提供安装说明，涉及 Python 3.12、vLLM、flash-attn、OpenAI-compatible endpoint 等依赖。
4. README 提到支持或涉及 ALFWorld、WebShop、Search-QA 等环境。
5. arXiv 论文标题为 `OPID: On-Policy Skill Distillation for Efficient Long-Horizon LLM Agent Learning`。
6. 论文摘要称 OPID 会把已完成的 on-policy 轨迹转成分层 hindsight skills，并在 ALFWorld、Search-QA、WebShop 上提升性能。

## 未核验 / 未实测

- 未在本地安装依赖。
- 未运行训练或评测脚本。
- 未验证论文结果能否在本地复现。
- 未评估 GPU、API、环境配置成本。

## 不能写成的说法

- 不能写成“普通用户可以直接用 OPID 提升办公 Agent”。
- 不能写成“本账号已复现论文结果”。
- 不能写成“OPID 已经适用于所有长程 Agent”。
- 不能把 benchmark 结果泛化到真实业务流程。

## 发布转译

- 英文标题中文解释：`On-Policy Skill Distillation` 可以理解为“从模型实际执行过的轨迹中提炼技能”。
- 核心判断：它适合收藏和学习 Agent 训练思路，不适合当成开箱即用工具推荐。

## 风险等级

- 来源等级：S
- 事实风险：低
- 上手风险：高
- 处理方式：强调未本地实测和较高技术门槛。
