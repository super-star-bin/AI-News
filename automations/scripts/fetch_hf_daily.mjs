import { isCli, outputJson } from "./common.mjs";

const SAMPLE = [{
  title: "Sample Hugging Face paper",
  url: "https://huggingface.co/papers/0000.00000",
  source: "Hugging Face",
  sourceLevel: "S",
  column: "论文变应用",
  mainline: "热点",
  publishedAt: new Date().toISOString(),
  summary: "Dry-run sample item for Hugging Face Daily Papers.",
  userValue: "适合发现论文、模型和社区关注趋势。",
  risk: "需要回到论文或模型卡确认细节。"
}];

export async function fetchHfDaily(options = {}) {
  if (options.dryRun) return SAMPLE;
  const response = await fetch("https://huggingface.co/papers");
  if (!response.ok) throw new Error(`Hugging Face request failed: ${response.status}`);
  const html = await response.text();
  const matches = [...html.matchAll(/href="(\/papers\/[^"]+)"/g)].slice(0, 10);
  const seen = new Set();
  return matches
    .map((match) => `https://huggingface.co${match[1]}`)
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .map((url) => ({
      title: url.split("/").pop(),
      url,
      source: "Hugging Face",
      sourceLevel: "S",
      column: "论文变应用",
      mainline: "热点",
      publishedAt: new Date().toISOString(),
      summary: "Hugging Face Daily Papers candidate.",
      userValue: "适合发现论文变应用选题。",
      risk: "需要回到论文和模型卡核验。"
    }));
}

if (isCli(import.meta.url)) {
  fetchHfDaily({ dryRun: process.argv.includes("--dry-run") }).then(outputJson).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
