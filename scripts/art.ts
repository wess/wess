const glyphs: Record<string, string> = {
  A: "01110/10001/10001/11111/10001/10001/10001",
  B: "11110/10001/10001/11110/10001/10001/11110",
  C: "01111/10000/10000/10000/10000/10000/01111",
  D: "11110/10001/10001/10001/10001/10001/11110",
  E: "11111/10000/10000/11110/10000/10000/11111",
  F: "11111/10000/10000/11110/10000/10000/10000",
  G: "01111/10000/10000/10111/10001/10001/01111",
  H: "10001/10001/10001/11111/10001/10001/10001",
  I: "11111/00100/00100/00100/00100/00100/11111",
  J: "00111/00010/00010/00010/10010/10010/01100",
  K: "10001/10010/10100/11000/10100/10010/10001",
  L: "10000/10000/10000/10000/10000/10000/11111",
  M: "10001/11011/10101/10101/10001/10001/10001",
  N: "10001/11001/10101/10011/10001/10001/10001",
  O: "01110/10001/10001/10001/10001/10001/01110",
  P: "11110/10001/10001/11110/10000/10000/10000",
  Q: "01110/10001/10001/10001/10101/10010/01101",
  R: "11110/10001/10001/11110/10100/10010/10001",
  S: "01111/10000/10000/01110/00001/00001/11110",
  T: "11111/00100/00100/00100/00100/00100/00100",
  U: "10001/10001/10001/10001/10001/10001/01110",
  V: "10001/10001/10001/10001/10001/01010/00100",
  W: "10001/10001/10001/10101/10101/10101/01010",
  X: "10001/10001/01010/00100/01010/10001/10001",
  Y: "10001/10001/01010/00100/00100/00100/00100",
  Z: "11111/00001/00010/00100/01000/10000/11111",
  "0": "01110/10001/10011/10101/11001/10001/01110",
  "1": "00100/01100/00100/00100/00100/00100/01110",
  "2": "01110/10001/00001/00010/00100/01000/11111",
  "3": "11110/00001/00001/01110/00001/00001/11110",
  "4": "00010/00110/01010/10010/11111/00010/00010",
  "/": "00001/00001/00010/00100/01000/10000/10000",
  ".": "00000/00000/00000/00000/00000/00110/00110",
  ">": "10000/01000/00100/00010/00100/01000/10000",
  "-": "00000/00000/00000/11111/00000/00000/00000",
  " ": "00000/00000/00000/00000/00000/00000/00000",
};

const palette = {
  bg: "#101b26", inset: "#172c35", gold: "#e2bc70", edge: "#556050",
  mint: "#88d4ac", cream: "#f0e5c7", muted: "#a5bbbc", pink: "#dc83ae",
};

const rect = (x: number, y: number, w: number, h: number, fill: string): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

const text = (label: string, x: number, y: number, size = 2, color = palette.cream): string => {
  let path = "";
  for (const [i, char] of [...label.toUpperCase()].entries()) {
    const glyph = glyphs[char];
    if (!glyph) throw new Error(`missing glyph: ${char}`);
    glyph.split("/").forEach((row, dy) => {
      [...row].forEach((pixel, dx) => {
        if (pixel === "1") path += `M${x + (i * 6 + dx) * size} ${y + dy * size}h${size}v${size}h-${size}z`;
      });
    });
  }
  return `<path fill="${color}" d="${path}"/>`;
};

const frame = (w: number, h: number): string =>
  rect(0, 0, w, h, palette.bg) +
  `<path d="M8 2H${w - 8}V6H${w - 2}V${h - 6}H${w - 8}V${h - 2}H8V${h - 6}H2V6H8Z" fill="none" stroke="${palette.edge}" stroke-width="2"/>` +
  [8, w - 12].map(x => rect(x, 8, 4, 4, palette.gold) + rect(x, h - 12, 4, 4, palette.gold)).join("");

const sprites: Record<string, string[]> = {
  sword: [".......cc", "......ccc", ".....ccc.", "....ccc..", ".g.ccc...", "..gcc....", "..gg.....", ".g..g....", "g........"],
  shield: [".ggggggg.", "ggccccccg", "gcccccccg", "gccgggccg", "gcccggccg", ".gcccccg.", "..gcccg..", "...gcg...", "....g...."],
  chest: ["..gggggg..", ".gggggggg.", "gmmmmmmmmg", "gggggggggg", "gmmmggmmmg", "gmmmggmmmg", "gmmmmmmmmg", ".gggggggg."],
  gem: ["...mmm...", "..mcccm..", ".mcccccm.", "mcccccccm", ".mcccccm.", "..mcccm..", "...mcm...", "....m...."],
  heart: [".pp.pp.", "ppppppp", "ppppppp", ".ppppp.", "..ppp..", "...p..."],
};

const sprite = (name: string, x: number, y: number, size = 3): string => {
  const colors: Record<string, string> = { g: palette.gold, c: palette.cream, m: palette.mint, p: palette.pink };
  return sprites[name].flatMap((row, dy) => [...row].map((pixel, dx) =>
    pixel === "." ? "" : rect(x + dx * size, y + dy * size, size, size, colors[pixel]),
  )).join("");
};

