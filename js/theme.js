// Açık/koyu tema: ilk değer, kaydetme ve animasyonlu geçiş.
const ANAHTAR = 'tema';
const GECERLI = ['light', 'dark'];

/** Kayıtlı temayı okur; depolama yoksa, hata fırlatırsa ya da değer geçersizse null. */
export function readStoredTheme(storage) {
  try {
    const deger = storage?.getItem(ANAHTAR) ?? null;
    return GECERLI.includes(deger) ? deger : null;
  } catch {
    return null;
  }
}

/** Kayıtlı seçim varsa o, yoksa cihazın tercihi. */
export function getInitialTheme(stored, prefersDark) {
  if (GECERLI.includes(stored)) return stored;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme, root = document.documentElement) {
  root.dataset.theme = theme;
}

function kaydet(theme) {
  try {
    localStorage.setItem(ANAHTAR, theme);
  } catch {
    // Gizli modda kaydedilemezse tema yine de bu oturumda çalışır.
  }
}

function dugmeyiGuncelle(button, theme) {
  const koyu = theme === 'dark';
  button.setAttribute('aria-pressed', String(koyu));
  button.setAttribute('aria-label', koyu ? 'Açık temaya geç' : 'Koyu temaya geç');
}

export function initThemeToggle(button) {
  const root = document.documentElement;
  dugmeyiGuncelle(button, root.dataset.theme);

  button.addEventListener('click', () => {
    const yeni = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const degistir = () => {
      applyTheme(yeni, root);
      dugmeyiGuncelle(button, yeni);
    };
    kaydet(yeni);

    const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || azHareket) {
      degistir();
      return;
    }

    const r = button.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const yaricap = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const gecis = document.startViewTransition(degistir);
    gecis.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${yaricap}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(.6,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  });
}
