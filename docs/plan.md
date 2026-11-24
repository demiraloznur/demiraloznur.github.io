# Portfolyo sitesi — uygulama planı


**Goal:** `demiraloznur.github.io` adresinde yayınlanacak, bento düzenli, Espresso paletli, tek sayfalık portfolyo.

**Architecture:** Derleme adımı olmayan statik site: `index.html` + `css/style.css` + ES modülleri (`js/*.js`). Mantık içeren küçük modüller (tema, proje kartları, belirme animasyonu) saf fonksiyonlar olarak yazılır ve Node'un yerleşik test koşucusu + jsdom ile test edilir. Node yalnızca geliştirme araçları için (önizleme, test, HTML denetimi, fotoğraf ve CV üretimi).

**Tech Stack:** HTML5, CSS (custom properties, grid, `color-mix`, View Transitions), vanilla JS (ES modules), Node 26 (`node --test`), devDependencies: `jsdom`, `html-validate`, `sharp`, `serve`.

**Spec:** `docs/tasarim.md`

## Global Constraints

- Palet: açık `--bg:#EFE8DF --ink:#2B211C --ac:#A0806A`; koyu `--bg:#1E1815 --ink:#EFE8DF --ac:#C4A48C`. Kutu yüzeyi `color-mix(in srgb, var(--ink) 7%, var(--bg))`. Başka renk yok.
- Yazı tipi yalnızca Inter (sitenin kendi dosyalarından, değişken yazı tipi). İtalik, serif, harf animasyonu yok.
- `<html lang="tr">`. Tüm metinler Türkçe.
- Telefon numarası hiçbir commit edilen dosyada yer almaz. `OznurDemiralCV.pdf`, `kaynaklar/` ve video dosyaları commit edilmez.
- `prefers-reduced-motion: reduce` → tüm animasyon/geçişler kapalı.
- JS kapalıyken tüm içerik görünür olmalı.
- Satır sonları LF (`.gitattributes`).

## Review Focus

1. **360px genişlikte telefon** — bento yatay taşma yapmamalı (`scrollWidth <= clientWidth`). → Task 4 doğrulaması.
2. **JS kapalı veya IntersectionObserver yok** — bölümler gizli kalmamalı. → Task 6 testi `initReveal` fallback.
3. **localStorage erişilemez (gizli mod, hata fırlatır)** — tema yine çalışmalı. → Task 3 testi `readStoredTheme`.
4. **Telefon numarası sızıntısı** — repo dosyalarında herhangi bir Türk cep telefonu deseni olmamalı. → Task 7 testi.
5. **Eksik alanlı proje kaydı** (link yok, etiket yok, uzun açıklama) — kart bozulmamalı, olmayan link gösterilmemeli. → Task 5 testi.

---

### Task 1: Geliştirme ortamı

**Files:**
- Create: `package.json`, `.gitattributes`, `README.md`, `test/smoke.test.mjs`

**Interfaces:**
- Produces: npm scripts `dev` (`serve . -l 5173`), `test` (`node --test test/`), `lint` (`html-validate index.html cv/cv.html`), `foto` (`node scripts/foto.mjs`), `cv` (`node scripts/cv.mjs`).

