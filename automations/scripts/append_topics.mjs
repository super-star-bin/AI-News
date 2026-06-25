import fs from "node:fs";
import { TOPICS_HEADER, csvLine, isCli, normalizeUrl, nextId, readCsv, standardItem, today } from "./common.mjs";

export function appendTopics(items, options = {}) {
  const filePath = options.filePath || "data/topics.csv";
  const date = options.date || today();
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync("data", { recursive: true });
    fs.writeFileSync(filePath, `${TOPICS_HEADER}\n`, "utf8");
  }
  const csv = readCsv(filePath);
  const existingUrls = new Set(csv.rows.map((row) => normalizeUrl(row[3])));
  const rowsToAppend = [];
  let existingRows = [...csv.rows];

  for (const raw of items || []) {
    const item = standardItem(raw);
    const urlKey = normalizeUrl(item.url);
    if (!urlKey || existingUrls.has(urlKey)) continue;
    const topicId = nextId("T", date, existingRows);
    const row = [
      topicId,
      item.title,
      item.titleZh,
      item.url,
      item.source,
      item.sourceLevel,
      item.column,
      item.mainline,
      item.publishedAt,
      date,
      item.summary,
      item.summaryZh,
      item.userValue,
      item.reliabilityScore,
      item.viralityScore,
      item.utilityScore,
      "待核验",
      item.column === "工具实测" ? "待实测" : "不需要",
      "候选",
      "",
      ""
    ];
    rowsToAppend.push(csvLine(row));
    existingRows.push(row);
    existingUrls.add(urlKey);
  }

  if (rowsToAppend.length > 0 && !options.dryRun) {
    fs.appendFileSync(filePath, `${rowsToAppend.join("\n")}\n`, "utf8");
  }

  return { appended: rowsToAppend.length, dryRun: Boolean(options.dryRun) };
}

if (isCli(import.meta.url)) {
  const result = appendTopics([], { dryRun: process.argv.includes("--dry-run") });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
