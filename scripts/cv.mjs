// cv/cv.html → assets/oznur-demiral-cv.pdf (Microsoft Edge, başsız mod).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ADAYLAR = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const edge = ADAYLAR.find(existsSync);
if (!edge) {
  console.error('Microsoft Edge bulunamadı.');
  process.exit(1);
}

const kaynak = pathToFileURL(resolve('cv/cv.html')).href;
const hedef = resolve('assets/oznur-demiral-cv.pdf');

execFileSync(edge, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${hedef}`,
  kaynak,
], { stdio: 'inherit' });

console.log('CV üretildi →', hedef);
