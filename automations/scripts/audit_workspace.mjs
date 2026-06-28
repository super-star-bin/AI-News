import fs from "node:fs";
import { isCli, NEEDS_HEADER, POSTS_HEADER, TOPICS_HEADER, readText } from "./common.mjs";

const requiredDirs = [
  "sources",
  "data",
  "inbox/screenshots",
  "briefs",
  "drafts",
  "factchecks",
  "reviews",
  "templates",
  "assets/brand",
  "outputs/xhs",
  "automations/scripts",
  ".agents/skills/xhs-ai-operator/references"
];

const requiredFiles = [
  "AGENTS.md",
  "checklist.md",
  "docs/xhs_design_spec.md",
  "assets/brand/logo_avatar.svg",
  "assets/brand/logo_lockup.svg",
  "data/topics.csv",
  "data/posts.csv",
  "data/user_needs.csv",
  "sources/rss_sources.md",
  "sources/people_watchlist.md",
  "sources/source_rating_rules.md",
  "sources/network_allowlist.md",
  "templates/prompts.md",
  "templates/xhs_card_template.md",
  "templates/factcheck_template.md",
  "templates/review_template.md",
  ".agents/skills/xhs-ai-operator/SKILL.md",
  "automations/scripts/fetch_sources.mjs",
  "automations/scripts/format_topics.mjs",
  "automations/scripts/render_xhs_cards.mjs",
  "automations/scripts/validate_data.mjs"
];

function firstLine(filePath) {
  return readText(filePath).split(/\r?\n/)[0];
}

export function auditWorkspace() {
  const errors = [];
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) errors.push(`missing dir: ${dir}`);
  }
  for (const file of requiredFiles) {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`missing file: ${file}`);
  }
  if (fs.existsSync("data/topics.csv") && firstLine("data/topics.csv") !== TOPICS_HEADER) errors.push("topics.csv header mismatch");
  if (fs.existsSync("data/posts.csv") && firstLine("data/posts.csv") !== POSTS_HEADER) errors.push("posts.csv header mismatch");
  if (fs.existsSync("data/user_needs.csv") && firstLine("data/user_needs.csv") !== NEEDS_HEADER) errors.push("user_needs.csv header mismatch");
  const skill = readText(".agents/skills/xhs-ai-operator/SKILL.md");
  if (!skill.startsWith("---") || !skill.includes("name: xhs-ai-operator")) errors.push("skill frontmatter missing");
  const allText = requiredFiles.filter((file) => fs.existsSync(file)).map((file) => readText(file)).join("\n");
  if (/sk-[A-Za-z0-9_-]{20,}|BEGIN (RSA|OPENSSH) PRIVATE KEY|password\s*=|api[_-]?key\s*=/i.test(allText)) {
    errors.push("possible secret detected");
  }
  return errors;
}

if (isCli(import.meta.url)) {
  const errors = auditWorkspace();
  if (errors.length) {
    console.error(`FAIL\n${errors.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log("PASS workspace audit");
  }
}
