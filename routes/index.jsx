import { Head } from "$fresh/runtime.ts";
import TekkenRankWidget from "../TekkenRankWidget.jsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tekken Rank Widget</title>
        {/* Link the external CSS file */}
        <link rel="stylesheet" href="/static/TekkenRankWidget.css" />
      </Head>
      <TekkenRankWidget />
    </>
  );
}