import { initThemeToggle } from './theme.js';
import { initMenu } from './menu.js';
import { projects } from './projects.js';
import { renderProjects } from './render-projects.js';
import { initReveal } from './reveal.js';

const temaDugmesi = document.querySelector('.tema-dugmesi');
if (temaDugmesi) initThemeToggle(temaDugmesi);

const menuDugmesi = document.querySelector('.menu-dugmesi');
const menu = document.getElementById('menu');
if (menuDugmesi && menu) initMenu(menuDugmesi, menu);

const projeListesi = document.getElementById('proje-listesi');
if (projeListesi) renderProjects(projects, projeListesi);

// Proje kartları da .reveal taşıdığı için çizimden sonra başlatılır.
initReveal(document);
