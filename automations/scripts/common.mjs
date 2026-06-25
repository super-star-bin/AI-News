import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TOPICS_HEADER = "topic_id,选题标题,原始链接,来源,来源等级,栏目,主线,发布时间,发现日期,AI摘要,用户价值,可靠性评分,传播性评分,实用性评分,事实核验,实测状态,发布状态,草稿路径,复盘结论";
export const POSTS_HEADER = "post_id,topic_id,发布日期,栏目,小红书标题,小红书链接,浏览,点赞,收藏,评论,关注转化,私信需求,D1复盘,D7复盘";
export const NEEDS_HEADER = "need_id,日期,来源,用户原话,需求类型,关联post_id,关联topic_id,可做产品,优先级,处理状态,备注";

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath, fallback = "") {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return fallback;
  }
}

export function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function csvLine(values) {
  return values.map(csvEscape).join(",");
}

export function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

export function readCsv(filePath) {
  const text = readText(filePath).trim();
  if (!text) return { header: "", rows: [] };
  const lines = text.split(/\r?\n/);
  return { header: lines[0], rows: lines.slice(1).filter(Boolean).map(parseCsvLine) };
}

export function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return String(url || "").trim();
  }
}

export function slugify(input) {
  return String(input || "topic")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || "topic";
}

export function nextId(prefix, date, existingRows) {
  const compactDate = date.replaceAll("-", "");
  const expected = `${prefix}${compactDate}-`;
  let max = 0;
  for (const row of existingRows) {
    const id = row[0] || "";
    if (id.startsWith(expected)) {
      const n = Number(id.slice(expected.length));
      if (Number.isFinite(n)) max = Math.max(max, n);
    }
  }
  return `${expected}${String(max + 1).padStart(3, "0")}`;
}

export function standardItem(item) {
  return {
    title: item.title || "",
    url: item.url || "",
    source: item.source || "",
    sourceLevel: item.sourceLevel || "C",
    column: item.column || "今日值得看",
    mainline: item.mainline || "热点",
    publishedAt: item.publishedAt || "",
    summary: item.summary || "",
    userValue: item.userValue || "",
    risk: item.risk || "",
    reliabilityScore: item.reliabilityScore || 3,
    viralityScore: item.viralityScore || 3,
    utilityScore: item.utilityScore || 3
  };
}

export function extractUrlsFromMarkdownTable(markdown) {
  const urls = [];
  const regex = /https?:\/\/[^\s|)]+/g;
  for (const match of markdown.matchAll(regex)) {
    urls.push(match[0]);
  }
  return [...new Set(urls)];
}

export function outputJson(data) {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export function isCli(metaUrl) {
  return fileURLToPath(metaUrl) === process.argv[1];
}
