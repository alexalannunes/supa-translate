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

export function useClickOutside(
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

export default function Home() {
  const [fromLang, setFromLang] = useQueryState("fl"); // fl = from language
  const [toLang, setToLang] = useQueryState("tl"); // tl = to language

  const [target, setTarget] = useState<"from" | "to" | null>(null);

  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      // change to next_api env
      // const request = await axios.get("http://localhost:3000/api/languages");
      // return request.data;

      return LANGUAGES_MOCK;
    },
  });

  const handleToggleLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, () => {
    setOpen(false);
  });

  const selectedFromLanguage = data?.result.data.languages.find(
    (item) => item.language === fromLang
  );
  const selectedToLanguage = data?.result.data.languages.find(
    (item) => item.language === toLang
  );

  return (
    <div className="font-sans p-8 pb-20 gap-16">
      <main className="flex flex-col gap-4 container mx-auto relative">
        {open && (
          <div
            ref={popoverRef}
            data-state={open ? "open" : "closed"}
            className="absolute top-13 bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 w-full rounded-md border p-4 shadow-md outline-hidden"
          >
            <Input placeholder="Pesquisar" autoFocus />
            <div className="grid grid-cols-6 gap-2 max-h-[420px] overflow-y-auto mt-4 relative">
              {data?.result.data.languages.map((lang) => (
                <Button
                  key={`${lang.language}-${lang.name}`}
                  className="w-full justify-start [&>svg]:opacity-0 aria-selected:bg-blue-100 aria-selected:text-blue-500 [&[aria-selected=true]>svg]:opacity-100"
                  aria-selected={
                    (selectedFromLanguage?.language === lang.language &&
                      target === "from") ||
                    (selectedToLanguage?.language === lang.language &&
                      target === "to")
                  }
                  variant={"ghost"}
                  onClick={() => {
                    if (target === "from") {
                      setFromLang(lang.language);
                    }
                    // check target is null
                    else {
                      setToLang(lang.language);
                    }
                  }}
                >
                  <Check className="size-3.5" />
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full items-center">
          <div className="w-full flex gap-2 items-center">
            <Button variant={"outline"}>
              {selectedFromLanguage?.name || "(unknown)"}
            </Button>

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
            {/* na verdade deve ir pro selecionado da lista, nao exibir assim, tambem deve ser ordenado
             */}

            {/* exibir no maximo 4 idiomas, recentes */}

            <Button variant={"outline"}>
              {selectedToLanguage?.name || "(unknown)"}
            </Button>

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
