import { isCli, outputJson } from "./common.mjs";

const SAMPLE = [{
  title: "sample-ai-agent",
  url: "https://github.com/example/sample-ai-agent",
  source: "GitHub",
  sourceLevel: "S",
  column: "开源项目拆解",
  mainline: "开源",
  publishedAt: new Date().toISOString(),
  summary: "Dry-run sample item for GitHub AI repositories.",
  userValue: "适合判断新开源项目是否有上手价值。",
  risk: "需要核验 README、License、活跃度和是否真实可运行。"
}];

export async function fetchGithubAi(options = {}) {
  if (options.dryRun) return SAMPLE;
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const query = encodeURIComponent(`(AI OR LLM OR agent) created:>${since} stars:>100`);
  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`;
  const response = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
  const data = await response.json();
  return (data.items || []).map((repo) => ({
    title: repo.full_name,
    url: repo.html_url,
    source: "GitHub",
    sourceLevel: "S",
    column: "开源项目拆解",
    mainline: "开源",
    publishedAt: repo.created_at || repo.updated_at,
    summary: repo.description || "",
    userValue: "适合拆解项目用途、上手难度和适用人群。",
    risk: "需要核验项目是否可运行、是否活跃、License 是否适合推荐。"
  }));
}

if (isCli(import.meta.url)) {
  fetchGithubAi({ dryRun: process.argv.includes("--dry-run") }).then(outputJson).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
