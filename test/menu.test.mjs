import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initMenu } from '../js/menu.js';

function kur() {
  const { window } = new JSDOM(`
    <button class="menu-dugmesi" aria-expanded="false" aria-controls="menu">Menü</button>
    <ul id="menu" class="menu"><li><a href="#projeler">Projeler</a></li></ul>
  `);
  const doc = window.document;
  const dugme = doc.querySelector('.menu-dugmesi');
  const menu = doc.getElementById('menu');
  initMenu(dugme, menu, doc);
  return { window, doc, dugme, menu };
}

const acikMi = ({ dugme, menu }) =>
  dugme.getAttribute('aria-expanded') === 'true' && menu.classList.contains('acik');

test('düğmeye tıklayınca menü açılır, tekrar tıklayınca kapanır', () => {
  const m = kur();
  m.dugme.click();
  assert.ok(acikMi(m));
  m.dugme.click();
  assert.ok(!acikMi(m));
  assert.equal(m.dugme.getAttribute('aria-expanded'), 'false');
});

test('menüdeki bir bağlantıya tıklayınca menü kapanır', () => {
  const m = kur();
  m.dugme.click();
  m.menu.querySelector('a').click();
  assert.ok(!acikMi(m));
});

test('Escape menüyü kapatır ve odağı düğmeye geri verir', () => {
  const m = kur();
  m.dugme.click();
  m.menu.querySelector('a').focus();
  m.doc.dispatchEvent(new m.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.ok(!acikMi(m));
  assert.equal(m.doc.activeElement, m.dugme);
});

test('menü kapalıyken Escape odağı değiştirmez', () => {
  const m = kur();
  const link = m.menu.querySelector('a');
  link.focus();
  m.doc.dispatchEvent(new m.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(m.doc.activeElement, link);
});
