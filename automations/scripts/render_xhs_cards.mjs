import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { isCli, readText, writeText } from "./common.mjs";

const WIDTH = 1080;
const HEIGHT = 1440;
const SAFE_X = 84;
const FONT_FAMILY = "'PingFang SC','Hiragino Sans GB','STHeiti','Helvetica Neue',Arial,sans-serif";

const palette = {
  paper: "#F6F2E8",
  ink: "#111827",
  muted: "#4B5563",
  line: "#D7D0C2",
  teal: "#009B95",
  red: "#D84A3A",
  yellow: "#F2C94C",
  green: "#163B3A",
  white: "#FFFDF7"
};

const cardNames = [
  "card_01_cover",
  "card_02_conclusion",
  "card_03_context",
  "card_04_key_finding",
  "card_05_why_it_matters",
  "card_06_limits",
  "card_07_summary"
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

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
  ) return 2;
  return 1;
}

function displayWidth(text) {
  return [...String(text || "")].reduce((sum, char) => sum + charWidth(char), 0);
}

function cleanCardText(value) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.replace(/。+$/g, ""))
    .join("\n");
}

function wrapTokens(paragraph) {
  return paragraph.match(/[A-Za-z0-9]+(?:[-/][A-Za-z0-9]+)*|\s+|./gu) || [];
}

function wrapText(text, maxUnits) {
  const paragraphs = cleanCardText(text).split(/\n+/).map((part) => part.trim()).filter(Boolean);
  const lines = [];
  for (const paragraph of paragraphs) {
    let current = "";
    for (const token of wrapTokens(paragraph)) {
      const candidate = `${current}${token}`;
      if (current.trim() && displayWidth(candidate.trimEnd()) > maxUnits) {
        lines.push(current.trim());
        current = token.trimStart();
      } else {
        current = candidate;
      }
    }
    if (current.trim()) lines.push(current.trim());
  }
  return lines;
}

function textBlock({ text, x, y, size, color = palette.ink, weight = 500, maxUnits = 32, lineHeight = 1.32, anchor = "start" }) {
  const lines = wrapText(text, maxUnits);
  return lines.map((line, index) => {
    const dy = index * size * lineHeight;
    return `<text x="${x}" y="${y + dy}" font-family="${FONT_FAMILY}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(line)}</text>`;
  }).join("\n");
}

function centeredTextBaseline({ text, centerY, size, maxUnits, lineHeight = 1.32 }) {
  const lines = wrapText(text, maxUnits);
  const blockHeight = size + Math.max(0, lines.length - 1) * size * lineHeight;
  return centerY - blockHeight / 2 + size * 0.82;
}

function pill(x, y, text, fill = palette.green, color = palette.white, width = null) {
  const pillWidth = width || Math.max(132, displayWidth(text) * 10 + 44);
  return [
    `<rect x="${x}" y="${y}" width="${pillWidth}" height="46" rx="23" fill="${fill}"/>`,
    `<text x="${x + pillWidth / 2}" y="${y + 31}" font-family="${FONT_FAMILY}" font-size="24" font-weight="700" fill="${color}" text-anchor="middle">${esc(text)}</text>`
  ].join("\n");
}

function logoMark(x, y, size, variant = "dark") {
  const bg = variant === "light" ? palette.white : palette.green;
  const fg = variant === "light" ? palette.green : palette.white;
  const accent = variant === "light" ? palette.red : palette.yellow;
  const stroke = variant === "light" ? palette.green : palette.white;
  return `
  <g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="${bg}"/>
    <ellipse cx="${size * 0.5}" cy="${size * 0.5}" rx="${size * 0.34}" ry="${size * 0.18}" fill="none" stroke="${stroke}" stroke-width="${size * 0.045}" transform="rotate(-24 ${size * 0.5} ${size * 0.5})"/>
    <ellipse cx="${size * 0.5}" cy="${size * 0.5}" rx="${size * 0.34}" ry="${size * 0.18}" fill="none" stroke="${stroke}" stroke-width="${size * 0.045}" transform="rotate(24 ${size * 0.5} ${size * 0.5})"/>
    <circle cx="${size * 0.75}" cy="${size * 0.28}" r="${size * 0.075}" fill="${accent}"/>
    <text x="${size * 0.5}" y="${size * 0.62}" font-family="${FONT_FAMILY}" font-size="${size * 0.34}" font-weight="800" fill="${fg}" text-anchor="middle">AI</text>
  </g>`;
}

