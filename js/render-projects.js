// Proje kartlarını veriden üretir. Metinler yalnızca textContent ile yazılır.
const YOLDA_ESIGI = 3;

function el(doc, etiket, sinif, metin) {
  const e = doc.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin != null) e.textContent = metin;
  return e;
}

function link(doc, href, metin) {
  const a = el(doc, 'a', 'project-link', metin);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

function kart(doc, p, sira) {
  const art = el(doc, 'article', 'project reveal');

  const ust = el(doc, 'div', 'project-ust');
  ust.append(el(doc, 'span', 'project-no', String(sira).padStart(2, '0')), el(doc, 'span', 'etiket', p.year));

  const govde = el(doc, 'div', 'project-govde');
  govde.append(el(doc, 'h3', 'project-baslik', p.title), el(doc, 'p', 'project-aciklama', p.description));

  art.append(ust, govde);

  if (p.tags?.length) {
    const ul = el(doc, 'ul', 'tags');
    for (const t of p.tags) ul.append(el(doc, 'li', null, t));
    art.append(ul);
  }

  const linkler = [];
  if (p.repo) linkler.push(link(doc, p.repo, 'Kodu gör ↗'));
  if (p.demo) linkler.push(link(doc, p.demo, 'Canlı ↗'));
  if (linkler.length) {
    const alt = el(doc, 'div', 'project-linkler');
    alt.append(...linkler);
    art.append(alt);
  }
  return art;
}

function yoldaKarti(doc) {
  const art = el(doc, 'article', 'project project--soon reveal');
  art.append(
    el(doc, 'span', 'etiket', 'Sırada'),
    el(doc, 'h3', 'project-baslik', 'Yeni projeler yolda'),
    el(doc, 'p', 'project-aciklama', 'Python ve web projeleri üzerinde çalışıyorum; tamamlandıkça burada yer alacaklar.'),
  );
  return art;
}

export function renderProjects(list, container, doc = document) {
  container.replaceChildren();
  list.forEach((p, i) => container.append(kart(doc, p, i + 1)));
  if (list.length < YOLDA_ESIGI) container.append(yoldaKarti(doc));
}
