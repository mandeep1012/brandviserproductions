#!/usr/bin/env node
/**
 * Imports event photographs for the Moments page.
 *
 *   npm run import:moments -w @brandviserproductions/web -- "<folder of camera originals>"
 *
 * Walks the folder, skips byte-identical copies, decodes RAW files with macOS `sips`, then
 * resizes to 2400px on the long edge with sharp (metadata, including GPS, is dropped).
 * Writes public/moments/<hash>.jpg and src/content/moments.json. Re-running is idempotent.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAW = new Set(['.arw', '.cr2', '.cr3', '.nef', '.dng', '.raf', '.orf']);
const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff']);
const LONG_EDGE = 2400;

const webRoot = resolve(fileURLToPath(import.meta.url), '../..');
const outDir = join(webRoot, 'public/moments');
const manifestPath = join(webRoot, 'src/content/moments.json');

const source = process.argv[2];
if (!source || !existsSync(source) || !statSync(source).isDirectory()) {
  console.error('Usage: import-moments.mjs <folder of event photographs>');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.')) return [];
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    const ext = extname(entry.name).toLowerCase();
    return RAW.has(ext) || IMAGE.has(ext) ? [path] : [];
  });
}

const scratch = mkdtempSync(join(tmpdir(), 'moments-'));
mkdirSync(outDir, { recursive: true });
mkdirSync(dirname(manifestPath), { recursive: true });

const seen = new Set();
const moments = [];
let skipped = 0;

try {
  for (const file of walk(source).sort()) {
    const hash = createHash('md5').update(readFileSync(file)).digest('hex').slice(0, 12);
    if (seen.has(hash)) {
      skipped++;
      continue;
    }
    seen.add(hash);

    let input = file;
    if (RAW.has(extname(file).toLowerCase())) {
      input = join(scratch, `${hash}.jpg`);
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '95', file, '--out', input], {
        stdio: 'ignore',
      });
    }

    const name = `${hash}.jpg`;
    const { width, height } = await sharp(input)
      .rotate()
      .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(outDir, name));

    const blur = await sharp(input).rotate().resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer();

    moments.push({
      src: `/moments/${name}`,
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    });
    console.log(`  ${basename(file)} → ${name} (${width}×${height})`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

moments.sort((a, b) => a.src.localeCompare(b.src));
writeFileSync(manifestPath, `${JSON.stringify(moments, null, 2)}\n`);

const bytes = moments.reduce((sum, m) => sum + statSync(join(webRoot, 'public', m.src)).size, 0);
console.log(
  `\n${moments.length} photographs (${skipped} duplicates skipped), ${(bytes / 1024 / 1024).toFixed(1)} MB in public/moments`,
);
