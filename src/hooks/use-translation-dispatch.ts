import { TranslateDispatchContext } from "@/context/translation";
import { useContext } from "react";

export function useTranslateDispatch() {
  const context = useContext(TranslateDispatchContext);

  if (context === undefined) {
    throw new Error(
      "useTranslateDispatch should be inside TranslateDispatchContext"
    );
  }

  return context;
}
