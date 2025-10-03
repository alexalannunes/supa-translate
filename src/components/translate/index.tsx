"use client";

import { useClickOutside } from "@/hooks/use-outside-click";
import { useTranslateDispatch } from "@/hooks/use-translation-dispatch";
import { useTranslateState } from "@/hooks/use-translation-state";
import { useLanguages } from "@/services/queries/use-languages";
import { useRef } from "react";

import { NOT_ADD_TO_RECENT } from "@/constants/config";
import { LANGUAGES_MOCK } from "@/mock/languages";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowLeftRight, Check, Mic, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function TranslateLanguagePicker() {
  const { search, open, fromLang, toLang, target } = useTranslateState();
  const { setSearch, setOpen, setTarget, onSelectLanguage } =
    useTranslateDispatch();

  const popoverRef = useRef<HTMLDivElement>(null);

  const { data } = useLanguages();

  useClickOutside(popoverRef, () => {
    setOpen(false);
    setTarget(null);
    setSearch("");
  });

  const filteredLanguages =
    data?.result.data.languages
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.language.toLowerCase().includes(search.toLowerCase())
        );
      })
      ?.sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
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
                onClick={() => onSelectLanguage(lang.language)}
              >
                <Check className="size-3.5" />
                {lang.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TranslateRecentFromLanguages() {
  const { recentLanguages, fromLang } = useTranslateState();
  const { onSelectLanguage, setOpen, setTarget } = useTranslateDispatch();

  const { data } = useLanguages();

  const recentFrom = recentLanguages.from
    .map((item) => {
      return data?.result.data?.languages.find((s) => s.language === item);
    })
    .slice(0, 3)
    .filter((item) => !!item)
    .map((item, index) => ({ index, ...item }));
  return (
    <>
      {recentFrom.map((item) => (
        <Button
          key={item?.language || item?.name}
          variant={"outline"}
          aria-selected={fromLang === item?.language}
          className="transition-none aria-selected:bg-blue-100 aria-selected:text-blue-500 aria-selected:border-blue-300"
          onClick={() => {
            if (item.language === fromLang) return;
            onSelectLanguage(item.language, "from", NOT_ADD_TO_RECENT);
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
          setTarget("from");
        }}
      >
        <ArrowDown className="size" />
      </Button>
    </>
  );
}

export function TranslateSwapLanguage() {
  const { fromLang, toLang } = useTranslateState();
  const { setFromLang, setToLang, setRecentLanguages } = useTranslateDispatch();

  const handleSwapLanguages = () => {
    // NOTE: in google translate, selected language does not move

    // always set language as first when swap
    if (toLang) {
      setRecentLanguages((prev) => {
        return {
          ...prev,
          from: Array.from(new Set([toLang, ...prev.from])),
        };
      });
    }

    // always set language as first when swap
    if (fromLang) {
      setRecentLanguages((prev) => {
        return {
          ...prev,
          to: Array.from(new Set([fromLang, ...prev.to])),
        };
      });
    } else {
      console.log("else []to");
    }

    setFromLang(toLang);
    setToLang(fromLang);
  };
  return (
    <Button size={"icon"} onClick={handleSwapLanguages} variant={"outline"}>
      <ArrowLeftRight />
    </Button>
  );
}

export function TranslateRecentToLanguages() {
  const { recentLanguages, fromLang, toLang } = useTranslateState();
  const { onSelectLanguage, setOpen, setTarget } = useTranslateDispatch();

  const { data } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      // change to next_api env
      // const request = await axios.get("http://localhost:3000/api/languages");
      // return request.data;

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

  const recentTo = recentLanguages.to
    .map((item) => {
      return data?.result.data?.languages.find((s) => s.language === item);
    })
    .slice(0, 3)
    .filter((item) => !!item)
    .map((item, index) => ({ index, ...item }));

  return (
    <>
      {recentTo?.map((item) => (
        <Button
          key={item?.language || item?.name}
          data-key={item?.language || item?.name}
          variant={"outline"}
          aria-selected={toLang === item?.language}
          className="transition-none aria-selected:bg-blue-100 aria-selected:text-blue-500 aria-selected:border-blue-300"
          onClick={() => {
            if (item.language === toLang) return;
            onSelectLanguage(item.language, "to", NOT_ADD_TO_RECENT);
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
    </>
  );
}

export function TranslateRecordButton() {
  return (
    <Button size={"icon"} variant={"outline"}>
      <Mic />
    </Button>
  );
}

export function TranslateSpeakButton() {
  return (
    <Button size={"icon"} variant={"outline"}>
      <Volume2 />
    </Button>
  );
}
