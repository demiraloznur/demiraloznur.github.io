// Inter (değişken, @fontsource-variable/inter) → assets/fonts/
// Yalnızca latin ve latin-ext alt kümeleri: Türkçe karakterlerin tamamını kapsar.
import { copyFile, mkdir } from 'node:fs/promises';

const KAYNAK = 'node_modules/@fontsource-variable/inter';
const HEDEF = 'assets/fonts';

await mkdir(HEDEF, { recursive: true });
await Promise.all([
  copyFile(`${KAYNAK}/files/inter-latin-wght-normal.woff2`, `${HEDEF}/inter-latin-wght-normal.woff2`),
  copyFile(`${KAYNAK}/files/inter-latin-ext-wght-normal.woff2`, `${HEDEF}/inter-latin-ext-wght-normal.woff2`),
  copyFile(`${KAYNAK}/LICENSE`, `${HEDEF}/OFL.txt`),
]);
console.log('Inter kopyalandı →', HEDEF);
