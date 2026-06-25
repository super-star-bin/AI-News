import fs from "node:fs";
import { isCli, NEEDS_HEADER, POSTS_HEADER, TOPICS_HEADER, readCsv } from "./common.mjs";

const checks = [
  ["data/topics.csv", TOPICS_HEADER, [0, 1, 3]],
  ["data/posts.csv", POSTS_HEADER, [0, 1]],
  ["data/user_needs.csv", NEEDS_HEADER, [0, 3]]
];

function looksLikeUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateData() {
  const errors = [];
  for (const [filePath, expectedHeader, requiredIndexes] of checks) {
    if (!fs.existsSync(filePath)) {
      errors.push(`${filePath}: missing`);
      continue;
    }
    const csv = readCsv(filePath);
    if (csv.header !== expectedHeader) {
      errors.push(`${filePath}: header mismatch`);
    }
    const ids = new Set();
    csv.rows.forEach((row, index) => {
      for (const requiredIndex of requiredIndexes) {
        if (!row[requiredIndex]) errors.push(`${filePath}: row ${index + 2} missing required field ${requiredIndex}`);
      }
      if (row[0]) {
        if (ids.has(row[0])) errors.push(`${filePath}: duplicate id ${row[0]}`);
        ids.add(row[0]);
      }
      if (filePath.endsWith("topics.csv") && row[3] && !looksLikeUrl(row[3])) {
        errors.push(`${filePath}: row ${index + 2} invalid URL ${row[3]}`);
      }
      if (filePath.endsWith("posts.csv") && row[5] && !looksLikeUrl(row[5])) {
        errors.push(`${filePath}: row ${index + 2} invalid URL ${row[5]}`);
      }
      if (filePath.endsWith("topics.csv") && row[1] && /[A-Za-z]{3,}/.test(row[1]) && !row[2]) {
        errors.push(`${filePath}: row ${index + 2} missing title Chinese translation`);
      }
      if (filePath.endsWith("topics.csv") && row[10] && /[A-Za-z]{3,}/.test(row[10]) && !row[11]) {
        errors.push(`${filePath}: row ${index + 2} missing summary Chinese translation`);
      }
      if (filePath.endsWith("topics.csv") && row[19] && !fs.existsSync(row[19])) {
        errors.push(`${filePath}: row ${index + 2} missing draft path ${row[19]}`);
      }
    });
  }
  return errors;
}

if (isCli(import.meta.url)) {
  const errors = validateData();
  if (errors.length) {
    console.error(`FAIL\n${errors.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log("PASS data validation");
  }
}