async function save(name: string, w: number, h: number, title: string, body: string): Promise<void> {
  await Bun.write(`assets/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${title}</title><g shape-rendering="crispEdges">${body}</g></svg>\n`,
  );
}

await save("quests", 840, 52, "Select a quest / Selected open source projects",
  frame(840, 52) + sprite("sword", 24, 12, 3) +
  text("SELECT A QUEST", 68, 19, 2, palette.gold) + text("OPEN SOURCE / WORLD 01", 557, 21, 1.5, palette.muted),
);

const quests = [
  { name: "tailor", icon: "sword", number: "01", lines: ["VISUAL INTERFACE BUILDER", "FOR NATIVE RUST APPS"], tag: "RUST / GPUI" },
  { name: "guise", icon: "shield", number: "02", lines: ["COMPONENTS FOR GPUI", "BUILD YOUR NEXT INTERFACE"], tag: "RUST / UI" },
  { name: "hopper", icon: "chest", number: "03", lines: ["A FREE DESKTOP APP", "FOR MANAGING DOCKER"], tag: "RUST / DESKTOP" },
  { name: "atlas", icon: "gem", number: "04", lines: ["COMPOSABLE BUILDING BLOCKS", "FOR APIS / APPS / CLIS"], tag: "BUN / TYPESCRIPT" },
];

for (const quest of quests) {
  await save(quest.name, 410, 174, `${quest.name}: ${quest.lines.join(" ").toLowerCase()}. ${quest.tag}.`,
    frame(410, 174) + rect(18, 18, 48, 48, palette.inset) + sprite(quest.icon, 28, 27) +
    text(quest.name, 84, 22, 3, palette.gold) + text(`QUEST ${quest.number}`, 84, 52, 1.5, palette.muted) +
    text(quest.lines[0], 24, 88, 2) + text(quest.lines[1], 24, 110, 2) +
    rect(24, 136, 362, 1, palette.edge) + text(quest.tag, 24, 149, 1.5, palette.mint) +
    text(">", 370, 147, 2, palette.gold),
  );
}

await save("inventory", 840, 144, "Inventory: Rust, TypeScript, Bun, C, Swift, GPUI, Docker, PostgreSQL",
  frame(840, 144) + sprite("chest", 24, 18, 2) +
  text("INVENTORY", 58, 19, 2, palette.gold) + text("EQUIPPED FOR THE NEXT BUILD", 575, 22, 1.5, palette.muted) +
  ["RUST", "TYPESCRIPT", "BUN", "C", "SWIFT", "GPUI", "DOCKER", "POSTGRESQL"].map((label, i) => {
    const x = 24 + (i % 4) * 204;
    const y = 54 + Math.floor(i / 4) * 40;
    return rect(x, y, 180, 30, palette.inset) +
      rect(x + 10, y + 12, 6, 6, i < 4 ? palette.mint : palette.pink) +
      text(label, x + 26, y + 9, 1.5);
  }).join(""),
);

await save("inventorymobile", 410, 230, "Inventory: Rust, TypeScript, Bun, C, Swift, GPUI, Docker, PostgreSQL",
  frame(410, 230) + sprite("chest", 24, 18, 2) + text("INVENTORY", 58, 19, 2, palette.gold) +
  ["RUST", "TYPESCRIPT", "BUN", "C", "SWIFT", "GPUI", "DOCKER", "POSTGRESQL"].map((label, i) => {
    const x = 18 + (i % 2) * 190;
    const y = 56 + Math.floor(i / 2) * 40;
    return rect(x, y, 184, 30, palette.inset) +
      rect(x + 10, y + 12, 6, 6, i < 4 ? palette.mint : palette.pink) +
      text(label, x + 26, y + 9, 2);
  }).join(""),
);

const car = rect(648, 26, 22, 38, palette.cream) + rect(644, 31, 4, 10, palette.bg) +
  rect(670, 31, 4, 10, palette.bg) + rect(644, 50, 4, 10, palette.bg) +
  rect(670, 50, 4, 10, palette.bg) + rect(652, 33, 14, 8, "#438389") +
  rect(656, 44, 6, 15, "#438389") + rect(648, 25, 5, 3, palette.gold) +
  rect(665, 25, 5, 3, palette.gold);

await save("road", 840, 88, "The road goes on. Always building. A Spy Hunter inspired white car on a neon highway.",
  frame(840, 88) + rect(560, 6, 188, 76, "#262d3d") +
  rect(572, 6, 4, 76, palette.pink) + rect(734, 6, 4, 76, palette.mint) +
  [10, 40, 70].map(y => rect(614, y, 3, 16, palette.muted) + rect(696, y, 3, 16, palette.muted)).join("") +
  sprite("heart", 24, 25, 3) + text("THE ROAD GOES ON", 62, 26, 2, palette.gold) +
  text("ALWAYS BUILDING. ALWAYS ANOTHER QUEST.", 62, 51, 1.5, palette.muted) + car,
);

console.log("wrote 8 pixel art assets");
