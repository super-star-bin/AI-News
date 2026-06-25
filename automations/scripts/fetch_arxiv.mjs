import { isCli, outputJson } from "./common.mjs";

const SAMPLE = [{
  title: "Sample arXiv AI paper",
  url: "https://arxiv.org/abs/0000.00000",
  source: "arXiv",
  sourceLevel: "S",
  column: "论文变应用",
  mainline: "热点",
  publishedAt: new Date().toISOString(),
  summary: "Dry-run sample item for arXiv collection.",
  userValue: "用于判断论文是否能转化为小红书可解释内容。",
  risk: "需要读取论文摘要和实验设置，不能夸大结论。"
}];

function textBetween(text, tag) {
  const match = text.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : "";
}

export async function fetchArxiv(options = {}) {
  if (options.dryRun) return SAMPLE;
  const query = encodeURIComponent("cat:cs.CL OR cat:cs.AI OR cat:cs.LG");
  const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=10`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`arXiv request failed: ${response.status}`);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
  return entries.map((entry) => ({
    title: textBetween(entry, "title").replace(/\s+/g, " "),
    url: textBetween(entry, "id"),
    source: "arXiv",
    sourceLevel: "S",
    column: "论文变应用",
    mainline: "热点",
    publishedAt: textBetween(entry, "published"),
    summary: textBetween(entry, "summary").replace(/\s+/g, " "),
    userValue: "适合拆成论文变应用或技术趋势判断。",
    risk: "需要核验论文贡献、实验范围和是否已有可用实现。"
  }));
}

if (isCli(import.meta.url)) {
  fetchArxiv({ dryRun: process.argv.includes("--dry-run") }).then(outputJson).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
