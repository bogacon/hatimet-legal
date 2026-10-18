# Hatimet.net DNS yayını

18 Ekim 2026 tarihinde alan adı Spaceship DNS’inden mevcut Cloudflare bölgesine geçirildi. Alan adı kaydı Spaceship’te kaldı. Yalnız hatimet.net değiştirildi.

- Yetkili sunucular: `darl.ns.cloudflare.com`, `selah.ns.cloudflare.com`.
- Apex ve `www`: `hatimet-web.pages.dev` hedefine Proxied CNAME.
- Cloudflare Pages projesi: `hatimet-web`; üretim dağıtımı `3874c0c6-cb6a-4004-9c2b-db4073065a4f`.
- Apex ve www özel alan adları Active / SSL enabled. WWW, path ve query korunarak HTTPS apex’e 301 verir.
- DNSSEC etkin; kayıt kuruluşundaki DS, Cloudflare’ın sağladığı 2371 / algoritma 13 / digest type 2 kaydıyla eşleşir. Eski sağlayıcının otomatik DS kaydı yeni sağlayıcı kaydıyla değiştirildi. DNSSEC kapatılmadı.

## Korunan e-posta kayıtları

Cloudflare’da toplam 11 DNS kaydı vardır: iki web kaydı ve aşağıdaki mevcut dokuz e-posta kaydı. Eksik `send` ve `rsend` CNAME’leri, Spaceship’teki değerlerle DNS only olarak eklendi.

| Ad | Tür | Değer |
|---|---|---|
| @ | MX | 10 mx01.mail.icloud.com |
| @ | MX | 10 mx02.mail.icloud.com |
| @ | TXT | Mevcut apple-domain doğrulaması |
| @ | TXT | v=spf1 include:icloud.com ~all |
| sig1._domainkey | CNAME | sig1.dkim.hatimet.net.at.icloudmailadmin.com |
| _dmarc | TXT | v=DMARC1; p=none; |
| resend._domainkey | TXT | Mevcut açık DKIM anahtarı |
| send | CNAME | send.forge.rmta.net |
| rsend | CNAME | rsend-apne1.forge.rmta.net |

E-posta kayıtları için Cloudflare proxy kullanılmaz. Bu çalışma yeni posta kutusu oluşturmaz ve gerçek e-posta alım/gönderim kabul testi içermez.

## Doğrulama

Google ve Cloudflare genel DNS çözümleyicilerinde NS, DS, A, MX, TXT ve e-posta alt alanları: `Status=0`, `AD=true` (22 sorgu). Google’ın eski NS/DS önbelleği resmî Flush Cache aracıyla yenilendi. Diğer ağlarda kayıtların önbellek süresi bitene kadar yayılım devam edebilir.

Genel DNS çözümlemesi Cloudflare DoH üzerinden yapılarak TLS sertifika kontrolü korundu: 192/192 sitemap URL’si HTTP 200, tek başlık ve kendi canonical adresiyle yanıt verdi. WWW 301; Google doğrulama dosyası ve ads.txt erişilebilir.

Search Console’da https://hatimet.net/ sahipliği HTML dosyasıyla doğrulandı. /sitemap.xml gönderildi; Google Başarılı durumuyla 192 URL keşfetti. Bu sayı indekslenmiş sayfa veya arama sıralaması sayısı değildir.

Kaynak HTML doğrulama dosyasını yayından kaldırmayın. Geri dönüş gerektiğinde önce Pages’in önceki dağıtımına dönmek DNS/e-posta düzenini korur. Ad sunucuları değiştirilecekse hedef sağlayıcının güncel DS/DNSKEY eşleşmesi ayrıca doğrulanmalıdır.
