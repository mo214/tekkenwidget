import { extname, join } from "https://deno.land/std@0.203.0/path/mod.ts";

const apiPath = "/api/rank";
const rootDir = Deno.cwd();

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // API endpoint for rank points
  if (url.pathname === apiPath) {
    const response = await fetch("https://kekken.com/@4h82NY2LT3a4");
    const htmll = await response.text();
    const rpMatch = htmll.match(/<div class="px-3 py-2 text-center w-2\/6">([\d,]+) RP<\/div>/);
    const rankpoints = rpMatch ? parseInt(rpMatch[1].replace(/,/g, '')) : 0;
    return new Response(JSON.stringify({ rankpoints }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  // Serve static files (index.html, assets, etc.)
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = join(rootDir, decodeURIComponent(filePath.replace(/^\/+/, "")));

  try {
    const file = await Deno.readFile(filePath);
    const ext = extname(filePath);
    const contentType = ({
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".json": "application/json",
    } as Record<string, string>)[ext] || "application/octet-stream";

    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
});