- [ ] **Step 1:** `package.json` (`"type": "module"`, `"private": true`) ve scriptleri yaz; `npm i -D jsdom html-validate sharp serve`.
- [ ] **Step 2:** `.gitattributes`: `* text=auto eol=lf`, `*.jpg *.webp *.pdf binary`.
- [ ] **Step 3:** `test/smoke.test.mjs`: `test('ortam', () => assert.ok(true))`. Run `npm test` → 1 pass.
- [ ] **Step 4:** `README.md`: ne olduğu, `npm run dev`, proje ekleme (Task 5'e atıf), CV yeniden üretme.
- [ ] **Step 5:** Commit `Geliştirme ortamı: package.json, test koşucusu`.

### Task 2: Fotoğraf

**Files:**
- Create: `scripts/foto.mjs`, `test/foto.test.mjs`
- Output (commit edilir): `assets/img/oznur-480.webp`, `assets/img/oznur-960.webp`, `assets/img/oznur-960.jpg`
- Input (commit edilmez): `kaynaklar/foto.jpg`

**Interfaces:**
- Produces: dikey 4:5 kırpılmış görseller; `index.html` `<picture>` ile kullanır.

- [ ] **Step 1: Test** — `foto çıktıları 4:5 ve doğru genişlikte`: `sharp(file).metadata()` → 480×600 ve 960×1200.
- [ ] **Step 2:** Run `npm test` → FAIL (dosya yok).
- [ ] **Step 3:** `scripts/foto.mjs`: kaynak 1500×2000; yüz/omuzlar ortalanacak şekilde `extract({left:0, top:350, width:1500, height:1875})` sonra yeniden boyutlandır; webp q=80, jpg q=82; EXIF/metadata silinir (sharp varsayılanı).
- [ ] **Step 4:** `npm run foto && npm test` → PASS. Görseli açıp kırpmanın yüzü kesmediğini gözle kontrol et.
- [ ] **Step 5:** Commit `Profil fotoğrafı (web için kırpılmış)`.

### Task 3: Sayfa iskeleti, tasarım değişkenleri ve tema

**Files:**
- Create: `index.html`, `css/style.css`, `js/theme.js`, `js/main.js`, `test/theme.test.mjs`

**Interfaces:**
- Produces (`js/theme.js`):
  - `readStoredTheme(storage: Storage|null): 'light'|'dark'|null` — hata fırlatırsa `null`.
  - `getInitialTheme(stored: string|null, prefersDark: boolean): 'light'|'dark'`
  - `applyTheme(theme, root = document.documentElement): void` — `root.dataset.theme = theme`.
  - `initThemeToggle(button: HTMLButtonElement): void` — tıklayınca tema değişir, `localStorage`'a yazar (try/catch), `aria-pressed` ve etiket güncellenir; `document.startViewTransition` varsa ve hareket azaltılmamışsa düğmenin konumundan büyüyen daire (`clip-path: circle()` 700ms).
- Produces (`index.html`): bölüm id'leri `ust`, `hakkimda`, `yolculuk`, `beceriler`, `projeler`, `iletisim`; `<html class="no-js">`, head'deki satır içi küçük betik `no-js`→`js` yapar ve temayı boyamadan önce uygular (yanıp sönme olmaz).

- [ ] **Step 1: Test** —
  - `getInitialTheme(null, true) === 'dark'`, `getInitialTheme(null, false) === 'light'`, `getInitialTheme('light', true) === 'light'`, `getInitialTheme('mor', true) === 'dark'`.
  - `readStoredTheme({ getItem(){ throw new Error() } }) === null`; `readStoredTheme(null) === null`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** `js/theme.js`'i yaz; `css/style.css`'e Global Constraints'teki değişkenleri `:root` ve `[data-theme="dark"]` altında tanımla; tipografi ölçeği (başlık `clamp(2.6rem, 7vw, 5.5rem)`/800/`letter-spacing:-.03em`, etiket 12px/500); üst menü (ad + bölüm linkleri + tema düğmesi).
- [ ] **Step 4:** Run `npm test` → PASS; `npm run lint` → hata yok.
- [ ] **Step 5:** Commit `Sayfa iskeleti ve açık/koyu tema`.

### Task 4: Açılış bento ızgarası

**Files:**
- Modify: `index.html` (`#ust`), `css/style.css`

**Interfaces:**
- Consumes: Task 2 görselleri, Task 3 değişkenleri.

Kutular (masaüstü 4 sütun, ≤900px 2 sütun, ≤560px 1 sütun):
büyük başlık "Meraklı. Gelişime açık." + "Junior yazılım geliştirici" (2×2) · fotoğraf (2×3, vurgu zemin, `object-fit: cover`, `object-position: 50% 20%`, arkada iki yavaş süzülen daire 8s) · Konum: Bursa · Durum: ● İş arıyorum (koyu kutu) · Şu an öğreniyorum: Python Mid-Level, devam ediyor (2×1, ilerleme çubuğu) · Staj: Cesur Ambalaj, Bilgi işlem · 2025 · Projeler → `#projeler` (2×1, koyu kutu).

- [ ] **Step 1:** HTML + CSS yaz. Hover: `translateY(-4px) scale(1.015)`, 350ms `cubic-bezier(.2,.8,.2,1)`. Fotoğrafın `alt`'ı: "Öznur Demiral'ın portresi".
- [ ] **Step 2:** `npm run dev`, tarayıcıda 1280, 768 ve 360 genişlikte ekran görüntüsü al; her genişlikte `document.documentElement.scrollWidth <= clientWidth` → `true`.
- [ ] **Step 3:** `npm run lint` → hata yok. Commit `Açılış bento ızgarası`.

### Task 5: Projeler bölümü (veriden üretilen kartlar)

**Files:**
- Create: `js/projects.js`, `js/render-projects.js`, `test/projects.test.mjs`
- Modify: `index.html` (`#projeler`), `js/main.js`, `css/style.css`

**Interfaces:**
- Produces:
  - `js/projects.js`: `export const projects: Array<{ title: string, description: string, tags?: string[], repo?: string, demo?: string, year: string }>` — ilk kayıt: `{ title: 'Kişisel portfolyo', description: 'Bu site: saf HTML, CSS ve JavaScript ile bento düzen, açık/koyu tema ve erişilebilir animasyonlar.', tags: ['HTML','CSS','JavaScript'], repo: 'https://github.com/demiraloznur/demiraloznur.github.io', year: '2026' }`.
  - `js/render-projects.js`: `renderProjects(list, container: HTMLElement, doc = document): void` — her proje için `<article class="project">`; numara `01`, `02`…; yalnızca var olan linkler `target="_blank" rel="noopener"` ile; `list.length < 3` ise sona `.project--soon` "Yeni projeler yolda" kartı.

- [ ] **Step 1: Test** (jsdom) —
  - 1 projeyle: 2 `article` (biri `.project--soon`), ilk kartta `01` ve başlık.
  - `repo`/`demo`/`tags` olmayan kayıtta `a` ve `.tags` yok.
  - 3 projeyle `.project--soon` yok.
  - Başlıktaki `<script>` metin olarak görünür (`textContent` kullanımı; innerHTML yok).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Uygula; `main.js` `#proje-listesi`'ne render eder. JS kapalıyken `<noscript>` içinde GitHub profili linki.
- [ ] **Step 4:** Run `npm test` → PASS. Commit `Projeler bölümü`.

### Task 6: Hakkımda, Yolculuk, Beceriler ve kaydırınca belirme

**Files:**
- Create: `js/reveal.js`, `test/reveal.test.mjs`
- Modify: `index.html`, `css/style.css`, `js/main.js`

**Interfaces:**
- Produces: `initReveal(root: ParentNode, IO = globalThis.IntersectionObserver): void` — `.reveal` öğelerine görününce `is-visible` ekler; `IO` yoksa hepsine hemen ekler. CSS: yalnızca `.js .reveal:not(.is-visible)` gizli (opacity 0, translateY 24px), 700ms geçiş.

İçerik (`docs/tasarim.md` → Bölümler): Hakkımda — CV özetinin samimi anlatımı (2 kısa paragraf). Yolculuk — tasarım dokümanındaki sırayla 9 durak; "Hedef" durağı farklı (kesikli kenarlı) görünür. Beceriler — 5 kart: Web; Programlama; Veri tabanı; IT ve Ağ; Araçlar; düzeyler CV'deki gibi dürüst.

- [ ] **Step 1: Test** — `IO` undefined iken 3 `.reveal` öğesinin hepsi `is-visible` alır; sahte bir `IO` ile yalnızca `isIntersecting` olan alır ve `unobserve` çağrılır.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Uygula; içerikleri yaz.
- [ ] **Step 4:** Run `npm test` + `npm run lint` → PASS. Tarayıcıda: hareket azaltma emülasyonunda içerik anında görünür. Commit `Hakkımda, Yolculuk, Beceriler`.

### Task 7: İletişim, telefonsuz CV ve yayın hazırlığı

**Files:**
- Create: `cv/cv.html`, `scripts/cv.mjs`, `assets/oznur-demiral-cv.pdf`, `assets/favicon.svg`, `test/gizlilik.test.mjs`
- Modify: `index.html` (`#iletisim`, `<head>` meta/OG)

**Interfaces:**
- Produces: `npm run cv` → Edge'i (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) `--headless --print-to-pdf=assets/oznur-demiral-cv.pdf --no-pdf-header-footer` ile `cv/cv.html` üzerinde çalıştırır.

- [ ] **Step 1: Test** `gizlilik` — `git ls-files` listesindeki metin dosyalarında genel cep telefonu deseni (`(+90|0)? 5xx xxx xx xx`) yok; `OznurDemiralCV.pdf` ve `kaynaklar/` listede yok.
- [ ] **Step 2:** `cv/cv.html`: orijinal CV içeriği, telefon hariç, A4 baskı stili, Espresso değil yazdırma dostu siyah/gri. `npm run cv`; PDF'i açıp kontrol et.
- [ ] **Step 3:** İletişim: büyük başlık "Birlikte çalışalım", e-posta (`mailto:`), GitHub, LinkedIn (`https://www.linkedin.com/in/%C3%B6znur-demiral-27ba5334b`), "CV'yi indir" (`download`). Meta description, OG başlık/açıklama/görsel (`oznur-960.jpg`), "ÖD" SVG favicon.
- [ ] **Step 4:** `npm test` + `npm run lint` → PASS. Commit `İletişim, CV ve meta etiketleri`.

### Task 8: Son kontrol ve yayın

- [ ] **Step 1:** Tarayıcıda baştan sona gez (açık/koyu, 1280/768/360, klavye ile Tab gezinmesi, odak halkaları görünür).
- [ ] **Step 2:** Öznur'a ekran görüntüleri ve metinleri göster, düzeltmeleri al.
- [ ] **Step 3:** **Öznur'a sorduktan sonra:** GitHub'da `demiraloznur.github.io` deposunu oluştur, `origin` ekle, `main`'i push et, Pages'in `main` / kök klasörden yayınladığını doğrula.
