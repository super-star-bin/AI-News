import { isCli, outputJson } from "./common.mjs";

const SAMPLE = [{
  title: "Sample HN AI discussion",
  url: "https://news.ycombinator.com/item?id=0",
  source: "Hacker News",
  sourceLevel: "C",
  column: "今日值得看",
  mainline: "热点",
  publishedAt: new Date().toISOString(),
  summary: "Dry-run sample item for Hacker News AI discussion.",
  userValue: "适合观察开发者关注点和争议。",
  risk: "社区讨论只能作为线索，不能单独当事实。"
}];

export async function fetchHnAi(options = {}) {
  if (options.dryRun) return SAMPLE;
  const tags = encodeURIComponent("(story)");
  const query = encodeURIComponent("AI OR LLM OR agent OR OpenAI OR Claude OR Gemini");
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${query}&tags=${tags}&hitsPerPage=10`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HN Algolia request failed: ${response.status}`);
  const data = await response.json();
  return (data.hits || []).map((hit) => ({
    title: hit.title || hit.story_title || "",
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    source: "Hacker News",
    sourceLevel: "C",
    column: "今日值得看",
    mainline: "热点",
    publishedAt: hit.created_at,
    summary: "HN discussion candidate.",
    userValue: "适合观察技术社区讨论热度和争议点。",
    risk: "社区讨论只能作为线索，需回到一手来源核验。"
  }));
}

if (isCli(import.meta.url)) {
  fetchHnAi({ dryRun: process.argv.includes("--dry-run") }).then(outputJson).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
