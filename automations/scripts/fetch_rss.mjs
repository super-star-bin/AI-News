import { extractUrlsFromMarkdownTable, isCli, outputJson, readText } from "./common.mjs";

const SAMPLE = [{
  title: "Sample RSS source item",
  url: "https://openai.com/news/",
  source: "RSS",
  sourceLevel: "S",
  column: "今日值得看",
  mainline: "热点",
  publishedAt: new Date().toISOString(),
  summary: "Dry-run sample item for configured RSS sources.",
  userValue: "适合发现官方产品和研究更新。",
  risk: "需要打开原文核验具体发布内容。"
}];

function extractTitle(xml) {
  const match = xml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : "";
}

export async function fetchRss(options = {}) {
  if (options.dryRun) return SAMPLE;
  const markdown = readText("sources/rss_sources.md");
  const urls = extractUrlsFromMarkdownTable(markdown).slice(0, 12);
  const items = [];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const text = await response.text();
      items.push({
        title: extractTitle(text) || url,
        url,
        source: "Configured RSS/Web",
        sourceLevel: url.includes("reddit.com") || url.includes("producthunt.com") ? "C" : "S",
        column: "今日值得看",
        mainline: "热点",
        publishedAt: new Date().toISOString(),
        summary: "Configured source candidate.",
        userValue: "适合发现官方更新或高质量行业动态。",
        risk: "需要打开原文确认具体信息。"
      });
    } catch {
      // Failed sources are intentionally excluded from candidate output.
      // The caller reports request errors separately; failed fetches should not
      // become D-level topics in the publishing pipeline.
    }
  }
  return items;
}

if (isCli(import.meta.url)) {
  fetchRss({ dryRun: process.argv.includes("--dry-run") }).then(outputJson).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