function logoLockup(x, y, brand = "AI宇宙", brandEn = "AI NEWS") {
  return `
  <g transform="translate(${x} ${y})">
    ${logoMark(0, 0, 64)}
    <text x="78" y="29" font-family="${FONT_FAMILY}" font-size="28" font-weight="800" fill="${palette.ink}">${esc(brand)}</text>
    <text x="79" y="55" font-family="${FONT_FAMILY}" font-size="17" font-weight="700" fill="${palette.teal}" letter-spacing="1.5">${esc(brandEn)}</text>
  </g>`;
}

function svgShell(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.paper}"/>
  ${inner}
</svg>
`;
}

function footer(data, card, index) {
  const page = `${String(index + 1).padStart(2, "0")} / ${String(data.cards.length).padStart(2, "0")}`;
  return `
  <line x1="${SAFE_X}" y1="1324" x2="${WIDTH - SAFE_X}" y2="1324" stroke="${palette.line}" stroke-width="2"/>
  <text x="${SAFE_X}" y="1372" font-family="${FONT_FAMILY}" font-size="25" font-weight="600" fill="${palette.muted}">${esc(cleanCardText(card.footer || data.source))}</text>
  <text x="${WIDTH - SAFE_X}" y="1372" font-family="${FONT_FAMILY}" font-size="25" font-weight="800" fill="${palette.green}" text-anchor="end">${page}</text>`;
}

function header(data, card) {
  return `
  ${logoLockup(SAFE_X, 70, data.brand, data.brandEn)}
  ${pill(760, 84, card.kicker || data.column, palette.white, palette.green, 236)}
  <line x1="${SAFE_X}" y1="166" x2="${WIDTH - SAFE_X}" y2="166" stroke="${palette.line}" stroke-width="2"/>`;
}

function coverSvg(data, card, index) {
  const title = textBlock({ text: card.title, x: SAFE_X, y: 390, size: 86, weight: 900, maxUnits: 26, lineHeight: 1.12 });
  const subtitle = textBlock({ text: card.subtitle, x: SAFE_X, y: 630, size: 40, weight: 700, color: palette.muted, maxUnits: 34, lineHeight: 1.3 });
  const visualTitle = card.visualTitle || "VOICE × DECISION";
  const visualSubtitle = card.visualSubtitle || "听见声音 ≠ 用上语气";
  const inner = `
  ${logoLockup(SAFE_X, 76, data.brand, data.brandEn)}
  ${pill(760, 90, data.column, palette.green, palette.white, 236)}
  <rect x="${SAFE_X}" y="218" width="912" height="6" rx="3" fill="${palette.red}"/>
  ${pill(SAFE_X, 252, card.badge, palette.red, palette.white, 220)}
  ${title}
  ${subtitle}
  <g transform="translate(${SAFE_X} 762)">
    <rect x="0" y="0" width="912" height="318" rx="28" fill="${palette.green}"/>
    <path d="M74 166 C180 52, 312 52, 420 164 S662 276, 838 106" fill="none" stroke="${palette.teal}" stroke-width="14" stroke-linecap="round"/>
    <path d="M74 210 C190 318, 334 300, 450 198 S674 64, 840 242" fill="none" stroke="${palette.yellow}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="180" cy="122" r="18" fill="${palette.yellow}"/>
    <circle cx="708" cy="98" r="16" fill="${palette.red}"/>
    <text x="456" y="184" font-family="${FONT_FAMILY}" font-size="42" font-weight="900" fill="${palette.white}" text-anchor="middle">${esc(visualTitle)}</text>
    <text x="456" y="236" font-family="${FONT_FAMILY}" font-size="28" font-weight="700" fill="#CFF8F4" text-anchor="middle">${esc(visualSubtitle)}</text>
  </g>
  <rect x="${SAFE_X}" y="1136" width="912" height="88" rx="22" fill="${palette.white}" stroke="${palette.line}" stroke-width="2"/>
  ${textBlock({ text: card.footer, x: SAFE_X + 36, y: 1192, size: 28, weight: 700, color: palette.ink, maxUnits: 58 })}
  ${footer(data, card, index)}`;
  return svgShell(inner);
}

function textCardSvg(data, card, index) {
  const inner = `
  ${header(data, card)}
  <rect x="${SAFE_X}" y="228" width="912" height="8" rx="4" fill="${palette.teal}"/>
  ${textBlock({ text: card.title, x: SAFE_X, y: 322, size: 58, weight: 900, maxUnits: 34, lineHeight: 1.14 })}
  ${textBlock({ text: card.body, x: SAFE_X, y: 535, size: 39, weight: 520, color: palette.ink, maxUnits: 39, lineHeight: 1.42 })}
  <rect x="${SAFE_X}" y="972" width="912" height="190" rx="26" fill="${palette.white}" stroke="${palette.line}" stroke-width="2"/>
  <rect x="${SAFE_X}" y="972" width="18" height="190" rx="9" fill="${palette.red}"/>
  ${textBlock({ text: card.callout, x: SAFE_X + 46, y: 1048, size: 36, weight: 850, color: palette.green, maxUnits: 42, lineHeight: 1.34 })}
  ${footer(data, card, index)}`;
  return svgShell(inner);
}

function bulletsCardSvg(data, card, index) {
  const calloutSingleLine = card.calloutLayout === "singleLine";
  const calloutSize = calloutSingleLine ? 30 : 32;
  const calloutY = calloutSingleLine ? 1113 : 1092;
  const calloutMaxUnits = calloutSingleLine ? 80 : 48;
  const bulletItems = (card.bullets || []).map((item, itemIndex) => {
    const y = 542 + itemIndex * 112;
    return `
    <circle cx="${SAFE_X + 21}" cy="${y - 12}" r="13" fill="${itemIndex % 2 === 0 ? palette.teal : palette.yellow}"/>
    ${textBlock({ text: item, x: SAFE_X + 58, y, size: 38, weight: 760, maxUnits: 36, lineHeight: 1.24 })}`;
  }).join("\n");
  const inner = `
  ${header(data, card)}
  ${textBlock({ text: card.title, x: SAFE_X, y: 302, size: 58, weight: 900, maxUnits: 34, lineHeight: 1.14 })}
  <g>${bulletItems}</g>
  <rect x="${SAFE_X}" y="1030" width="912" height="142" rx="24" fill="${palette.green}"/>
  ${textBlock({ text: card.callout, x: SAFE_X + 36, y: calloutY, size: calloutSize, weight: 850, color: palette.white, maxUnits: calloutMaxUnits, lineHeight: 1.32 })}
  ${footer(data, card, index)}`;
  return svgShell(inner);
}

function compareCardSvg(data, card, index) {
  const leftItems = (card.leftItems || []).map((item, itemIndex) =>
    textBlock({ text: `+ ${item}`, x: 140, y: 650 + itemIndex * 72, size: 34, weight: 760, color: palette.green, maxUnits: 20 })
  ).join("\n");
  const rightItems = (card.rightItems || []).map((item, itemIndex) =>
    textBlock({ text: `- ${item}`, x: 594, y: 650 + itemIndex * 72, size: 34, weight: 760, color: palette.red, maxUnits: 20 })
  ).join("\n");
  const inner = `
  ${header(data, card)}
  ${textBlock({ text: card.title, x: SAFE_X, y: 302, size: 58, weight: 900, maxUnits: 34, lineHeight: 1.14 })}
  <rect x="${SAFE_X}" y="510" width="422" height="352" rx="28" fill="${palette.white}" stroke="${palette.teal}" stroke-width="4"/>
  <rect x="538" y="510" width="458" height="352" rx="28" fill="${palette.white}" stroke="${palette.red}" stroke-width="4"/>
  <text x="295" y="594" font-family="${FONT_FAMILY}" font-size="46" font-weight="900" fill="${palette.green}" text-anchor="middle">${esc(card.leftTitle)}</text>
  <text x="767" y="594" font-family="${FONT_FAMILY}" font-size="46" font-weight="900" fill="${palette.red}" text-anchor="middle">${esc(card.rightTitle)}</text>
  ${leftItems}
  ${rightItems}
  <rect x="${SAFE_X}" y="972" width="912" height="166" rx="26" fill="${palette.green}"/>
  ${textBlock({ text: card.callout, x: SAFE_X + 36, y: 1042, size: 34, weight: 850, color: palette.white, maxUnits: 48, lineHeight: 1.32 })}
  ${footer(data, card, index)}`;
  return svgShell(inner);
}

function warningCardSvg(data, card, index) {
  const inner = `
  ${header(data, card)}
  <rect x="${SAFE_X}" y="238" width="132" height="132" rx="66" fill="${palette.red}"/>
  <text x="${SAFE_X + 66}" y="326" font-family="${FONT_FAMILY}" font-size="78" font-weight="900" fill="${palette.white}" text-anchor="middle">!</text>
  ${textBlock({ text: card.title, x: SAFE_X, y: 460, size: 56, weight: 900, maxUnits: 34, lineHeight: 1.14 })}
  ${textBlock({ text: card.body, x: SAFE_X, y: 660, size: 38, weight: 520, color: palette.ink, maxUnits: 40, lineHeight: 1.42 })}
  <rect x="${SAFE_X}" y="1040" width="912" height="132" rx="24" fill="#FFF7D6" stroke="${palette.yellow}" stroke-width="3"/>
  ${textBlock({ text: card.callout, x: SAFE_X + 34, y: 1100, size: 32, weight: 850, color: palette.ink, maxUnits: 48, lineHeight: 1.3 })}
  ${footer(data, card, index)}`;
  return svgShell(inner);
}

function summaryCardSvg(data, card, index) {
  const calloutSize = 34;
  const calloutMaxUnits = 40;
  const calloutLineHeight = 1.32;
  const calloutCenterY = 1065;
  const calloutY = centeredTextBaseline({
    text: card.callout,
    centerY: calloutCenterY,
    size: calloutSize,
    maxUnits: calloutMaxUnits,
    lineHeight: calloutLineHeight
  });
  const bulletItems = (card.bullets || []).map((item, itemIndex) => {
    const y = 494 + itemIndex * 96;
    return `
    <rect x="${SAFE_X}" y="${y - 48}" width="58" height="58" rx="18" fill="${itemIndex === 0 ? palette.red : palette.teal}"/>
    <text x="${SAFE_X + 29}" y="${y - 8}" font-family="${FONT_FAMILY}" font-size="28" font-weight="900" fill="${palette.white}" text-anchor="middle">${itemIndex + 1}</text>
    ${textBlock({ text: item, x: SAFE_X + 82, y, size: 37, weight: 780, maxUnits: 37, lineHeight: 1.24 })}`;
  }).join("\n");
  const inner = `
  ${header(data, card)}
  ${textBlock({ text: card.title, x: SAFE_X, y: 302, size: 58, weight: 900, maxUnits: 34, lineHeight: 1.14 })}
  ${bulletItems}
  <rect x="${SAFE_X}" y="954" width="912" height="222" rx="28" fill="${palette.green}"/>
  <circle cx="${SAFE_X + 72}" cy="${calloutCenterY}" r="35" fill="${palette.yellow}"/>
  <text x="${SAFE_X + 72}" y="1078" font-family="${FONT_FAMILY}" font-size="38" font-weight="900" fill="${palette.green}" text-anchor="middle">收</text>
  ${textBlock({ text: card.callout, x: SAFE_X + 130, y: calloutY, size: calloutSize, weight: 850, color: palette.white, maxUnits: calloutMaxUnits, lineHeight: calloutLineHeight })}
  ${footer(data, card, index)}`;
  return svgShell(inner);
}

function cardSvg(data, card, index) {
  if (card.type === "cover") return coverSvg(data, card, index);
  if (card.type === "bullets") return bulletsCardSvg(data, card, index);
  if (card.type === "compare") return compareCardSvg(data, card, index);
  if (card.type === "warning") return warningCardSvg(data, card, index);
  if (card.type === "summary") return summaryCardSvg(data, card, index);
  return textCardSvg(data, card, index);
}

function avatarSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="228" fill="${palette.green}"/>
  <circle cx="512" cy="512" r="360" fill="none" stroke="${palette.teal}" stroke-width="34"/>
  <ellipse cx="512" cy="512" rx="330" ry="155" fill="none" stroke="${palette.white}" stroke-width="42" transform="rotate(-25 512 512)"/>
  <ellipse cx="512" cy="512" rx="330" ry="155" fill="none" stroke="${palette.white}" stroke-width="42" transform="rotate(25 512 512)"/>
  <circle cx="730" cy="274" r="58" fill="${palette.yellow}"/>
  <circle cx="322" cy="730" r="34" fill="${palette.red}"/>
  <text x="512" y="600" font-family="${FONT_FAMILY}" font-size="280" font-weight="900" fill="${palette.white}" text-anchor="middle">AI</text>
</svg>
`;
}

function lockupSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="300" viewBox="0 0 920 300">
  <rect width="920" height="300" rx="52" fill="${palette.paper}"/>
  ${logoMark(68, 58, 184)}
  <text x="292" y="130" font-family="${FONT_FAMILY}" font-size="72" font-weight="900" fill="${palette.ink}">AI宇宙</text>
  <text x="296" y="194" font-family="${FONT_FAMILY}" font-size="34" font-weight="800" fill="${palette.teal}" letter-spacing="6">AI NEWS</text>
  <text x="296" y="244" font-family="${FONT_FAMILY}" font-size="28" font-weight="600" fill="${palette.muted}">筛掉 AI 噪音，留下可用判断</text>
</svg>
`;
}

function exportPng(svgPath, pngPath, size = `${WIDTH}x${HEIGHT}`) {
  execFileSync("magick", [svgPath, "-resize", size, pngPath], { stdio: "pipe" });
}

export function renderBrandAssets() {
  ensureDir("assets/brand");
  writeText("assets/brand/logo_avatar.svg", avatarSvg());
  writeText("assets/brand/logo_lockup.svg", lockupSvg());
  writeText("assets/brand/logo.svg", lockupSvg());
  exportPng("assets/brand/logo_avatar.svg", "assets/brand/logo_avatar.png", "1024x1024");
  exportPng("assets/brand/logo_lockup.svg", "assets/brand/logo_lockup.png", "1840x600");
  return {
    avatar: "assets/brand/logo_avatar.png",
    lockup: "assets/brand/logo_lockup.png"
  };
}

export function renderCards(sourcePath) {
  const source = JSON.parse(readText(sourcePath));
  const outputDir = path.dirname(sourcePath);
  const cardsDir = path.join(outputDir, "cards");
  ensureDir(cardsDir);
  const rendered = [];
  source.cards.forEach((card, index) => {
    const baseName = cardNames[index] || `card_${String(index + 1).padStart(2, "0")}`;
    const svgPath = path.join(cardsDir, `${baseName}.svg`);
    const pngPath = path.join(cardsDir, `${baseName}.png`);
    writeText(svgPath, cardSvg(source, card, index));
    exportPng(svgPath, pngPath);
    rendered.push(pngPath);
  });
  return rendered;
}

function main() {
  const sourcePath = process.argv[2] || "outputs/xhs/2026-06-25/realtime-voice-ai/source.json";
  const brandAssets = renderBrandAssets();
  const cards = renderCards(sourcePath);
  console.log(JSON.stringify({ brandAssets, cards }, null, 2));
}

if (isCli(import.meta.url)) {
  main();
}
