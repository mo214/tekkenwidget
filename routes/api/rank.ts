export const handler = async () => {
  const response = await fetch("https://kekken.com/@4h82NY2LT3a4");
  const htmll = await response.text();
  const rpMatch = htmll.match(/<div class="px-3 py-2 text-center w-2\/6">([\d,]+) RP<\/div>/);
  const rankpoints = rpMatch ? parseInt(rpMatch[1].replace(/,/g, '')) : 0;
  return new Response(JSON.stringify({ rankpoints }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};