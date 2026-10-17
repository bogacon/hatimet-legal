# AdSense bağlantısı — 17 Ekim 2026

Kullanıcının sağladığı yayıncı kimliği: `ca-pub-2026830697384470`. Doğru yayıncı hesabı Google panelinde açıldı; hatimet.net site sahipliği kod ile doğrulandı ve inceleme talebi gönderildi. Panel durumu “Hazırlanıyor / İnceleme istendi”; reklam gösterimi onaylanmış değildir.

## Site tarafında uygulananlar

`config/adsense.json`: `connectScript:true`, gerçek `publisherId`, `enabled:false`, `cmpReady:false`. Ana sayfanın ve herkese açık içerik sayfalarının head alanında kullanıcının verdiği async/crossorigin betiği vardır. Ondan önce `window.adsbygoogle.pauseAdRequests=1` uygulanır. Sahiplik metası ve `/ads.txt` de aynı kimliği taşır. Noindex 404 ve doğrudan açılan giriş/parola/kişisel ekranlarda bağlantı betiği eklenmez. Ana sayfadan SPA gezinmesinde önceden yüklenen betik duraklatılmış kalır.

Reklam birimi oluşturulmaz, otomatik reklamlar açılmaz, boş reklam kutusu eklenmez. Site Google onayı alınmış gibi gösterilmez. Betiğin indirilmesi Google ile ağ bağlantısı oluşturur; bu nedenle gizlilik ve çerez açıklamaları güncellenmiştir. Google’ın belgesine göre duraklatmada mevcut Google çerezleri okunabilir fakat yeni reklam çerezleri ayarlanmaz; mevcut çerez bilgileri reklam sunumu/ölçümü için kullanılmaz. Duraklatma mekanizması sertifikalı CMP değildir.

İletişim, hakkımızda, kullanım rehberi, lisans/kaynaklar, gizlilik, çerez açıklamaları ve gerçek 404 erişilebilirdir. Gizlilik/destek sayfalarının iç içe URL’lerde yanlış yere giden göreli bağlantıları düzeltildi. Site haritası 190 URL içerir; robots.txt içerik taramasını engellemez. İçerik lisansları ve kaynak bağlantıları korunur. Bu hazırlık Google kabulü garantisi değildir.

## Doğru hesaptan tamamlanması gerekenler

1. `hatimet.net` sitesinin yayıncı kimliğiyle aynı AdSense hesabında bulunduğunu doğrulayın. Siteler bölümünde sahiplik kontrolünü yapın ve mevcut durum izin veriyorsa inceleme isteyin. Sunucuya eklenen kod bu düğmelere basıldığı anlamına gelmez.
2. Gizlilik ve mesajlaşma bölümünde ilgili bölgeler için Google sertifikalı CMP mesajını yapılandırıp yayımlayın. Site gizlilik URL’si `https://hatimet.net/gizlilik/`; kullanıcıya ret, seçim ve geri çekme yolları sağlayın. Gerçek CMP/TCF sinyalleri test edilmeden `cmpReady` değerini değiştirmeyin.
3. Google onayı, gerçek reklam birimi/slot kimliği ve test edilmiş izin entegrasyonu tamamlandıktan sonra `enabled:true` kullanın. Mevcut `/adsense.js` dinleyicisine yalnız gerçek CMP’nin güncel ve bölgeye uygun kararıyla `hatimet:ads-permitted` olayı gönderilebilir. Sıradan bir kabul düğmesi sertifikalı CMP yerine geçmez. İzin geri çekilmesi ve izin reddi ayrıca doğrulanmalıdır.
4. Aktif yerleşimler yalnız seçilmiş kamusal içerik alanlarındadır; okuyucu, giriş, günlük ve kişisel istatistik ekranlarına reklam yerleştirmeyin. Kişisel ibadet verileriyle reklam hedeflemeyin.

17 Ekim’de kullanıcının açtığı doğru yayıncı hesabından kod doğrulaması ve inceleme isteği tamamlandı. Yeni hesap veya sözleşme oluşturulmadı; ödeme ayarları ve diğer alan adları değiştirilmedi. hatimet.net için mevcut Google Avrupa tüzükleri mesajı düzenlenerek yayımlandı: varsayılan dil Türkçe, izin vermeme düğmesi tüm bölgelerde açık, izin vermeden kapatma açık, otomatik mesaj optimizasyonu kapalı; yalnız hatimet.net seçili. Site adı Hatim Et, gizlilik bağlantısı https://hatimet.net/gizlilik/ olarak düzeltildi. Google mesajın görünmesinin bir saati bulabileceğini bildirir. Bölgesel gerçek ziyaretçi/ret/geri çekme kabul testi ve aktif reklam gösterimi henüz yapılmadığı için `cmpReady:false` korundu. Google, mesajı gösterdiği ziyaretçilere izin geri alma bağlantısını otomatik ekler.

## Resmî kaynaklar

- [Site bağlantısı ve inceleme](https://support.google.com/adsense/answer/7584263)
- [Google etiketlerinde reklam isteğini duraklatma](https://support.google.com/adsense/answer/7670312)
- [ads.txt](https://support.google.com/adsense/answer/12171612)
- [CMP gereklilikleri](https://support.google.com/adsense/answer/13554020)
- [Gizlilik açıklamasında gereken içerik](https://support.google.com/adsense/answer/1348695)
- [İçerik ve kullanılabilirlik değerlendirmesi](https://support.google.com/adsense/answer/7299563)
