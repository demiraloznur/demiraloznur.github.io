# demiraloznur.github.io

Öznur Demiral'ın kişisel portfolyo sitesi — saf HTML, CSS ve JavaScript; derleme adımı yok.

Canlı: https://demiraloznur.github.io

## Geliştirme

```bash
npm install      # yalnızca geliştirme araçları
npm run dev      # http://localhost:5173 adresinde önizleme
npm test         # testler (node --test)
npm run lint     # HTML denetimi
```

## Yeni proje eklemek

`js/projects.js` dosyasındaki diziye bir kayıt ekle:

```js
{
  title: 'Proje adı',
  description: 'Bir iki cümlelik açıklama.',
  tags: ['Python', 'SQLite'],          // isteğe bağlı
  repo: 'https://github.com/demiraloznur/proje', // isteğe bağlı
  demo: 'https://...',                 // isteğe bağlı
  year: '2026',
}
```

## Fotoğraf ve CV

- `npm run foto` — `kaynaklar/foto-cevrilmis.png` dosyasından (fotoğraf iPhone HEIC ise önce Windows ile PNG'ye çevrilir) web görsellerini üretir (`assets/img/`). Orijinal fotoğraf repoya girmez.
- `npm run cv` — `cv/cv.html` dosyasını Microsoft Edge ile `assets/oznur-demiral-cv.pdf` olarak yazdırır.

Tasarım kararları: [`docs/tasarim.md`](docs/tasarim.md) · Uygulama planı: [`docs/plan.md`](docs/plan.md)
