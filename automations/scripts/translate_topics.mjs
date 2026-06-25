import { TOPICS_HEADER, buildChineseSummaryTranslation, buildChineseTitleTranslation, csvLine, hasEnglish, isCli, readCsv, writeText } from "./common.mjs";

const titleTranslations = {
  "T20260625-001": "跨形态机器人操作的动作先验学习",
  "T20260625-002": "RevengeBench：从行为实验中逆向工程代码空间策略",
  "T20260625-003": "使用采样示范的在线自蒸馏会降低输出多样性",
  "T20260625-004": "实时语音 AI 听见了，但没有真正倾听",
  "T20260625-005": "后训练中被忽视的免费收益：LLM Agent 的进展优势",
  "T20260625-006": "相同证据，不同答案：审计多模态大模型的顺序敏感性",
  "T20260625-007": "基于无监督领域自适应的激光和 TIG 焊接跨工艺熔深状态预测算法",
  "T20260625-008": "模型取证：调查令人担忧的行为是否反映模型失准",
  "T20260625-009": "当确定性只是测量假象：关键词词典盲区与修辞立场误测",
  "T20260625-010": "基于物理信息神经网络自监督学习的激光焊接熔深预测模型",
  "T20260625-011": "benchflow-ai/awesome-evals：AI Agent 评测资源合集",
  "T20260625-012": "Hugging Face 论文趋势页",
  "T20260625-013": "Hugging Face 2026-06-24 每日论文列表",
  "T20260625-014": "Hugging Face 论文 2606.24775",
  "T20260625-015": "Hugging Face 论文 2606.26058",
  "T20260625-016": "Anthropic 新闻中心",
  "T20260625-017": "Google DeepMind 新闻与博客",
  "T20260625-018": "Meta AI 博客",
  "T20260625-019": "Microsoft AI 资讯源",
  "T20260625-020": "arXiv cs.CL 更新",
  "T20260625-021": "arXiv cs.AI 更新"
};

