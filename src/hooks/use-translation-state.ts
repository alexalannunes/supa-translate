import { TranslateContext } from "@/context/translation";
import { useContext } from "react";

export function useTranslateState() {
  const context = useContext(TranslateContext);

  if (context === undefined) {
    throw new Error("useTranslateState should be inside TranslateContext");
  }

  return context;
}
