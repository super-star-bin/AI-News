import { readCsv, writeText } from "./common.mjs";

function weekId(date = new Date()) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const day = Math.floor((date - start) / 86400000);
  const week = Math.ceil((day + start.getUTCDay() + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

const id = weekId(new Date());
const posts = readCsv("data/posts.csv").rows;
const topics = readCsv("data/topics.csv").rows;
const needs = readCsv("data/user_needs.csv").rows;
const candidateTopics = topics.slice(0, 10).map((row, index) => `${index + 1}. ${row[2] || row[1] || "待补充选题"}`).join("\n");
const content = `# ${id} 小红书 AI 账号周复盘

## 本周发布

- 发布数量：${posts.length}
- 栏目分布：${posts.length ? "见 data/posts.csv" : "暂无发布数据"}
- 主线分布：${posts.length ? "见 data/topics.csv" : "暂无发布数据"}

## 数据表现

${posts.length ? "请基于 data/posts.csv 计算浏览、点赞、收藏、评论和关注转化。" : "暂无发布数据。当前阶段已完成选题抓取、事实核验和草稿样例。"}

## 本周表现 Top 3

${posts.length ? "待 Codex 根据 posts.csv 排序生成。" : "暂无已发布笔记，暂不排名。"}

## 收藏率最高内容规律

${posts.length ? "待 Codex 根据收藏率总结。" : "暂无发布数据。先观察后续发布后的收藏表现。"}

## 评论和私信中的高频需求

${needs.length ? "见 data/user_needs.csv。" : "暂无记录。发布后从评论和私信中补充。"}

## 下周最值得做的 10 个选题

${candidateTopics || "暂无候选选题。"}

## 可沉淀资料包/模板/咨询方向

- 语音 AI 风险检查清单
- AI 论文变应用解读模板
- AI 工具实测表格模板
- 企业 AI 客服选型咨询
`;
writeText(`reviews/weekly_review_${id}.md`, content);
console.log(`Wrote reviews/weekly_review_${id}.md`);
