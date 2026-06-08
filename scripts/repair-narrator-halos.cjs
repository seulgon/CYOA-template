const fs = require('fs');
const sharp = require('sharp');

const WIDTH = 832;
const HEIGHT = 1216;

const jobs = [
  {
    clear: 'public/assets/images/narrators/ai_avatar/ai_avatar_clear.png',
    type: 'ai',
    cx: 410,
    cy: 102,
    rx: 260,
    ry: 48,
  },
  {
    clear: 'public/assets/images/narrators/ai_avatar/ai_avatar_standing_clear.png',
    type: 'ai',
    cx: 416,
    cy: 84,
    rx: 112,
    ry: 29,
  },
  {
    clear: 'public/assets/images/narrators/angel/angel_clear.png',
    type: 'angel',
    cx: 416,
    cy: 198,
    r: 138,
  },
  {
    clear: 'public/assets/images/narrators/angel/angel_standing_clear.png',
    type: 'angel',
    cx: 416,
    cy: 158,
    r: 132,
  },
];

function aiHalo({ cx, cy, rx, ry }) {
  return `
    <g opacity="0.95">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#7fffff" stroke-width="10" filter="url(#cyanGlow)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#16dce8" stroke-width="4"/>
      <ellipse cx="${cx}" cy="${cy - 2}" rx="${rx * 0.93}" ry="${ry * 0.72}" fill="none" stroke="#e6ffff" stroke-width="2" opacity="0.78"/>
      <path d="M ${cx - rx * 0.88} ${cy - ry * 0.1} C ${cx - rx * 0.42} ${cy - ry * 1.05}, ${cx + rx * 0.44} ${cy - ry * 1.02}, ${cx + rx * 0.9} ${cy - ry * 0.05}" fill="none" stroke="#c9ffff" stroke-width="2" opacity="0.7"/>
    </g>
  `;
}

function angelHalo({ cx, cy, r }) {
  const rays = [];
  for (let i = 0; i < 36; i += 1) {
    const angle = (Math.PI * 2 * i) / 36;
    const inner = r * (i % 2 === 0 ? 0.86 : 0.95);
    const outer = r * (i % 2 === 0 ? 1.2 : 1.09);
    const x1 = cx + Math.cos(angle) * inner;
    const y1 = cy + Math.sin(angle) * inner;
    const x2 = cx + Math.cos(angle) * outer;
    const y2 = cy + Math.sin(angle) * outer;
    rays.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#e6c86f" stroke-width="${i % 2 === 0 ? 3 : 1.6}" opacity="${i % 2 === 0 ? 0.38 : 0.28}"/>`);
  }

  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.88}" fill="#f5d776" opacity="0.08" filter="url(#goldGlow)"/>
      <g filter="url(#goldGlow)">${rays.join('')}</g>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.76}" fill="none" stroke="#e0b94c" stroke-width="8" opacity="0.45" filter="url(#goldGlow)"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.76}" fill="none" stroke="#fff1b0" stroke-width="2.4" opacity="0.72"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.63}" fill="none" stroke="#b99035" stroke-width="2" opacity="0.36"/>
    </g>
  `;
}

function buildHaloSvg(job) {
  const body = job.type === 'ai' ? aiHalo(job) : angelHalo(job);
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="goldGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      ${body}
    </svg>
  `);
}

async function repair(job) {
  if (!fs.existsSync(job.clear)) return;
  const halo = buildHaloSvg(job);
  const output = await sharp(job.clear)
    .composite([{ input: halo, blend: 'dest-over' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(job.clear, output);
  console.log(`repaired ${job.clear}`);
}

(async () => {
  for (const job of jobs) {
    await repair(job);
  }
})();
