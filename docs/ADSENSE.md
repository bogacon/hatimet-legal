# AdSense bağlantısına hazırlık

Mevcut sürümde `config/adsense.json` kapalıdır. Yayıncı hesabı yoktur; site hiçbir Google reklam kodu yüklemez, reklam isteği yapmaz, boş reklam kutusu göstermez. `ads.txt` yalnız açıklama içerir; uydurma yayıncı satırı yoktur. Reklam altyapısı SEO puanı veya AdSense kabulü garantisi değildir.

Hesap oluşturulduktan ve site Google tarafından uygun bulunduğunda:

1. AdSense hesabında hatimet.net sitesini ekleyin. Hesaptaki gerçek `ca-pub-` kimliğini ve duyarlı içerik reklam biriminin slot kimliğini alın.
2. Gizlilik metnini gerçek sağlayıcılar ve işlemlerle güncelleyin. İlgili bölgeler için Google sertifikalı CMP kurun. Bu depodaki olay dinleyicisi bir CMP değildir.
3. CMP'nin güncel, bölgeye uygun izin kararından sonra `window.dispatchEvent(new Event('hatimet:ads-permitted'))` çağıracak entegrasyonu yapın. Bu olay site yüklenişinde veya sıradan bir “kabul” butonuyla kendiliğinden gönderilmez. İzin geri çekildiğinde reklam isteklerini durdurun ve sayfayı yenileyin. Google'ın gerektirdiği izin sinyallerini CMP sağlayıcısının resmi entegrasyonu ile gönderin.
4. `config/adsense.json` içindeki gerçek kimlikleri doldurun; yalnız CMP kurulumunu doğruladıktan sonra `cmpReady` ve `enabled` değerlerini `true` yapın. Yeniden build alın. Geçersiz/eksik kimlik veya CMP beyanı build'i durdurur.
5. `/ads.txt`, hesap doğrulama metası, onay durumu ve izin verilmeden reklam isteği gitmediğini tarayıcı ağ panelinde doğrulayın. Reddedilen/geri çekilen izin ve mobil görünümü de kontrol edin.

Yerleşimler: yalnız herkese açık namaz rehberi ve isimler sayfalarının sonunda tek, “Reklam” etiketli duyarlı alan. Sabitlenmiş reklam, sahte indirme, yönlendirme butonu, etkileşimli okuyucu, giriş, günlük ve kişisel istatistik ekranlarında reklam yoktur. Alan içerikten ayrılır ve kaymayı azaltmak için yer ayırır.

Otomatik reklamları açmak, sayfalara rastgele reklam koymak ve kişisel ibadet verileriyle reklam hedeflemek bu entegrasyonun kapsamında değildir.

Resmî kaynaklar:
- https://support.google.com/adsense/answer/12131223
- https://support.google.com/adsense/answer/12171612
- https://support.google.com/adsense/answer/13554116
