"use client";

import { Textarea } from "@/components/ui/textarea";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import {
  TranslateContext,
  TranslateDispatchContext,
} from "@/context/translation";
import { RecentLanguage } from "@/types/recent-languages";
import {
  getRecentLanguages,
  storeRecentLanguages,
} from "@/utils/local-storage";
import {
  TranslateEditableTextarea,
  TranslateLanguagePicker,
  TranslateRecentFromLanguages,
  TranslateRecentToLanguages,
  TranslateRecordButton,
  TranslateSpeakButton,
  TranslateSwapLanguage,
} from "./translate";
import { TranslateSkeleton } from "./translate-skeleton";
import { useLanguages } from "@/services/translate/use-languages.query";
import { useTranslateMutation } from "@/services/translate/use-translate.mutation";

export function TranslatePage() {
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

  const [debouncedUserInput, setDebouncedUserInput] = useState("");

  const { isPending } = useLanguages();
  const translateMutation = useTranslateMutation();

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

  if (isPending) {
    return <TranslateSkeleton />;
  }

  return (
    <TranslateContext.Provider
      value={{
        fromLang,
        toLang,
        open,
        recentLanguages,
        search,
        target,
      }}
    >
      <TranslateDispatchContext.Provider
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
            <TranslateLanguagePicker />
            <div className="flex flex-col lg:flex-row gap-3 w-full items-center">
              <div className="w-full flex gap-2 items-center">
                <TranslateRecentFromLanguages />
              </div>
              {/* TODO: should swap input value with translated text */}
              <div className="w-12">
                <TranslateSwapLanguage />
              </div>
              <div className="w-full flex gap-2 items-center">
                <TranslateRecentToLanguages />
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row w-full min-h-52">
              <div className="relative w-full space-y-2">
                <TranslateEditableTextarea
                  onValueChange={(value) => {
                    if (fromLang && toLang) {
                      translateMutation.mutate({ value, fromLang, toLang });
                    }
                  }}
                />
                {debouncedUserInput}
                <div className="flex gap-2 absolute bottom-2 left-2">
                  <TranslateRecordButton />
                  <TranslateSpeakButton />
                </div>
              </div>
              <div className="relative w-full space-y-2">
                <Textarea className="resize-none h-full pb-12" readOnly />
                <div className="flex gap-2 absolute bottom-2 left-2">
                  <TranslateSpeakButton />
                </div>
              </div>
            </div>
          </main>
        </div>
      </TranslateDispatchContext.Provider>
    </TranslateContext.Provider>
  );
}
