import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const PUBLIC_IMG = join(ROOT, 'public', 'images');
const RAW_DATA   = join(ROOT, 'src', 'data', 'raw');

const CONVERTIBLE = new Set(['.png', '.jpg', '.jpeg']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(full));
    } else if (CONVERTIBLE.has(extname(e.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function convert(srcPath) {
  const webpPath = srcPath.replace(/\.(png|jpe?g)$/i, '.webp');

  try {
    const [srcStat, webpStat] = await Promise.all([stat(srcPath), stat(webpPath)]);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) return null;
  } catch { /* webp 없음 → 변환 진행 */ }

  const before = (await stat(srcPath)).size;
  await sharp(srcPath).webp({ quality: 85, effort: 4 }).toFile(webpPath);
  const after = (await stat(webpPath)).size;

  return {
    saved: ((before - after) / before * 100).toFixed(1),
    before,
    after,
  };
}

function updateJsonRefs() {
  const files = readdirSync(RAW_DATA).filter(f => f.endsWith('.json'));
  let total = 0;

  for (const file of files) {
    const filePath = join(RAW_DATA, file);
    const src  = readFileSync(filePath, 'utf-8');
    const next = src.replace(/"(images\/[^"]+)\.(png|jpe?g)"/gi, '"$1.webp"');

    if (next !== src) {
      writeFileSync(filePath, next, 'utf-8');
      const n = (src.match(/"images\/[^"]+\.(png|jpe?g)"/gi) ?? []).length;
      console.log(`  refs updated: ${file} (${n}건)`);
      total += n;
    }
  }
  return total;
}

async function main() {
  console.log('\n이미지 WebP 변환 시작...\n');

  const files = await walk(PUBLIC_IMG);
  let converted = 0, skipped = 0, savedBytes = 0;

  for (const file of files) {
    const result = await convert(file);
    const rel = file.replace(ROOT + '/', '');

    if (result) {
      const kb = n => (n / 1024).toFixed(1) + 'KB';
      console.log(`✓ ${rel}  ${kb(result.before)} → ${kb(result.after)} (-${result.saved}%)`);
      savedBytes += result.before - result.after;
      converted++;
    } else {
      skipped++;
    }
  }

  console.log(`\n변환: ${converted}개 / 스킵: ${skipped}개`);

  if (converted > 0) {
    console.log(`총 절약: ${(savedBytes / 1024).toFixed(1)}KB\n`);
    console.log('JSON refs 업데이트...');
    const refs = updateJsonRefs();
    if (refs > 0) console.log(`  ${refs}건 업데이트 완료`);
  }

  console.log('\n완료\n');
}

main().catch(err => { console.error(err); process.exit(1); });
