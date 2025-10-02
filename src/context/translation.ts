import {
  TranslationContextDispatchType,
  TranslationContextType,
} from "@/types/translate";
import { createContext, useContext } from "react";

export const TranslationContext = createContext<TranslationContextType>({
  fromLang: null,
  toLang: null,
  target: null,
  search: "",
  open: false,
  recentLanguages: {
    from: [],
    to: [],
  },
});

TranslationContext.displayName = "TranslationProvider";

export const TranslationDispatchContext =
  createContext<TranslationContextDispatchType>(
    {} as TranslationContextDispatchType
  );

TranslationDispatchContext.displayName = "TranslationDispatchProvider";
