import { mkdirSync, writeFileSync } from "node:fs";

// Each subject gets its own colors and a big symbol
const subjects = {
  Math: ["#4f46e5", "#7c3aed", "∑"],
  Physics: ["#0284c7", "#4f46e5", "Φ"],
  Chemistry: ["#059669", "#0d9488", "H2O"],
  Biology: ["#16a34a", "#65a30d", "DNA"],
  Programming: ["#1e293b", "#4f46e5", "</>"],
  IELTS: ["#e11d48", "#9333ea", "A+"],
  English: ["#ea580c", "#db2777", "Aa"],
  Accounting: ["#0f766e", "#2563eb", "%"],
};

function banner(name, [from, to, symbol]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <circle cx="690" cy="70" r="170" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="90" cy="400" r="150" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="400" cy="225" r="120" fill="#ffffff" fill-opacity="0.06"/>
  <text x="400" y="265" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="700" fill="#ffffff" fill-opacity="0.9">${symbol.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
  <text x="40" y="410" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#ffffff" fill-opacity="0.85" letter-spacing="2">${name.toUpperCase()}</text>
</svg>
`;
}

mkdirSync("public/banners", { recursive: true });

for (const [name, config] of Object.entries(subjects)) {
  writeFileSync(`public/banners/${name.toLowerCase()}.svg`, banner(name, config));
  console.log(`Created public/banners/${name.toLowerCase()}.svg`);
}