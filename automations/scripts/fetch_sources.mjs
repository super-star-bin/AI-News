import { appendTopics } from "./append_topics.mjs";
import { fetchArxiv } from "./fetch_arxiv.mjs";
import { fetchGithubAi } from "./fetch_github_ai.mjs";
import { fetchHfDaily } from "./fetch_hf_daily.mjs";
import { fetchHnAi } from "./fetch_hn_ai.mjs";
import { fetchRss } from "./fetch_rss.mjs";
import { mergeSources } from "./merge_sources.mjs";
import { scoreTopics } from "./score_topics.mjs";
import { ensureDir, isCli, today, writeText } from "./common.mjs";

function rawLinksMarkdown(items, date) {
  const lines = [
    `# ${date} AI 候选链接`,
    "",
    "| 标题 | 中文说明 | URL | 来源 | 来源等级 | 栏目 | 用户价值 | 风险提示 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |"
  ];
  for (const item of items) {
    lines.push(`| ${item.title} | ${item.chineseExplanation || ""} | ${item.url} | ${item.source} | ${item.sourceLevel} | ${item.column} | ${item.userValue} | ${item.risk} |`);
  }
  return `${lines.join("\n")}\n`;
}

function dailyBriefMarkdown(items, date) {
  const top = items.slice(0, 10);
  const lines = [
    `# ${date} 小红书 AI 选题简报`,
    "",
    "## 今日 Top 10",
    ""
  ];
  top.forEach((item, index) => {
    lines.push(`### ${index + 1}. ${item.title}`);
    if (item.chineseExplanation) lines.push(`- 中文说明：${item.chineseExplanation.replace(/^中文说明：/, "")}`);
    lines.push(`- 链接：${item.url}`);
    lines.push(`- 来源：${item.source}（${item.sourceLevel}）`);
    lines.push(`- 栏目：${item.column}`);
    lines.push(`- 用户价值：${item.userValue}`);
    lines.push(`- 风险提示：${item.risk}`);
    lines.push(`- 评分理由：${item.scoreReason || ""}`);
    lines.push("");
  });
  if (top[0]) {
    lines.push("## 今日最推荐");
    lines.push("");
    lines.push(`优先考虑：${top[0].title}`);
    if (top[0].chineseExplanation) lines.push(`中文说明：${top[0].chineseExplanation.replace(/^中文说明：/, "")}`);
    lines.push(`原因：${top[0].userValue}`);
  }
  return `${lines.join("\n")}\n`;
}

export async function fetchSources(options = {}) {
  const date = options.date || today();
  if (options.dryRun) {
    return {
      dryRun: true,
      plannedSources: [
        "arXiv cs.CL/cs.AI/cs.LG",
        "GitHub AI repositories",
        "Hugging Face Daily Papers",
        "HN Algolia AI discussions",
        "sources/rss_sources.md configured URLs"
      ],
      outputs: [
        `inbox/raw_links_${date}.md`,
        `briefs/daily_brief_${date}.md`,
        "data/topics.csv"
      ]
    };
  }

  const groups = [];
  const errors = [];
  for (const [name, fn] of [
    ["arXiv", fetchArxiv],
    ["GitHub", fetchGithubAi],
    ["Hugging Face", fetchHfDaily],
    ["Hacker News", fetchHnAi],
    ["Configured RSS/Web", fetchRss]
  ]) {
    try {
      groups.push(await fn({ dryRun: false }));
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
    }
  }

  const merged = mergeSources(groups).filter((item) => item.sourceLevel !== "D" && !item.title.startsWith("Failed source:"));
  const scored = scoreTopics(merged).slice(0, 20);
  if (scored.length === 0) {
    return {
      date,
      collected: 0,
      appended: 0,
      errors: errors.length ? errors : ["No valid candidates collected. Check network access or add manual links."]
    };
  }
  ensureDir("inbox");
  ensureDir("briefs");
  writeText(`inbox/raw_links_${date}.md`, rawLinksMarkdown(scored, date));
  writeText(`briefs/daily_brief_${date}.md`, dailyBriefMarkdown(scored, date));
  const appendResult = appendTopics(scored, { date });
  return { date, collected: scored.length, appended: appendResult.appended, errors };
}

if (isCli(import.meta.url)) {
  fetchSources({ dryRun: process.argv.includes("--dry-run") }).then((result) => {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
