// Generates the PWA icons (public/icon-192.png, icon-512.png, icon-maskable-512.png) without image libraries.
// Run: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, pixel) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x + 0.5, y + 0.5, size);
      const i = y * (size * 4 + 1) + 1 + x * 4;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// Distance from point to segment, for drawing the stroked "steps" mark.
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
// The brand mark path (from favicon.svg, 16-unit grid): M2.5 12.5 h3.5 V9 h3.5 V5.5 h4
const PATH = [[2.5, 12.5], [6, 12.5], [6, 9], [9.5, 9], [9.5, 5.5], [13.5, 5.5]];

function icon({ maskable }) {
  return (x, y, size) => {
    const bg = [26, 26, 25];
    const fg = [250, 250, 249];
    // Rounded square (full bleed for maskable icons, whose safe zone is the inner 80%).
    const r = maskable ? 0 : size * 0.22;
    const inset = 0;
    const cx = Math.min(Math.max(x, inset + r), size - inset - r);
    const cy = Math.min(Math.max(y, inset + r), size - inset - r);
    const inside = Math.hypot(x - cx, y - cy) <= r + 0.5 || r === 0;
    if (!inside) return [0, 0, 0, 0];
    const scale = maskable ? 0.58 : 0.72;
    const off = (size - size * scale) / 2;
    const u = ((x - off) / (size * scale)) * 16;
    const v = ((y - off) / (size * scale)) * 16;
    let d = Infinity;
    for (let i = 0; i < PATH.length - 1; i++) d = Math.min(d, segDist(u, v, ...PATH[i], ...PATH[i + 1]));
    const w = 1.9 / 2;
    const px = 16 / (size * scale); // one pixel in path units, for anti-aliasing
    const t = Math.max(0, Math.min(1, (w - d) / px + 0.5));
    return [0, 1, 2].map((k) => Math.round(bg[k] + (fg[k] - bg[k]) * t)).concat(255);
  };
}

writeFileSync(join(out, 'icon-192.png'), png(192, icon({ maskable: false })));
writeFileSync(join(out, 'icon-512.png'), png(512, icon({ maskable: false })));
writeFileSync(join(out, 'icon-maskable-512.png'), png(512, icon({ maskable: true })));
writeFileSync(join(out, 'apple-touch-icon.png'), png(180, icon({ maskable: true })));
console.log('icons written to', out);
