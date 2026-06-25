import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8");

for (const expected of [
  "星仔战队之灵宠奇遇记",
  "虚拟花期",
  "放课后乌鸦不叫",
  "红妆锁心",
  "狐嫁惊梦",
  "/images/works/red-dress-lock-heart.png",
  "/images/works/lonely-fox-dream.png",
  "/images/works/loch-ness-landscape.png",
  "https://space.bilibili.com/2120834879",
  "牛大师",
  "zheyouzhidabai24",
]) {
  if (!source.includes(expected)) {
    throw new Error(`Expected page to include ${expected}`);
  }
}

for (const removed of [
  'title: "灵宠预告"',
  'title: "青丘"',
  'title: "古装戏预告"',
  'title: "古装仙侠玄幻剧"',
  'title: "孤狐惊梦"',
  "星仔战队之灵宠双生记",
]) {
  if (source.includes(removed)) {
    throw new Error(`Expected page to remove ${removed}`);
  }
}

console.log("work titles ok");
