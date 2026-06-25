import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const componentPath = join(root, "app", "components", "WorkGallery.tsx");

if (!existsSync(componentPath)) {
  throw new Error("WorkGallery component is missing");
}

const source = readFileSync(componentPath, "utf8");

const requiredSnippets = [
  '"use client"',
  "useRef",
  "handlePlay",
  ".pause()",
  "data-video-card",
  "aria-label={`播放 ${work.title}`}",
  "isActive",
];

for (const snippet of requiredSnippets) {
  if (!source.includes(snippet)) {
    throw new Error(`Expected WorkGallery to include ${snippet}`);
  }
}

console.log("work gallery structure ok");
