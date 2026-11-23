import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initReveal } from '../js/reveal.js';

const html = '<div class="reveal" id="a"></div><div class="reveal" id="b"></div><div class="reveal" id="c"></div>';

test('IntersectionObserver yoksa hepsi hemen görünür', () => {
  const { window } = new JSDOM(html);
  initReveal(window.document, undefined);
  const gorunen = window.document.querySelectorAll('.reveal.is-visible');
  assert.equal(gorunen.length, 3);
});

test('yalnızca kesişen öğe görünür olur ve izlemeden çıkar', () => {
  const { window } = new JSDOM(html);
  const doc = window.document;
  let geriCagri;
  const izlenen = [];
  const cikarilan = [];
  class SahteIO {
    constructor(cb) { geriCagri = cb; }
    observe(e) { izlenen.push(e); }
    unobserve(e) { cikarilan.push(e); }
  }

  initReveal(doc, SahteIO);
  assert.equal(izlenen.length, 3);

  const [a, b] = izlenen;
  geriCagri([{ target: a, isIntersecting: true }, { target: b, isIntersecting: false }]);

  assert.ok(a.classList.contains('is-visible'));
  assert.ok(!b.classList.contains('is-visible'));
  assert.deepEqual(cikarilan, [a]);
});
