// Kaydırınca belirme: .reveal öğeleri görünür alana girince .is-visible alır.
// IntersectionObserver yoksa hepsi hemen görünür (içerik asla gizli kalmaz).
export function initReveal(root, IO = globalThis.IntersectionObserver) {
  const ogeler = [...root.querySelectorAll('.reveal')];

  if (typeof IO !== 'function') {
    ogeler.forEach((e) => e.classList.add('is-visible'));
    return;
  }

  const gozcu = new IO(
    (girdiler) => {
      for (const g of girdiler) {
        if (!g.isIntersecting) continue;
        g.target.classList.add('is-visible');
        gozcu.unobserve(g.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  ogeler.forEach((e) => gozcu.observe(e));
}
