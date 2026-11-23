import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

// Git'e eklenmiş (ya da eklenmek üzere hazırlanmış) dosyalar.
const dosyalar = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const METIN = /\.(html|css|js|mjs|json|md|txt|svg)$/i;
// Numaranın kendisini yazmadan, herhangi bir Türk cep telefonu biçimini yakalar.
const TELEFON = /(?:\+90|\b0)?[\s(-]*5\d{2}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}\b/;

test('hiçbir metin dosyasında telefon numarası yok', () => {
  const sizan = dosyalar
    .filter((f) => METIN.test(f) && existsSync(f))
    .filter((f) => TELEFON.test(readFileSync(f, 'utf8')));
  assert.deepEqual(sizan, []);
});

test('orijinal CV ve kaynaklar klasörü repoda değil', () => {
  assert.ok(!dosyalar.includes('OznurDemiralCV.pdf'));
  assert.ok(!dosyalar.some((f) => f.startsWith('kaynaklar/')));
});

// Not: Edge'in ürettiği PDF'te metin sıkıştırılmış olduğundan PDF taranmaz;
// PDF'in kaynağı cv/cv.html yukarıdaki metin taramasına dahildir.
