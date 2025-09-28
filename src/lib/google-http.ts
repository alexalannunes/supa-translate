import axios from "axios";

export const googleHttp = axios.create({
  baseURL: `${process.env.GOOGLE_TRANSLATION_API}`,
  params: {
    key: process.env.GOOGLE_API_KEY,
  },
});
