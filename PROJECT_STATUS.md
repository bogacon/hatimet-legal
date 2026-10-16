# Yayın durumu — 16 Ekim 2026

- Expo web çıktısını kökte birleştiren üretim derlemesi; 185 yeni indexlenebilir sayfa + gizlilik ve destek ile 187 canonical sitemap girdisi.
- Safari/iPad uyumu için COEP require-corp kullanılır; web worker/wasm yanıtlarına da izolasyon başlıkları eklenir.
- Cloudflare Pages gelişmiş Worker handler; COOP/COEP, sınırlı Diyanet proxy, noindex özel ekranlar ve önizleme alan adları, eski gizlilik/destek URL yönlendirmeleri.
- Türkçe içerik SEO'su ve kaynak/lisans sayfaları; PWA ve hassas oturum/API verisi içermeyen yerel varlık önbelleği.
- Yayıncı hesabı olmadığı için reklam kapalıdır. Gerçek kimlik, site onayı ve uygun CMP entegrasyonundan sonra bağlantı için config/yerleşim/ads.txt üretimi hazırdır.
- 11 web testi geçti. Ortak mobil/web uygulama paketinde 200 test geçti.
- Asıl uygulama özel depoda; bu depoya erişim tokenı veya servis rolü eklenmez. Derleme için iki checkout veya özel depodaki CI artifact'i kullanılır.
