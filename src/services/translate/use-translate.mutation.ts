import { googleHttp } from "@/lib/google-http";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface TranslateTextResponseTranslation {
  /**
   * he source language of the initial request, detected automatically, if no source language was passed within the initial request.
   * If the source language was passed, auto-detection of the language will not occur   and this field will be omitted.
   */
  detectedSourceLanguage?: string;
  /**
   * The translation model. Cloud Translation - Basic offers only the nmt Neural Machine Translation (NMT) model.
   * If you did not include a model parameter with your request, then this field is not included in the response.
   */
  model?: string;
  /**
   * Text translated into the target language.
   */
  translatedText: string;
}

interface TranslateTextResponseList {
  /**
   * Contains list of translation results of the supplied text.
   */
  translations: TranslateTextResponseTranslation[];
}

interface TranslateResponse {
  result: {
    data: TranslateTextResponseList;
  };
}

console.log(process.env);

export function useTranslateMutation() {
  return useMutation({
    mutationKey: ["translate"],
    mutationFn: async ({
      value,
      fromLang,
      toLang,
    }: {
      value: string;
      fromLang: string;
      toLang: string;
    }) => {
      const request = await axios.post<TranslateResponse>(
        "http://localhost:3000/api/translate",
        {
          target: toLang,
          source: fromLang,
          q: value,
        }
      );
      return request.data; // type this
    },
  });
}
