import { TranslationDispatchContext } from "@/context/translation";
import { useContext } from "react";

export function useTranslationDispatch() {
  const context = useContext(TranslationDispatchContext);

  if (context === undefined) {
    throw new Error(
      "useTranslationDispatch should be inside TranslationDispatchContext"
    );
  }

  return context;
}
