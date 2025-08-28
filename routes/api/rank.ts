import { FreshContext } from "$fresh/server.ts";

const RANK_FILE_PATH = "./rank_points.txt";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
  try {
    const rankPointsStr = await Deno.readTextFile(RANK_FILE_PATH);
    const rankpoints = parseInt(rankPointsStr.trim(), 10);

    if (isNaN(rankpoints)) {
      throw new Error("Invalid number in rank_points.txt");
    }

    return new Response(JSON.stringify({ rankpoints }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Could not read or parse ${RANK_FILE_PATH}:`, error);
    return new Response(JSON.stringify({ error: "Could not retrieve rank points." }), { status: 500 });
  }
};