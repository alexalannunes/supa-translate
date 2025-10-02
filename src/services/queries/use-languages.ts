import { LANGUAGES_MOCK } from "@/mock/languages";
import { useQuery } from "@tanstack/react-query";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      // change to next_api env
      // const request = await axios.get("http://localhost:3000/api/languages");
      // return request.data;

      return {
        result: {
          data: {
            languages: LANGUAGES_MOCK.result.data.languages.filter(
              (item) => item.language !== "zh-CN" // check this
            ),
          },
        },
      };
    },
    staleTime: Infinity,
  });
}
