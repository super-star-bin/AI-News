import { isCli, standardItem, outputJson } from "./common.mjs";

function scoreFreshness(item) {
  if (!item.publishedAt) return 3;
  const ageMs = Date.now() - new Date(item.publishedAt).getTime();
  if (!Number.isFinite(ageMs)) return 3;
  const ageHours = ageMs / 36e5;
  if (ageHours <= 24) return 5;
  if (ageHours <= 48) return 4;
  if (ageHours <= 168) return 3;
  return 2;
}

function scoreReliability(level) {
  return { S: 5, A: 4, B: 4, C: 3, D: 1 }[level] || 3;
}

export function scoreTopics(items) {
  return (items || []).map((raw) => {
    const item = standardItem(raw);
    const reliability = scoreReliability(item.sourceLevel);
    const freshness = scoreFreshness(item);
    const utility = Number(item.utilityScore || 3);
    const virality = Number(item.viralityScore || 3);
    const fit = item.column === "工具实测" || item.column === "开源项目拆解" ? 4 : 3;
    const total = reliability + freshness + utility + virality + fit;
    return {
      ...item,
      reliabilityScore: reliability,
      freshnessScore: freshness,
      utilityScore: utility,
      viralityScore: virality,
      accountFitScore: fit,
      totalScore: total,
      scoreReason: `可靠性 ${reliability}/5，新鲜度 ${freshness}/5，实用性 ${utility}/5，传播性 ${virality}/5，账号匹配 ${fit}/5`
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

if (isCli(import.meta.url)) {
  outputJson(scoreTopics([]));
}
