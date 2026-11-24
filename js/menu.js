// Dar ekranlarda açılıp kapanan bölüm menüsü.
export function initMenu(button, menu, doc = document) {
  const ayarla = (acik) => {
    button.setAttribute('aria-expanded', String(acik));
    button.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
    menu.classList.toggle('acik', acik);
  };
  const acikMi = () => button.getAttribute('aria-expanded') === 'true';

  ayarla(false);

  button.addEventListener('click', () => ayarla(!acikMi()));

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) ayarla(false);
  });

  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !acikMi()) return;
    ayarla(false);
    button.focus();
  });
}
