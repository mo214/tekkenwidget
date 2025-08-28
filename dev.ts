import dev from "https://deno.land/x/fresh@1.6.4/dev.ts"
await dev(import.meta.url, "./main.ts");