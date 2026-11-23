import { initThemeToggle } from './theme.js';
import { projects } from './projects.js';
import { renderProjects } from './render-projects.js';

const temaDugmesi = document.querySelector('.tema-dugmesi');
if (temaDugmesi) initThemeToggle(temaDugmesi);

const projeListesi = document.getElementById('proje-listesi');
if (projeListesi) renderProjects(projects, projeListesi);
