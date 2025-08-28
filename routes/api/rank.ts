import { extname, join } from "https://deno.land/std@0.203.0/path/mod.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const response = await fetch("https://kekken.com/@4h82NY2LT3a4");
      const html = await response.text();
      const rpMatch = html.match(/<div class="px-3 py-2 text-center w-2\/6">([\d,]+) RP<\/div>/);
      const rankpoints = rpMatch ? parseInt(rpMatch[1].replace(/,/g, '')) : 0;
      return new Response(JSON.stringify({ rankpoints }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } catch (error) {
      console.error("Error fetching rank data:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch rank data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};