import { TranslationContext } from "@/context/translation";
import { useContext } from "react";

export function useTranslationState() {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error("useTranslationState should be inside TranslationContext");
  }

  return context;
}
