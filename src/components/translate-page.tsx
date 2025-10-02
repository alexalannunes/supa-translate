"use client";

import { Textarea } from "@/components/ui/textarea";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import {
  TranslationContext,
  TranslationDispatchContext,
} from "@/context/translation";
import { RecentLanguage } from "@/types/recent-languages";
import {
  getRecentLanguages,
  storeRecentLanguages,
} from "@/utils/local-storage";
import {
  TranslationLanguagePicker,
  TranslationRecentFromLanguages,
  TranslationRecentToLanguages,
  TranslationRecordButton,
  TranslationSpeakButton,
  TranslationSwapLanguage,
} from "./translate";

export function Translate() {
  const [fromLang, setFromLang] = useQueryState("fl"); // fl = from language
  const [toLang, setToLang] = useQueryState("tl"); // tl = to language
  const [target, setTarget] = useState<"from" | "to" | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [recentLanguages, setRecentLanguages] = useState<RecentLanguage>(() => {
    return {
      from: [],
      to: [],
    };
  });

  //

  // fl = pt, but [pt, xx,xx,xx,xx,xx,xx] -> pt is last because I slice(-3).sort desc
  // BUG: previous language when is in the end of que array ins't highlighted

  useEffect(() => {
    const recentStorage = getRecentLanguages();

    // actually, from must be en (or detect language), and to must be pt
    const from: string[] = recentStorage.from || [fromLang || "pt"];
    const to: string[] = recentStorage.to || [toLang || "en"];

    setRecentLanguages({ from, to });
  }, []);

  const handleSelectLanguage = (
    language: string,
    newTarget?: "from" | "to",
    addRecent = true /* good idea */
  ) => {
    const currentTarget = newTarget || target;

    if (currentTarget === "from") {
      // duplicated logic
      if (language === toLang) {
        setToLang(fromLang);
      }
      setFromLang(language);

      if (fromLang && addRecent) {
        setRecentLanguages((prev) => {
          return {
            ...prev,
            from: Array.from(new Set([language, ...prev.from])),
          };
        });
      }
    } else {
      // duplicated logic
      if (language === fromLang) {
        setFromLang(toLang);
      }
      setToLang(language);

      if (toLang && addRecent) {
        setRecentLanguages((prev) => {
          return {
            ...prev,
            // add language before prev

            to: Array.from(new Set([language, ...prev.to])),
          };
        });
      }
    }

    setSearch("");
    setOpen(false);
  };

  useEffect(() => {
    storeRecentLanguages(recentLanguages);
  }, [recentLanguages]);

  // skeleton and isPending
  // if (!recentLanguages.from.length) {
  //   return <TranslateSkeleton />;
  // }

  return (
    <TranslationContext.Provider
      value={{
        fromLang,
        toLang,
        open,
        recentLanguages,
        search,
        target,
      }}
    >
      <TranslationDispatchContext.Provider
        value={{
          setFromLang,
          setToLang,
          setOpen,
          setRecentLanguages,
          setSearch,
          setTarget,
          onSelectLanguage: handleSelectLanguage,
        }}
      >
        <div className="font-sans p-8 pb-20 gap-16">
          <main className="flex flex-col gap-4 container mx-auto relative">
            <TranslationLanguagePicker />
            <div className="flex gap-3 w-full items-center">
              <div className="w-full flex gap-2 items-center">
                <TranslationRecentFromLanguages />
              </div>
              <div className="w-12">
                <TranslationSwapLanguage />
              </div>
              <div className="w-full flex gap-2 items-center">
                <TranslationRecentToLanguages />
              </div>
            </div>
            <div className="flex gap-3 w-full min-h-52">
              <div className="relative w-full space-y-2">
                <Textarea className="resize-none h-full pb-12" />
                <div className="flex gap-2 absolute bottom-2 left-2">
                  <TranslationRecordButton />
                  <TranslationSpeakButton />
                </div>
              </div>
              <div className="relative w-full space-y-2">
                <Textarea className="resize-none h-full pb-12" readOnly />
                <div className="flex gap-2 absolute bottom-2 left-2">
                  <TranslationSpeakButton />
                </div>
              </div>
            </div>
          </main>
        </div>
      </TranslationDispatchContext.Provider>
    </TranslationContext.Provider>
  );
}
