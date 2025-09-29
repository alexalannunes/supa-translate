"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES_MOCK } from "@/mock/languages";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowLeftRight, Check } from "lucide-react";
import { useQueryState } from "nuqs";

import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useEffect, useRef } from "react";

import { useClickOutside } from "@/hooks/use-outside-click";
import { RecentLanguage } from "@/types/recent-languages";
import {
  getRecentLanguages,
  storeRecentLanguages,
} from "@/utils/local-storage";
import { AnimatePresence, motion } from "motion/react";
import { TranslateSkeleton } from "./translate-skeleton";

const NOT_ADD_TO_RECENT = false;
const RECENT_CACHE_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week

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

  // fl = pt, but [pt, xx,xx,xx,xx,xx,xx] -> pt is last because I slice(-3).sort desc
  // BUG: previous language when is in the end of que array ins't highlighted

  const { data } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      // change to next_api env
      // const request = await axios.get("http://localhost:3000/api/languages");
      // return request.data;

      // or languages can has a prop called is_recent, target so I can check recently used
      return {
        result: {
          data: {
            languages: LANGUAGES_MOCK.result.data.languages.filter(
              (item) => item.language !== "zh-CN" // check this
            ),
          },
        },
      };
    },
  });

  const handleToggleLanguages = () => {
    const existToLangInFrom = recentLanguages.from.find(
      (item) => item === toLang
    );
    const existFromLangInTo = recentLanguages.to.find(
      (item) => item === fromLang
    );

    if (!existToLangInFrom && toLang) {
      setRecentLanguages((prev) => {
        return {
          ...prev,
          from: Array.from(new Set([toLang, ...prev.from])),
        };
      });
    }

    if (!existFromLangInTo && fromLang) {
      setRecentLanguages((prev) => {
        return {
          ...prev,
          to: Array.from(new Set([fromLang, ...prev.to])),
        };
      });
    }

    setFromLang(toLang);
    setToLang(fromLang);
  };

  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, () => {
    setOpen(false);
    setTarget(null);
    setSearch("");
  });

  const recentFrom = recentLanguages.from
    .map((item) => {
      return data?.result.data?.languages.find((s) => s.language === item);
    })
    .slice(0, 3)
    .filter((item) => !!item)
    .map((item, index) => ({ index, ...item }));

  const recentTo = recentLanguages.to
    .map((item) => {
      return data?.result.data?.languages.find((s) => s.language === item);
    })
    .slice(0, 3)
    .filter((item) => !!item)
    .map((item, index) => ({ index, ...item }));

  useEffect(() => {
    const recentStorage = getRecentLanguages();

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

  const filteredLanguages =
    data?.result.data.languages
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.language.toLowerCase().includes(search.toLowerCase())
        );
      })
      ?.sort((a, b) => a.name.localeCompare(b.name)) || [];
  // add skeleton

  // skeleton and isPending
  if (!recentLanguages.from.length) {
    return <TranslateSkeleton />;
  }
  return (
    <div className="font-sans p-8 pb-20 gap-16">
      <main className="flex flex-col gap-4 container mx-auto relative">
        <AnimatePresence>
          {open && (
            <motion.div
              transition={{ ease: "easeInOut", duration: 0.1 }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              ref={popoverRef}
              data-state={open ? "open" : "closed"}
              className="absolute top-13 bg-popover text-popover-foreground z-50 w-full rounded-md border p-4 shadow-md outline-hidden"
            >
              <Input
                placeholder="Pesquisar"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="grid grid-cols-6 gap-2 p-2 max-h-[420px] overflow-y-auto mt-4 relative">
                {filteredLanguages?.map((lang) => (
                  <Button
                    key={`${lang.language}-${lang.name}`}
                    className="w-full justify-start [&>svg]:opacity-0 aria-selected:bg-blue-100 aria-selected:text-blue-500 [&[aria-selected=true]>svg]:opacity-100"
                    aria-selected={
                      (fromLang === lang.language && target === "from") ||
                      (toLang === lang.language && target === "to")
                    }
                    variant={"ghost"}
                    onClick={() => handleSelectLanguage(lang.language)}
                  >
                    <Check className="size-3.5" />
                    {lang.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 w-full items-center">
          <div className="w-full flex gap-2 items-center">
            {recentFrom.map((item) => (
              <Button
                key={item?.language || item?.name}
                variant={"outline"}
                aria-selected={fromLang === item?.language}
                className="transition-none aria-selected:bg-blue-100 aria-selected:text-blue-500 aria-selected:border-blue-300"
                onClick={() => {
                  if (item.language === fromLang) return;
                  handleSelectLanguage(
                    item.language,
                    "from",
                    NOT_ADD_TO_RECENT
                  );
                }}
              >
                {item?.name} - {item.language}
              </Button>
            ))}

            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setOpen(true);
                setTarget("from");
              }}
            >
              <ArrowDown className="size" />
            </Button>
          </div>
          <div className="w-12">
            <Button
              size={"icon"}
              onClick={handleToggleLanguages}
              variant={"outline"}
            >
              <ArrowLeftRight />
            </Button>
          </div>
          <div className="w-full flex gap-2 items-center">
            {recentTo?.map((item) => (
              <Button
                key={item?.language || item?.name}
                data-key={item?.language || item?.name}
                variant={"outline"}
                aria-selected={toLang === item?.language}
                className="transition-none aria-selected:bg-blue-100 aria-selected:text-blue-500 aria-selected:border-blue-300"
                onClick={() => {
                  if (item.language === toLang) return;
                  handleSelectLanguage(item.language, "to", NOT_ADD_TO_RECENT);
                }}
              >
                {item?.name}
              </Button>
            ))}

            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                setOpen(true);
                setTarget("to");
              }}
            >
              <ArrowDown className="size" />
            </Button>
          </div>
        </div>
        <div className="flex gap-3 w-full min-h-52">
          <Textarea className="resize-none" />
          <Textarea className="resize-none" readOnly />
        </div>
      </main>
    </div>
  );
}
