import { Options } from "nuqs";
import { RecentLanguage } from "./recent-languages";
import { Dispatch, SetStateAction } from "react";

export type TranslateTarget = "from" | "to";

export interface TranslateContextType {
  fromLang: string | null;
  toLang: string | null;

  target: TranslateTarget | null;

  search: string;
  open: boolean;
  recentLanguages: RecentLanguage;
}

export interface TranslateContextDispatchType {
  setFromLang: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  setToLang: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;

  setTarget: Dispatch<SetStateAction<TranslateTarget | null>>;

  setSearch: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRecentLanguages: Dispatch<SetStateAction<RecentLanguage>>;

  onSelectLanguage: (
    language: string,
    newTarget?: "from" | "to",
    addRecent?: boolean
  ) => void;
}