const summaryTranslations = {
  "T20260625-001": "多数视觉-语言-动作模型会在视觉语言模型上添加动作模块并联合训练，但动作模块缺少明确的运动先验。该论文提出先用跨形态动作轨迹预训练动作模块，再进行视觉语言动作对齐，从而提升收敛速度、成功率和数据稀缺任务表现。",
  "T20260625-002": "该论文提出 RevengeBench，用于测试模型能否只根据智能体在游戏中的行为轨迹，反推出其底层决策程序。研究显示，不同前沿 LLM 的策略恢复能力差异明显，这对对手建模、策略解释和从行为推断隐藏机制有参考价值。",
  "T20260625-003": "该论文指出，在线自蒸馏虽然能提升 pass@1 准确率，但可能降低输出多样性，使多次采样带来的收益变小。原因在于示范条件下的教师反馈会放大模型原有偏好，让输出集中到少数模式上。",
  "T20260625-004": "该论文评估多个生产级实时语音 AI 系统，发现它们在一些场景中能识别哭腔、恐惧或讽刺，却在决策时仍主要依赖文字内容。论文把这种感知和行动之间的脱节称为语音 AI 的情绪智能缺口。",
  "T20260625-005": "该论文认为，LLM Agent 的强化学习后训练过程本身可以提供步骤级评分信号，不一定需要额外训练过程奖励模型。作者提出 progress advantage，用于测试时扩展、不确定性估计和失败归因等任务。",
  "T20260625-006": "该论文审计 18 个前沿和开源多模态大模型，发现即使证据相同，只要选项、证据片段、文档排序或图像顺序变化，模型答案也可能发生明显翻转。论文建议把跨顺序翻转率作为多模态模型可靠性的报告指标。",
  "T20260625-007": "该论文研究焊接场景中的跨工艺熔深状态预测，提出结合无监督领域自适应和渐进源域扩展的方法，用于降低不同焊接工艺之间的数据分布差异，提高跨工艺迁移效果。",
  "T20260625-008": "该论文讨论模型取证：当模型出现令人担忧的行为时，不能只看行为本身，还要调查其是否源于失准意图、混淆或其他原因。作者提出读取思维链并通过反事实环境修改来验证假设的基线流程。",
  "T20260625-009": "该论文指出，在计算社会科学中，关键词词典可能把负面表达和强调词的共现误当成确定性立场。用 LLM 做语义分类后，原有相关性大幅下降，说明一些看似显著的结论可能来自测量工具偏差。",
  "T20260625-010": "该论文提出 SimPhysNet，用物理信息神经网络和自监督学习来预测激光焊接熔深状态。方法在少量标注数据下达到较高分类准确率，适合解释为工业 AI 中小样本和物理先验结合的案例。",
  "T20260625-011": "这是一个 AI Agent 评测资源合集，收集构建和评估 AI Agent 所需的论文、博客、演讲、工具和基准。适合做开源项目拆解或 AI Agent 评测资料清单。",
  "T20260625-012": "这是 Hugging Face 的论文趋势入口，用于发现近期社区关注度较高的论文。需要进一步打开具体论文页面，确认题目、摘要、代码和可应用场景。",
  "T20260625-013": "这是 Hugging Face 某日的每日论文列表入口，用于按日期发现新论文。需要进一步筛选具体论文，不能直接作为发布事实。",
  "T20260625-014": "这是 Hugging Face 上的具体论文线索，需要打开页面确认论文题目、摘要、作者和原始 arXiv 链接后，再判断是否适合做论文变应用。",
  "T20260625-015": "这是 Hugging Face 上的具体论文线索，需要打开页面确认论文题目、摘要、作者和原始 arXiv 链接后，再判断是否适合做论文变应用。",
  "T20260625-016": "这是 Anthropic 官方新闻中心入口，用于发现 Claude、模型安全、产品功能和公司动态。需要打开具体新闻条目确认发布时间和细节。",
  "T20260625-017": "这是 Google DeepMind 官方新闻与博客入口，用于发现 Gemini、DeepMind 研究和产品进展。需要打开具体文章确认内容。",
  "T20260625-018": "这是 Meta AI 官方博客入口，用于发现 Llama、开源模型、研究和产品动态。需要打开具体文章确认内容。",
  "T20260625-019": "这是 Microsoft AI 资讯入口，用于发现 Copilot、企业 AI 和 Microsoft AI 产品动态。需要打开具体文章确认内容。",
  "T20260625-020": "这是 arXiv 计算语言学分类的更新入口，用于发现 NLP、LLM 和语言技术相关论文。需要筛选具体论文后再发布。",
  "T20260625-021": "这是 arXiv 人工智能分类的更新入口，用于发现 AI 总类相关论文。需要筛选具体论文后再发布。"
};

function normalizeOldRow(row) {
  if (row.length >= 21 && row[2] !== undefined && row[3] !== undefined) return row;
  return [
    row[0] || "",
    row[1] || "",
    "",
    row[2] || "",
    row[3] || "",
    row[4] || "",
    row[5] || "",
    row[6] || "",
    row[7] || "",
    row[8] || "",
    row[9] || "",
    "",
    row[10] || "",
    row[11] || "",
    row[12] || "",
    row[13] || "",
    row[14] || "",
    row[15] || "",
    row[16] || "",
    row[17] || "",
    row[18] || ""
  ];
}

export function translateTopics(filePath = "data/topics.csv") {
  const csv = readCsv(filePath);
  const rows = csv.rows.map((raw) => {
    const row = normalizeOldRow(raw);
    const topicId = row[0];
    const title = row[1];
    const summary = row[10];
    if (hasEnglish(title) && !row[2]) {
      row[2] = titleTranslations[topicId] || buildChineseTitleTranslation(title, { source: row[4], column: row[6] });
    }
    if (hasEnglish(summary) && !row[11]) {
      row[11] = summaryTranslations[topicId] || buildChineseSummaryTranslation(summary, { source: row[4], column: row[6] });
    }
    return row;
  });
  const content = [TOPICS_HEADER, ...rows.map(csvLine)].join("\n") + "\n";
  writeText(filePath, content);
  return { rows: rows.length, filePath };
}

if (isCli(import.meta.url)) {
  console.log(JSON.stringify(translateTopics(), null, 2));
}

