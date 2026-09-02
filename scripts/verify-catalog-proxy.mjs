/**
 * Verifies the catalog proxy end to end: pdf.js opens each brand's catalog
 * through /api/catalog/<slug>/<n>, over HTTP Range, with no CDN URL involved.
 *
 *   node scripts/_verify-catalog-proxy.mjs [baseUrl]
 */

import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const BASE = process.argv[2] ?? "http://localhost:3000";

const CASES = [
  ["hafele", 0, "sliding.pdf (70.7M)"],
  ["labacha", 0, "Long Handle"],
  ["labacha", 1, "Sofa Leg"],
  ["geze", 0, "smallest"],
  ["labacha", 2, "out of range - expect 404"],
];

let pass = 0;
let fail = 0;

for (const [slug, index, note] of CASES) {
  const url = `${BASE}/api/catalog/${slug}/${index}`;
  const expect404 = note.includes("404");

  try {
    const head = await fetch(url, { headers: { Range: "bytes=0-99" } });

    if (expect404) {
      const ok = head.status === 404;
      console.log(`${ok ? "PASS" : "FAIL"}  ${slug}/${index}  ${head.status}  (${note})`);
      ok ? pass++ : fail++;
      continue;
    }

    const rangeOk = head.status === 206 && head.headers.get("content-type") === "application/pdf";
    const noFilename = !(head.headers.get("content-disposition") || "").includes("filename");

    const task = pdfjs.getDocument({ url, disableAutoFetch: true });
    const doc = await task.promise;
    const page = await doc.getPage(1);
    const vp = page.getViewport({ scale: 1 });
    const text = (await page.getTextContent()).items.length;
    await task.destroy(); // destroy lives on the loading task in pdf.js 6

    const ok = rangeOk && noFilename && doc.numPages > 0;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${slug}/${index}  206=${head.status === 206}` +
        ` pdf=${head.headers.get("content-type")}` +
        ` noFilename=${noFilename}` +
        ` pages=${doc.numPages}` +
        ` p1=${Math.round(vp.width)}x${Math.round(vp.height)}` +
        ` items=${text}  (${note})`
    );
    ok ? pass++ : fail++;
  } catch (err) {
    console.log(`FAIL  ${slug}/${index}  ${err.message}  (${note})`);
    fail++;
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
