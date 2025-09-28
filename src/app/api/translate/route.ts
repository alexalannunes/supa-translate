import {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
} from "@/constants/http-status";
import { IS_DEV } from "@/constants/is-dev";
import { googleHttp } from "@/lib/google-http";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

// const redis = Redis.fromEnv();

// rate limiter (by IP)
// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 reqs a cada 10 segundos
//   analytics: true,
// });

const schema = z.object({
  q: z.string().nonempty("q is required"),
  source: z.string().nonempty("source is required"),
  target: z.string().nonempty("target is required"),
});

type Body = z.infer<typeof schema>;

// format and key are in backend

export async function POST(request: Request) {
  let body: Body = {} as Body;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid payload. Please send a valid payload",
      },
      SERVER_ERROR_STATUS
    );
  }

  if (
    !body == null ||
    (typeof body === "object" && Object.keys(body).length === 0)
  ) {
    return NextResponse.json(
      {
        error: "payload is empty. Please send the correct payload",
      },
      BAD_REQUEST_STATUS
    );
  }

  try {
    const result = schema.parse(body);

    const request = await googleHttp.post(
      process.env.GOOGLE_TRANSLATION_API,
      null,
      {
        params: {
          ...result,
          format: "text",
        },
      }
    );

    return NextResponse.json({
      result: request.data,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation errors
      return Response.json(
        { message: "Validation failed", errors: error.flatten() },
        BAD_REQUEST_STATUS
      );
    }

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
