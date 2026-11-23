import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getInitialTheme, readStoredTheme } from '../js/theme.js';

test('getInitialTheme: kayıt yoksa cihaz tercihine uyar', () => {
  assert.equal(getInitialTheme(null, true), 'dark');
  assert.equal(getInitialTheme(null, false), 'light');
});

test('getInitialTheme: geçerli kayıt cihaz tercihini ezer', () => {
  assert.equal(getInitialTheme('light', true), 'light');
  assert.equal(getInitialTheme('dark', false), 'dark');
});

test('getInitialTheme: geçersiz kayıt yok sayılır', () => {
  assert.equal(getInitialTheme('mor', true), 'dark');
});

test('readStoredTheme: depolama hata fırlatırsa null', () => {
  assert.equal(readStoredTheme({ getItem() { throw new Error('gizli mod'); } }), null);
});

test('readStoredTheme: depolama yoksa null, varsa değeri', () => {
  assert.equal(readStoredTheme(null), null);
  assert.equal(readStoredTheme({ getItem: () => 'dark' }), 'dark');
  assert.equal(readStoredTheme({ getItem: () => 'mor' }), null);
});
