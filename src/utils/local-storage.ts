import { RecentLanguage } from "@/types/recent-languages";

// add expiration prop to reset recent languages
export function storeRecentLanguages(recentLanguages: RecentLanguage) {
  localStorage.setItem(
    "supa-translate:recent-languages",
    JSON.stringify(recentLanguages)
  );
}

export function getRecentLanguages() {
  const recentLangs = JSON.parse(
    window.localStorage.getItem("supa-translate:recent-languages") || "{}"
  ) as RecentLanguage;

  return {
    from: recentLangs?.from,
    to: recentLangs?.to,
  };
}
