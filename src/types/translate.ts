import { Options } from "nuqs";
import { RecentLanguage } from "./recent-languages";
import { Dispatch, SetStateAction } from "react";

export type TranslationTarget = "from" | "to";

export interface TranslationContextType {
  fromLang: string | null;
  toLang: string | null;

  target: TranslationTarget | null;

  search: string;
  open: boolean;
  recentLanguages: RecentLanguage;
}

export interface TranslationContextDispatchType {
  setFromLang: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  setToLang: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;

  setTarget: Dispatch<SetStateAction<TranslationTarget | null>>;

  setSearch: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRecentLanguages: Dispatch<SetStateAction<RecentLanguage>>;

  onSelectLanguage: (
    language: string,
    newTarget?: "from" | "to",
    addRecent?: boolean
  ) => void;
}
