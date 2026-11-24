import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('css/style.css', 'utf8');

test('sayfa Google Fonts sunucularına bağlanmaz', () => {
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/);
  assert.doesNotMatch(css, /fonts\.(googleapis|gstatic)\.com/);
});

test('Inter, sitenin kendi dosyalarından yüklenir ve dosyalar mevcut', () => {
  const urller = [...css.matchAll(/@font-face\s*{[^}]*?url\(["']?([^"')]+\.woff2)["']?\)/g)].map((m) => m[1]);
  assert.ok(urller.length >= 2, 'latin ve latin-ext için en az iki @font-face beklenir');
  for (const u of urller) {
    assert.ok(existsSync(resolve('css', u)), `yazı tipi dosyası yok: ${u}`);
  }
});

test('Türkçe karakterler (ğ, ş, ı, İ) latin-ext dosyasında kapsanır', () => {
  assert.match(css, /font-family:\s*['"]Inter['"][^}]*latin-ext|latin-ext[^}]*font-family:\s*['"]Inter['"]/s);
  assert.match(css, /U\+0100-02BA|U\+0100-024F/);
});
