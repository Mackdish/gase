import { env } from "cloudflare:workers";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const started = Date.now();

  if (!env.DB) {
    return Response.json(
      { ok: false, error: "D1 binding DB is not configured" },
      { status: 503 }
    );
  }

  try {
    await env.DB.prepare("SELECT 1 AS ok").first();
    return jsonOk({
      service: "gase-store",
      database: "connected",
      latencyMs: Date.now() - started,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json(
      { ok: false, error: "Database unavailable" },
      { status: 503 }
    );
  }
}
