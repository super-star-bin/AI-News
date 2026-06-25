import fs from "node:fs";
import { POSTS_HEADER, csvLine, isCli, nextId, parseCsvLine, readCsv, today } from "./common.mjs";

function arg(name, fallback = "") {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

function rewriteTopicStatus(topicId, draftPath) {
  const filePath = "data/topics.csv";
  const text = fs.readFileSync(filePath, "utf8").trimEnd();
  const lines = text.split(/\r?\n/);
  const updated = lines.map((line, index) => {
    if (index === 0) return line;
    const cells = parseCsvLine(line);
    if (cells[0] !== topicId) return line;
    cells[16] = "已发布";
    if (draftPath && !cells[17]) cells[17] = draftPath;
    return csvLine(cells);
  });
  fs.writeFileSync(filePath, `${updated.join("\n")}\n`, "utf8");
}

export function recordPost(options = {}) {
  if (options.dryRun) {
    return {
      dryRun: true,
      requiredArgs: ["topic-id", "title", "url"],
      optionalArgs: ["date", "column", "views", "likes", "collects", "comments", "follows", "needs"]
    };
  }

  const topicId = options.topicId || arg("topic-id");
  const title = options.title || arg("title");
  const url = options.url || arg("url");
  if (!topicId || !title || !url) {
    throw new Error("Missing required args: --topic-id, --title, --url");
  }

  const date = options.date || arg("date", today());
  const csv = readCsv("data/posts.csv");
  const postId = nextId("P", date, csv.rows);
  const row = [
    postId,
    topicId,
    date,
    options.column || arg("column", ""),
    title,
    url,
    options.views || arg("views", "0"),
    options.likes || arg("likes", "0"),
    options.collects || arg("collects", "0"),
    options.comments || arg("comments", "0"),
    options.follows || arg("follows", "0"),
    options.needs || arg("needs", ""),
    "",
    ""
  ];

  if (!fs.existsSync("data/posts.csv")) {
    fs.writeFileSync("data/posts.csv", `${POSTS_HEADER}\n`, "utf8");
  }
  fs.appendFileSync("data/posts.csv", `${csvLine(row)}\n`, "utf8");
  rewriteTopicStatus(topicId, options.draftPath || arg("draft-path", ""));
  return { postId, topicId, url };
}

if (isCli(import.meta.url)) {
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify(recordPost({ dryRun: true }), null, 2));
  } else {
    const result = recordPost({});
    console.log(JSON.stringify(result, null, 2));
  }
}
