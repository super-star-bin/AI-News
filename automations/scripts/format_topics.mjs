import fs from "node:fs";
import { isCli, readCsv, writeText } from "./common.mjs";

const SOURCE_FILE = "data/topics.csv";
const TARGET_FILE = "data/topics.md";

const columns = [
  { label: "topic_id", value: (row) => row[0], maxWidth: 15 },
  { label: "中文标题", value: (row) => row[2] || row[1], maxWidth: 42 },
  { label: "来源", value: (row) => row[4], maxWidth: 18 },
  { label: "等级", value: (row) => row[5], maxWidth: 4 },
  { label: "栏目", value: (row) => row[6], maxWidth: 12 },
  { label: "状态", value: (row) => row[18], maxWidth: 8 },
  { label: "核验", value: (row) => row[16], maxWidth: 8 },
  { label: "实测", value: (row) => row[17], maxWidth: 8 },
  { label: "分数", value: (row) => [row[13], row[14], row[15]].map((cell) => cell || "-").join("/"), maxWidth: 7 },
  { label: "用户价值", value: (row) => row[12], maxWidth: 36 },
  { label: "链接", value: (row) => `[原文][${row[0]}]`, maxWidth: 24, noTruncate: true },
  { label: "中文摘要", value: (row) => row[11] || row[10], maxWidth: 64 }
];

function charWidth(char) {
  const codePoint = char.codePointAt(0);
  if (
    (codePoint >= 0x1100 && codePoint <= 0x115f) ||
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
    (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
    (codePoint >= 0xff00 && codePoint <= 0xff60) ||
    (codePoint >= 0xffe0 && codePoint <= 0xffe6)
  ) {
    return 2;
  }
  return 1;
}

function displayWidth(text) {
  return [...String(text || "")].reduce((sum, char) => sum + charWidth(char), 0);
}

function truncateByWidth(value, maxWidth) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (displayWidth(text) <= maxWidth) return text;
  const suffix = "...";
  let output = "";
  let width = 0;
  for (const char of text) {
    const nextWidth = width + charWidth(char);
    if (nextWidth > maxWidth - suffix.length) break;
    output += char;
    width = nextWidth;
  }
  return `${output}${suffix}`;
}

function escapeMarkdownCell(value) {
  return String(value || "").replaceAll("|", "\\|");
}

function padCell(value, width) {
  const text = escapeMarkdownCell(value);
  return `${text}${" ".repeat(Math.max(0, width - displayWidth(text)))}`;
}

function buildTable(rows) {
  const tableRows = rows.map((row) =>
    columns.map((column) => {
      const value = String(column.value(row) || "").replace(/\s+/g, " ").trim();
      return column.noTruncate ? value : truncateByWidth(value, column.maxWidth);
    })
  );
  const widths = columns.map((column, index) => {
    const cellWidths = tableRows.map((row) => displayWidth(escapeMarkdownCell(row[index])));
    return Math.max(displayWidth(column.label), ...cellWidths);
  });

  const header = `| ${columns.map((column, index) => padCell(column.label, widths[index])).join(" | ")} |`;
  const separator = `| ${widths.map((width) => "-".repeat(Math.max(3, width))).join(" | ")} |`;
  const body = tableRows.map((row) => `| ${row.map((cell, index) => padCell(cell, widths[index])).join(" | ")} |`);
  return [header, separator, ...body].join("\n");
}

function buildLinkReferences(rows) {
  return rows
    .filter((row) => row[0] && row[3])
    .map((row) => `[${row[0]}]: ${row[3]}`)
    .join("\n");
}

export function buildTopicsMarkdown(sourceFile = SOURCE_FILE) {
  const csv = readCsv(sourceFile);
  const rows = csv.rows.filter((row) => row.some(Boolean));
  const table = buildTable(rows);
  const links = buildLinkReferences(rows);
  return [
    "# topics.csv 浏览视图",
    "",
    "> 自动生成自 `data/topics.csv`。请不要手改本文件；修改 CSV 后运行 `npm run format:topics` 刷新。",
    "> `data/topics.csv` 仍是机器处理的唯一主库，本文件只用于在 VSCode/GitHub 中快速浏览和审核。",
    "",
    table,
    "",
    "## 原文链接",
    "",
    links,
    ""
  ].join("\n");
}

export function formatTopics({ sourceFile = SOURCE_FILE, targetFile = TARGET_FILE, check = false } = {}) {
  const content = buildTopicsMarkdown(sourceFile);
  if (check) {
    const existing = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, "utf8") : "";
    if (existing !== content) {
      return { ok: false, targetFile, message: `${targetFile} is stale. Run npm run format:topics.` };
    }
    return { ok: true, targetFile, message: `${targetFile} is up to date.` };
  }
  writeText(targetFile, content);
  return { ok: true, targetFile, message: `wrote ${targetFile}` };
}

if (isCli(import.meta.url)) {
  const result = formatTopics({ check: process.argv.includes("--check") });
  if (!result.ok) {
    console.error(result.message);
    process.exitCode = 1;
  } else {
    console.log(result.message);
  }
}
