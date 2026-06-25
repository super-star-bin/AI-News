import { isCli, normalizeUrl, standardItem, outputJson } from "./common.mjs";

export function mergeSources(sourceGroups) {
  const seen = new Set();
  const merged = [];
  for (const group of sourceGroups) {
    for (const raw of group || []) {
      const item = standardItem(raw);
      const key = normalizeUrl(item.url) || item.title.toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

if (isCli(import.meta.url)) {
  outputJson(mergeSources([]));
}
