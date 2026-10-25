// Yayın öncesi hızlı doğrulama. Bağımlılık yok: `node scripts/check.mjs`
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => readFileSync(join(root, f), 'utf8');
let fails = 0, warns = 0;
const ok = m => console.log('  ✓ ' + m);
const fail = m => { fails++; console.log('  ✗ ' + m); };
const warn = m => { warns++; console.log('  ! ' + m); };

const html = read('index.html'), css = read('style.css'), fonts = read('fonts/fonts.css');

console.log('Yerel dosya bağlantıları');
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) refs.add(m[1]);
for (const m of css.matchAll(/url\("?([^")]+)"?\)/g)) refs.add(m[1]);
for (const m of fonts.matchAll(/url\(([^)]+)\)/g)) refs.add('fonts/' + m[1]);
let missing = 0;
for (const r of refs) {
  if (/^(https?:|mailto:|data:)/.test(r)) continue;
  if (!existsSync(join(root, r.split('?')[0]))) { fail('eksik dosya: ' + r); missing++; }
}
if (!missing) ok(`${refs.size} bağlantının hepsi mevcut`);

console.log('Dış bağımlılıklar');
const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map(m => m[1])
  .filter(u => !u.includes('yusuftunga1.github.io'));
external.length ? fail('dış kaynak var: ' + external.join(', ')) : ok('sayfa tüm betik, yazı tipi ve görselleri kendi sunucusundan yüklüyor');

console.log('Güvenlik');
const sri = html.match(/src="vendor\/three\.min\.js" integrity="([^"]+)"/);
if (!sri) fail('three.js için SRI yok');
else {
  const [algo, b64] = [sri[1].slice(0, 6), sri[1].slice(7)];
  const got = createHash(algo).update(readFileSync(join(root, 'vendor/three.min.js'))).digest('base64');
  got === b64 ? ok('three.js SRI özeti dosyayla eşleşiyor') : fail('three.js SRI özeti dosyayla eşleşmiyor');
}
const csp = html.match(/Content-Security-Policy" content="([^"]+)"/);
if (!csp) fail('CSP yok');
else {
  /script-src 'self'/.test(csp[1]) && !/https:\/\//.test(csp[1]) ? ok('CSP yalnızca kendi kaynağına izin veriyor') : fail('CSP dış adrese izin veriyor');
  const inline = html.match(/<script>([^<]*)<\/script>/);
  if (inline) {
    const h = 'sha256-' + createHash('sha256').update(inline[1]).digest('base64');
    csp[1].includes(h) ? ok('satır içi betiğin CSP özeti doğru') : fail('satır içi betiğin CSP özeti uyuşmuyor');
  }
}
/name="referrer" content="no-referrer"/.test(html) ? ok('referrer ilkesi: no-referrer') : fail('referrer ilkesi yok');

console.log('JavaScript');
try { execFileSync(process.execPath, ['--check', join(root, 'app.js')]); ok('app.js söz dizimi geçerli'); }
catch (e) { fail('app.js söz dizimi hatalı:\n' + e.stderr); }

console.log('Sayfa içeriği');
/<html lang="tr"/.test(html) ? ok('lang="tr"') : fail('lang eksik');
/<h1[ >]/.test(html) ? ok('h1 var') : fail('h1 yok');
/class="skip"/.test(html) ? ok('içeriğe atla bağlantısı var') : fail('içeriğe atla yok');
for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/ alt="[^"]+"/.test(m[0])) fail('alt eksik: ' + m[0].slice(0, 60));
for (const f of ['robots.txt', 'sitemap.xml', '404.html', 'LICENSE', 'README.md', 'assets/og.jpg']) existsSync(join(root, f)) ? ok(f + ' mevcut') : fail(f + ' eksik');

console.log('Yayın öncesi uyarılar');
if (/@modulo\.example/.test(html + read('app.js'))) warn('yer tutucu e-posta adresleri hâlâ kullanılıyor (@modulo.example)');
if (/Siparişi tamamla/.test(html) && /mailto:/.test(read('app.js'))) warn('ödeme yok: "Siparişi tamamla" yalnızca e-posta taslağı açıyor');
if (!/iade|garanti/i.test(html)) warn('iade ve garanti koşulları sitede yer almıyor (kargo satırı sepette "sipariş sırasında" diyor)');

console.log(`\n${fails ? '✗' : '✓'} ${fails} hata, ${warns} uyarı`);
process.exit(fails ? 1 : 0);
