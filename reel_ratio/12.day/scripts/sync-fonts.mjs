// Copies the Bengali / Latin (Hind Siliguri) and Arabic (Noto Sans Arabic) woff2 files from
// node_modules (@fontsource) into public/fonts so rendering needs no network access.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public/fonts");
mkdirSync(out, { recursive: true });
const jobs = [];
for (const w of [400, 600, 700]) for (const s of ["bengali", "latin"]) jobs.push(["hind-siliguri", `hind-siliguri-${s}-${w}-normal.woff2`]);
for (const w of [400, 700]) jobs.push(["noto-sans-arabic", `noto-sans-arabic-arabic-${w}-normal.woff2`]);
for (const [pkg, file] of jobs) {
  const src = join(root, "node_modules/@fontsource", pkg, "files", file);
  if (!existsSync(src)) throw new Error(`Missing ${src} - run npm install first`);
  copyFileSync(src, join(out, file));
}
console.log(`copied ${jobs.length} font files to public/fonts`);
