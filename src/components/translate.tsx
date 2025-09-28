"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES_MOCK } from "@/mock/languages";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigDown, ArrowDown, ArrowLeftRight, Check } from "lucide-react";
import { useQueryState } from "nuqs";

import { Input } from "@/components/ui/input";
import { RefObject, useState } from "react";

import { useEffect, useRef } from "react";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

// TODO
// page.tsx will be a server component (async component)
// apply redirect if query params does not exist

function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}

export function Translate() {
  // TODO: we have some flash when load

  const [fromLang, setFromLang] = useQueryState("fl"); // fl = from language
  const [toLang, setToLang] = useQueryState("tl"); // tl = to language

  const [target, setTarget] = useState<"from" | "to" | null>(null);

  const [search, setSearch] = useState("");

  // should be new set? store this
  const [recent, setRecent] = useState<{ from: string[]; to: string[] }>(() => {
    return {
      from: [],
      to: [],
    };
  });

  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      // change to next_api env
      // const request = await axios.get("http://localhost:3000/api/languages");
      // return request.data;

      // or languages can has a prop called is_recent, target so I can check recently used
      return LANGUAGES_MOCK;
    },
  });

  const handleToggleLanguages = () => {
    const existToLangInFrom = recent.from.find((item) => item === toLang);
    const existFromLangInTo = recent.to.find((item) => item === fromLang);

    if (!existToLangInFrom && toLang) {
      setRecent((prev) => {
        return {
          ...prev,
          from: Array.from(new Set([...prev.from, toLang])),
        };
      });
    }

    if (!existFromLangInTo && fromLang) {
      setRecent((prev) => {
        return {
          ...prev,
          to: Array.from(new Set([...prev.to, fromLang])),
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

  const recentFrom = recent.from
    .map((item) => {
      return data?.result.data?.languages.find((s) => s.language === item);
    })
    .filter((item) => !!item)
    ?.slice(-3)
    .map((item, index) => ({ index, ...item }))
    .sort((a, b) => b.index - a.index);

  const recentTo = recent.to
    .map((item) => {
      return data?.result.data?.languages.find((s) => s.language === item);
    })
    .filter((item) => !!item)
    ?.slice(-3)
    .map((item, index) => ({ index, ...item }))
    .sort((a, b) => b.index - a.index);

  useEffect(() => {
    const recentStorage = JSON.parse(
      window.localStorage.getItem("supa-translate:recent-languages") || "{}"
    );

    console.log({ recentStorage });

    const from: string[] = recentStorage?.from || [fromLang || "pt"];
    const to: string[] = recentStorage?.to || [toLang || "en"];
    setRecent({ from, to });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "supa-translate:recent-languages",
      JSON.stringify(recent)
    );
  }, [recent]);

  const filteredLanguages =
    data?.result.data.languages.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.language.toLowerCase().includes(search.toLowerCase())
      );
    }) || [];
  // add skeleton

  // skeleton and isPending
  if (!recent.from.length) {
    return (
      <div className="font-sans p-8 pb-20 gap-16">
        <main className="flex flex-col gap-4 container mx-auto relative">
          <div className="flex gap-3 w-full items-center">
            <div className="w-full flex gap-2 items-center">
              <Skeleton className="w-32 h-9" />
              <Skeleton className="w-32 h-9" />
              <Skeleton className="w-32 h-9" />
              <Skeleton className="w-10 h-9" />
            </div>
            <div className="w-12">
              <Skeleton className="w-10 h-9" />
            </div>
            <div className="w-full flex gap-2 items-center">
              <Skeleton className="w-32 h-9" />
              <Skeleton className="w-32 h-9" />
              <Skeleton className="w-32 h-9" />
              <Skeleton className="w-10 h-9" />
            </div>
          </div>
          <div className="flex gap-3 w-full min-h-52">
            <Skeleton className="w-full h-52" />
            <Skeleton className="w-full h-52" />
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="font-sans p-8 pb-20 gap-16">
      <main className="flex flex-col gap-4 container mx-auto relative">
        <AnimatePresence>
          {open && (
            <motion.div
              // remove elastic
              transition={{
                ease: "easeInOut",
                duration: 0.1,
              }}
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -5,
              }}
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
                    onClick={() => {
                      if (
                        fromLang === lang.language ||
                        toLang === lang.language
                      ) {
                        // setOpen(false);
                        // swipe?
                        return false;
                      }
                      if (target === "from") {
                        // duplicated logic
                        if (lang.language === toLang) {
                          setToLang(fromLang);
                        }
                        setFromLang(lang.language);

                        if (fromLang) {
                          setRecent((prev) => {
                            return {
                              ...prev,
                              from: Array.from(
                                new Set([...prev.from, lang.language])
                              ),
                            };
                          });
                        }
                      } else {
                        // duplicated logic
                        if (lang.language === fromLang) {
                          setFromLang(toLang);
                        }
                        setToLang(lang.language);

                        if (fromLang) {
                          setRecent((prev) => {
                            return {
                              ...prev,
                              to: Array.from(
                                new Set([...prev.to, lang.language])
                              ),
                            };
                          });
                        }
                      }

                      // setOpen(false)
                    }}
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
                className="aria-selected:bg-blue-100 aria-selected:text-blue-500 aria-selected:border-blue-300"
                onClick={() => {
                  if (item.language === fromLang) {
                    return;
                  }

                  if (item?.language) {
                    setFromLang(item.language);
                  }

                  // duplicated logic
                  if (item.language === toLang) {
                    setToLang(fromLang);
                  }
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
                className="aria-selected:bg-blue-100 aria-selected:text-blue-500 aria-selected:border-blue-300"
                onClick={() => {
                  if (item?.language) {
                    setToLang(item.language);
                  }

                  // duplicated logic
                  if (item.language === fromLang) {
                    setFromLang(toLang);
                  }
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
          <Textarea className="resize-none" />
        </div>
      </main>
    </div>
  );
}
