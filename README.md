# Hatim Et web yayını

hatimet.net: mobil uygulamayla ortak çalışan, misafir kullanıma açık web uygulaması ve arama motorlarının okuyabildiği içerik sayfaları.

## Derleme

Node 26 ve npm gerekir. Özel `bogacon/uygulamareposu` checkout'u ile bu depoyu aynı üst klasöre alın:

```sh
cd ../uygulamareposu
npm ci
npm run build:web
cd ../hatimet-legal
npm ci
npm run build
npm test
npm run preview
```

Mobil checkout başka yerdeyse `HATIMET_MOBILE_SOURCE=/tam/yol npm run build` kullanın. Üretim çıktısı **dist** klasörüdür. Eski kök `index.html` önceki GitHub Pages sayfasının kaynağı olarak korunmuştur; yeni üretim çıktısı değildir. İstemci kodu özel depoda tutulabilir; tarayıcıya gönderilen derleme doğal olarak herkese açıktır. Özel depo erişim tokenını bu herkese açık depoya eklemeyin.

## Yayın

`dist` içeriğini kökte barındıran ZIP'i Cloudflare Pages **hatimet-web** projesine Direct Upload ile yükleyin. `_worker.js` dosyasını çıkarmazsanız gelişmiş Worker modu SQLite başlıklarını, gerçek 404'ü, dinamik davet fallback'ini, www yönlendirmesini ve sınırlı Diyanet proxy'sini sağlar. Yalnız statik dosyaları eski GitHub Pages'e kopyalamak eşdeğer değildir.

Alternatif: Yetkili bir Wrangler oturumuyla `npm run deploy`, aynı ASSETS handler'ını Workers varlıkları üzerinde kullanır. Bu seçenek ayrı ortamdır; mevcut Pages özel alan adıyla çakışan route eklemeyin.

Cloudflare Pages önizleme alan adları `noindex` başlığı taşır. Asıl canonical alan adı https://hatimet.net'tir. Özel alan adı bağlarken mevcut e-posta TXT kayıtlarını koruyun.

## SEO ve reklam

- 114 tam sûre, 54 dua, yedi namaz rehberi, isimler, takvim ve kaynak sayfaları statik HTML olarak üretilir; metinler mobil içerik kaynaklarından gelir.
- Canonical, açıklama, OG/WebPage schema, sitemap, robots ve gerçek 404 vardır. Kişisel ekranlar `noindex` olur. Türkçe statik sayfalara sahte hreflang eklenmez.
- AdSense site bağlantı kodu `ca-pub-2026830697384470` ile eklenmiştir. Reklam gösterimi kapalıdır; Google betiğinden önce `pauseAdRequests=1` uygulanır. Ayrıntılar: [docs/ADSENSE.md](docs/ADSENSE.md).
- Sitemap/teknik hazırlık arama sıralaması veya AdSense onayı garantisi değildir. Search Console doğrulaması ve gerçek AdSense hesap süreci site sahibinin hesabıyla tamamlanmalıdır.

## Kontroller

`npm test`: Worker güvenliği/izinli proxy, SQLite izolasyonu, derlenen tüm yerel link/varlıklar, sûre/dua sayıları, site haritası ve kapalı AdSense davranışı için 19 test. Ortak uygulama deposunda ayrıca 196 test, TypeScript ve ESLint vardır.

Mobil/web platform farkları ve yedekleme işleyişi özel uygulama deposunun `docs/WEB.md` dosyasındadır. Web'de takvim içe aktarma gerekir; kapalı tarayıcıda native push teslimi yoktur. Kişisel veriler açık yedekleme/geri yükleme ile taşınır; ortak hatim Realtime kullanır.

16 Ekim güncellemesi: tüm SEO içerik başlıkları ve kartları ortak avlu tasarımını kullanır. Web/mobil mikrofonla okuma kaldırıldı; Worker mikrofon ve cihaz içi konuşma tanımayı Permissions-Policy ile engeller.

AdSense sahipliği için kullanıcıdan alınan gerçek yayıncı kimliğiyle meta, async bağlantı betiği ve ads.txt üretilir; reklam istekleri duraklatılır. Kullanım rehberi, iletişim, çerez/depolama açıklaması ve RFC 9116 security.txt üretim paketindedir. Google kabul kararı hesap/site incelemesine bağlıdır.

Açılış performansı: service worker yalnız ana sayfanın çekirdek dosyalarını önceden yükler; diğer sayfalar ve görseller kullanıldıkça önbelleğe girer. Kayıt/giriş, parola yenileme ve API istekleri bu önbelleğin dışındadır. Ana kapak görseli HTML içinde preload edilir.
