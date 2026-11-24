# Portfolyo sitesi — tasarım dokümanı

Tarih: 24 Kasım 2026 · Yayın adresi: `https://demiraloznur.github.io`

## Amaç ve neden

Öznur Demiral'ı işverenlere tanıtan, ilk işini bulmasına yardım edecek kişisel portfolyo sitesi.
İşveren siteden çıktığında aklında kalması gereken: **ilgili, meraklı, gelişime açık ve istekli** biri;
**sade, minimal ama efektif, ihtiyaca yönelik** düşünen ve tasarım gözü olan biri. Sitenin kendisi
bu iddianın kanıtı olmalı ve GitHub'daki ilk proje olarak da durmalı.

## Hedefler

- Tek sayfalık, hızlı açılan, mobil uyumlu bir site.
- Durağan CV yerine "ilerleyen biri" izlenimi: şu an öğrendikleri ve yolculuğu.
- Proje bölümü yeni projeler eklendikçe büyüyecek; proje eklemek tek bir veri dosyasına birkaç satır yazmak kadar kolay.
- Telefonsuz CV'nin PDF olarak indirilebilmesi.

## Hedef olmayanlar

- Blog, çoklu sayfa, CMS, iletişim formu (GitHub Pages statik; form gerekmiyor).
- Şimdilik İngilizce sürüm (yapı buna uygun kurulur, sonra eklenebilir).

## Kaçınılacaklar (çalışsa bile başarısızlık sayılır)

- Hareketli/süslü yazı tipleri, italik-serif vurgular — yazılar sade ve sabit kalır.
- Her şeyin aynı boyutta olduğu düz bir sayfa — boyut zıtlığı şart.
- Karmaşa hissi veren, yazıyı oynatan animasyonlar.
- Başka bir sitenin kopyası. Referans materyal (video, orijinal CV) **asla commit edilmez**.
- Telefon numarasının sitede veya repoda yer alması.

## Kısıtlar

- GitHub Pages: yalnızca statik dosyalar. Depo adı `demiraloznur.github.io` olmalı.
- Node.js kurulu (v26), ama yayında derleme adımı yok; Node yalnızca geliştirme araçları için.
- Orijinal `OznurDemiralCV.pdf` `.gitignore`'da.

## Yaklaşımlar

| Yol | Artı | Eksi |
|---|---|---|
| **A. Saf HTML + CSS + JS (seçilen)** | Kurulumsuz yayın; Öznur'un bildiği diller; kodun tamamı okunabilir | Çok sayfaya büyürse tekrar eden kod |
| B. Astro / Vite | Bileşenler, Markdown'dan proje sayfaları | Derleme + GitHub Actions; şu an için fazla |
| C. Jekyll | GitHub otomatik derler | Liquid/Ruby öğrenme yükü; ilgi alanına katkısı az |

Öznur A'yı seçti; Node.js de geliştirme ortamı için kuruldu.

## Kararlaştırılanlar

### Görsel yön: bento + tonal toprak rengi

- **Düzen:** Açılış ekranı farklı boyutlarda, yuvarlak köşeli kutulardan oluşan bir bento ızgarası.
- **Palet — Espresso (3 renk):**

| | Arka plan | Mürekkep (yazı) | Vurgu |
|---|---|---|---|
| Açık tema | `#EFE8DF` | `#2B211C` | `#A0806A` |
| Koyu tema | `#1E1815` | `#EFE8DF` | `#C4A48C` |

  Kutu yüzeyleri, mürekkebin arka plana %7 karışımıyla elde edilir (`color-mix`). Yeni renk eklenmez.
- **Yazı tipi:** Inter, tek aile. Hiyerarşi yalnızca boyut ve kalınlıkla kurulur: büyük, sıkı, çok kalın
  başlıklar (800) ↔ küçük, açık etiketler.
- **Görsel:** CV'deki fotoğraf, açılıştaki büyük vurgu renkli kutuda, kırpılmış.
- **Hareket:** Hareket görsellerde ve geçişlerde, yazılarda değil:
  - Kutuların üzerine gelince hafif yükselme.
  - Fotoğraf kutusunda yavaşça süzülen yumuşak daireler.
  - Kaydırdıkça bölümlerin aşağıdan belirmesi.
  - Açık/koyu tema geçişi: düğmenin bulunduğu köşeden büyüyen daire (View Transitions API; desteklemeyen tarayıcıda anlık geçiş).
  - `prefers-reduced-motion` açıksa tüm animasyonlar kapanır.
- **Tema:** İlk açılışta cihazın tercihine uyar; kullanıcı seçimi `localStorage`'da hatırlanır.

### Bölümler (tek sayfa, sırayla)

1. **Açılış (bento):** ad, "Junior yazılım geliştirici", büyük başlık ("Meraklı. Gelişime açık."), fotoğraf,
   konum (Bursa), durum (İş arıyorum), şu an öğrendiği (Python Mid-Level), staj (Cesur Ambalaj), projeler kısayolu.
2. **Hakkımda:** CV özetinin kısa, samimi bir anlatımı.
3. **Yolculuk:** zaman çizelgesi; sertifikalar burada yer alır:
   2024 SUBÜ başlangıç · Ara 2024 BTK HTML5 · Tem 2025 Cisco CCNA ITN · Tem–Ağu 2025 Cesur Ambalaj stajı ·
   Haz 2026 mezuniyet · Ağu 2026 AI Literacy (IBM SkillsBuild, AI Agents Bootcamp kapsamında) · Eki 2026 Python - Software Development Essentials · Kas 2026– Python Mid-Level (devam ediyor).
4. **Beceriler:** gruplu kartlar — Web, Programlama (Python, C#, ASP.NET Core MVC, Java, PHP), Veri tabanı, IT ve Ağ, Araçlar. Düzey etiketleri dürüst ("temel düzey").
5. **Projeler:** `js/projects.js` içindeki diziden üretilir. İlk kart: bu site. Liste kısa olduğunda "Yeni projeler yolda" kartı görünür.
6. **İletişim:** e-posta, GitHub (`github.com/demiraloznur`), LinkedIn, "CV'yi indir" düğmesi. Telefon yok.

### CV dosyası

Telefonsuz CV, repodaki bir HTML kaynağından (`cv/cv.html`) Microsoft Edge'in başsız modda PDF yazdırmasıyla üretilir → `assets/oznur-demiral-cv.pdf`. Orijinal PDF commit edilmez.

### Teknoloji

- `index.html`, `css/style.css`, `js/main.js`, `js/projects.js`, `assets/`.
- Kütüphane yok. Inter, sitenin kendi dosyalarından (assets/fonts, değişken yazı tipi, latin + latin-ext) yüklenir; dış sunucuya bağlantı yok.
- Dar ekranlarda (≤720px) bölüm bağlantıları, üst bardaki menü düğmesiyle açılan bir panelde.
- `package.json` yalnızca geliştirme komutları için: yerel önizleme sunucusu, HTML/CSS denetimi.
- SEO/paylaşım: `meta description`, Open Graph etiketleri, "ÖD" favicon.

## Uygulayıcıya bırakılanlar (benim kararlarım, Öznur kontrol edebilir)

- Metinler CV'den Türkçe yazılır; Öznur gözden geçirir.
- Fotoğraf CV PDF'inden çıkarılır (yerel betik, commit edilmez). Çözünürlük düşükse Öznur'dan daha büyük bir fotoğraf istenir.
- Duyarlı ızgara: masaüstünde 4 sütun, tablette 2, telefonda 1.
- Yayın: GitHub'da `demiraloznur.github.io` deposu açılıp push edilir — push öncesinde Öznur'a sorulur.
