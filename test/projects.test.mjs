import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { renderProjects, projeSayisiMetni } from '../js/render-projects.js';
import { projects } from '../js/projects.js';

function kur(list) {
  const { window } = new JSDOM('<div id="liste"></div>');
  const kap = window.document.getElementById('liste');
  renderProjects(list, kap, window.document);
  return kap;
}

const tam = {
  title: 'Kişisel portfolyo',
  description: 'Bu site.',
  tags: ['HTML', 'CSS'],
  repo: 'https://github.com/demiraloznur/demiraloznur.github.io',
  year: '2026',
};

test('tek proje: kart + "yolda" kartı, numara 01', () => {
  const kap = kur([tam]);
  const kartlar = kap.querySelectorAll('article');
  assert.equal(kartlar.length, 2);
  assert.ok(kartlar[1].classList.contains('project--soon'));
  assert.match(kartlar[0].textContent, /01/);
  assert.match(kartlar[0].textContent, /Kişisel portfolyo/);
  const a = kartlar[0].querySelector('a');
  assert.equal(a.getAttribute('href'), tam.repo);
  assert.equal(a.getAttribute('rel'), 'noopener');
  assert.equal(a.getAttribute('target'), '_blank');
});

test('eksik alanlı kayıt: link ve etiket listesi yok', () => {
  const kap = kur([{ title: 'Taslak', description: 'Açıklama', year: '2026' }]);
  const kart = kap.querySelector('article');
  assert.equal(kart.querySelector('a'), null);
  assert.equal(kart.querySelector('.tags'), null);
});

test('üç proje varsa "yolda" kartı yok', () => {
  const kap = kur([tam, tam, tam]);
  assert.equal(kap.querySelectorAll('article').length, 3);
  assert.equal(kap.querySelector('.project--soon'), null);
});

test('başlık HTML olarak yorumlanmaz', () => {
  const kap = kur([{ ...tam, title: '<script>alert(1)</script>' }]);
  assert.equal(kap.querySelector('script'), null);
  assert.match(kap.textContent, /<script>alert\(1\)<\/script>/);
});

test('yeniden çizim önceki kartları temizler', () => {
  const { window } = new JSDOM('<div id="liste"><p>eski</p></div>');
  const kap = window.document.getElementById('liste');
  renderProjects([tam], kap, window.document);
  renderProjects([tam], kap, window.document);
  assert.equal(kap.querySelectorAll('article').length, 2);
  assert.equal(kap.querySelector('p.eski'), null);
});

test('proje sayacı iki haneli yazılır', () => {
  assert.equal(projeSayisiMetni(3), '03 proje');
  assert.equal(projeSayisiMetni(12), '12 proje');
});

test('projects.js: en yeni proje başta, bu site listede', () => {
  assert.equal(projects[0].repo, 'https://github.com/demiraloznur/shadow-and-bones-gym');
  assert.ok(projects.some((p) => p.repo === 'https://github.com/demiraloznur/demiraloznur.github.io'));
});
