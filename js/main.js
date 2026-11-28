import { initThemeToggle } from './theme.js';
import { initMenu } from './menu.js';
import { projects } from './projects.js';
import { renderProjects, projeSayisiMetni } from './render-projects.js';
import { initReveal } from './reveal.js';

const temaDugmesi = document.querySelector('.tema-dugmesi');
if (temaDugmesi) initThemeToggle(temaDugmesi);

const menuDugmesi = document.querySelector('.menu-dugmesi');
const menu = document.getElementById('menu');
if (menuDugmesi && menu) initMenu(menuDugmesi, menu);

const projeListesi = document.getElementById('proje-listesi');
if (projeListesi) renderProjects(projects, projeListesi);

// Üstteki "Projeler" kutusundaki sayı, proje listesiyle her zaman aynı kalsın.
const projeSayisi = document.querySelector('[data-proje-sayisi]');
if (projeSayisi) projeSayisi.textContent = projeSayisiMetni(projects.length);

// Proje kartları da .reveal taşıdığı için çizimden sonra başlatılır.
initReveal(document);
