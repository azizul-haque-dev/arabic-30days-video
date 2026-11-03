import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const fontsDir = path.join(rootDir, "public", "fonts");

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fontList = [
  {
    name: "HindSiliguri-Regular.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Regular.ttf",
    family: "Hind Siliguri",
    weight: "400",
  },
  {
    name: "HindSiliguri-SemiBold.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-SemiBold.ttf",
    family: "Hind Siliguri",
    weight: "600",
  },
  {
    name: "HindSiliguri-Bold.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Bold.ttf",
    family: "Hind Siliguri",
    weight: "700",
  },
  {
    name: "NotoSansArabic.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf",
    family: "Noto Sans Arabic",
    weight: "100 900",
  },
];

async function run() {
  for (const f of fontList) {
    const dest = path.join(fontsDir, f.name);
    console.log(`Downloading ${f.name}...`);
    const res = await fetch(f.url);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`Saved ${f.name} (${buf.length} bytes)`);
  }
  console.log("All complete offline fonts saved successfully!");
}

run().catch(console.error);
