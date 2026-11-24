import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const beklenen = [
  ['assets/img/oznur-480.webp', 480, 600],
  ['assets/img/oznur-960.webp', 960, 1200],
  ['assets/img/oznur-960.jpg', 960, 1200],
  ['assets/img/oznur-1440.webp', 1440, 1800],
];

for (const [dosya, w, h] of beklenen) {
  test(`foto çıktısı 4:5 ve doğru boyutta: ${dosya}`, async () => {
    const m = await sharp(dosya).metadata();
    assert.equal(m.width, w);
    assert.equal(m.height, h);
    assert.equal(m.exif, undefined, 'EXIF verisi silinmiş olmalı');
  });
}
