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
    // actually, from must be en (or detect language), and to must be pt

    from: !!recentLangs?.from.length ? recentLangs.from : ["pt"],
    to: !!recentLangs?.to.length ? recentLangs.to : ["en"],
  };
}
