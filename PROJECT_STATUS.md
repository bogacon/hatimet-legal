# Yayın durumu — 16 Ekim 2026

- www.hatimet.net eklendi; HTTPS istekleri yol ve query korunarak 301 ile hatimet.net adresine yönlenir. DMARC ve Resend DKIM TXT kayıtları korundu.
- https://hatimet.net canlıya alındı. Cloudflare Pages özel alan adı Active / SSL enabled; apex CNAME hedefi hatimet-web.pages.dev. Dağıtım: a31d1077-0e82-4bb0-a103-7687b6a6c3cd.
- Canlı HTTPS kontrolleri: kök, Kur’an, giriş, sitemap (187 URL), robots, ads.txt, kaynaklı sûre sayfası, gizlilik yönlendirmesi, gerçek 404 ve davet kabuğu başarılı. Tarayıcıda okuyucu ilerlemesi/yer imi yenileme kalıcılığı doğrulandı; kontrol edilen akışlarda konsol hatası yok.
- AdSense kapalıdır. Gerçek sosyal hesapla giriş ve fiziksel cihaz sensör kabul testleri yapılmadı.

- Expo web çıktısını kökte birleştiren üretim derlemesi; 185 yeni indexlenebilir sayfa + gizlilik ve destek ile 187 canonical sitemap girdisi.
- Safari/iPad uyumu için COEP require-corp kullanılır; web worker/wasm yanıtlarına da izolasyon başlıkları eklenir.
- Cloudflare Pages gelişmiş Worker handler; COOP/COEP, sınırlı Diyanet proxy, noindex özel ekranlar ve önizleme alan adları, eski gizlilik/destek URL yönlendirmeleri.
- Türkçe içerik SEO'su ve kaynak/lisans sayfaları; PWA ve hassas oturum/API verisi içermeyen yerel varlık önbelleği.
- Yayıncı hesabı olmadığı için reklam kapalıdır. Gerçek kimlik, site onayı ve uygun CMP entegrasyonundan sonra bağlantı için config/yerleşim/ads.txt üretimi hazırdır.
- 11 web testi geçti. Ortak mobil/web uygulama paketinde 200 test geçti.
- Asıl uygulama özel depoda; bu depoya erişim tokenı veya servis rolü eklenmez. Derleme için iki checkout veya özel depodaki CI artifact'i kullanılır.
