import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import axios from "axios";
import { SERVER_ERROR_STATUS } from "@/constants/http-status";
import { IS_DEV } from "@/constants/is-dev";

// const redis = Redis.fromEnv();

// rate limiter (by IP)
// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 reqs a cada 10 segundos
//   analytics: true,
// });

export async function GET(request: NextRequest) {
  try {
    const request = await axios.get(
      `${process.env.GOOGLE_TRANSLATION_API}/languages`,
      {
        params: {
          target: "pt", // display name based on target
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    return NextResponse.json({
      result: request.data,
    });
  } catch (error) {
    console.error("Server: error:", error);

    return Response.json(
      {
        error: "something went wrong",
        details: IS_DEV ? error : (error as any)?.message || "error",
      },
      SERVER_ERROR_STATUS
    );
  }
}
