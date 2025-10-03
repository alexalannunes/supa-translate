import {
  TranslateContextDispatchType,
  TranslateContextType,
} from "@/types/translate";
import { createContext, useContext } from "react";

export const TranslateContext = createContext<TranslateContextType>({
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

TranslateContext.displayName = "TranslateProvider";

export const TranslateDispatchContext =
  createContext<TranslateContextDispatchType>(
    {} as TranslateContextDispatchType
  );

TranslateDispatchContext.displayName = "TranslateDispatchProvider";
