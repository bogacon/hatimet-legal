# Türkiye SEO uygulaması

18 Ekim 2026. Hedef: Türkiye’de Türkçe arama yapan kullanıcının aradığı içeriğe doğrudan erişmesi. Sıralama veya AdSense kabulü garantisi verilmez.

## Teknik kapsam

- 192 standart URL; benzersiz başlık ve açıklama, kendini gösteren canonical, Türkçe belge dili.
- Ana sayfada anlamlı ilk HTML, JavaScript kapalıyken kaynaklara erişim; aynı içerik çalışan uygulamada da görünür. Boş Expo başlık yer tutucusu derlemede temizlenir.
- HTTPS, www ve bilinen içerik URL’lerinin slash/HTML varyantları tek canonical biçime 301 ile gider; sorgu korunur. Uygulama yolları yeniden yazılmaz.
- Kişisel uygulama ekranları ve teknik envanter noindex; gerçek 404 korunur. robots.txt ve sitemap uyumludur.
- Görünür içerik yoluyla eşleşen BreadcrumbList, gerçek katalog öğeleriyle ItemList/CollectionPage, iki rehberde Article; ana sayfada Organization/WebSite/WebPage. Sahte yorum, adres, puan ve FAQ zengin sonuç iddiası yoktur.
- Gerçek kategori görselleriyle OG ve Twitter paylaşım metadatası. Türkçe tek dil olduğu için sahte yabancı dil URL’leri/hreflang ve IP yönlendirmesi yoktur.

## İçerik ve arama niyeti

| Hedef sorgu grubu | Standart hedef | Yaklaşım |
|---|---|---|
| Kur’an oku, online Kur’an | /kuran/ | 114 sûreye doğrudan bağlantı |
| Fatiha suresi oku ve diğer sûreler | /kuran/{mevcut-sûre-slug}/ | Arapça metin, gerçek sûre bilgileri; çeviriyazıyı meal diye sunmama |
| Türkiye namaz vakitleri, imsakiye | /namaz-vakitleri/ | İl/ilçe seçimi ve 81 resmî kaynak; güncel verisiz şehir sayfası üretmeme |
| hatim takibi, günlük Kur’an okuma planı | /hatim-takibi/ | Kişisel/ortak hatim farkı ve gerçek kayıt işlemleri |
| Kur’an okuma rehberi, cüz ve yer imi | /kuran-okuma-rehberi/ | Gerçek okuyucu kullanım adımları |
| dualar, dua okunuşları | /dualar/ ve mevcut dua sayfaları | Gerçek içerik ve kaynak kapsamıyla eşleşen açıklamalar |
| zikirmatik, zikir sayacı | /zikir-sayaci/ | Aracı ve yerel kayıt davranışını açıklama |

Bu tablo arama hacmi ölçümü değildir. Search Console verisi biriktikçe Türkiye filtresinde sorgu/sayfa eşleşmesi, gösterim, tıklama ve CTR değerlendirilmelidir. Değişiklikleri birkaç günlük oynaklıkla değil yeterli veriyle karşılaştırın.

## Kontrol ve sürdürülebilirlik

Derlemeden sonra `npm test`: 192 URL’nin başlık, açıklama, canonical ve dil tutarlılığı; breadcrumb ve katalog verileri; ana sayfa ilk HTML; 81 resmî bağlantı ve rehberler denetlenir. Dış kaynak bağlantılarının 81’inin canlı HTTP testi yapıldığı iddia edilmez.

Search Console doğrulama dosyası `public/google24b7eeb02389a427.html` kalıcı tutulmalıdır. Sitemap gönderimi ve doğrulama sonuçları teslim raporunda yer alır. İndekslenme, sıralama veya Core Web Vitals saha başarısı yerel testlerden çıkarılamaz.

## Reklam öncesi içerik izni

Mevcut Türkçe çeviriyazı paketinin metadata’sı ve uygulama kaynak belgesi, ticari kullanım için hak sahibinden izin gerektirdiğini belirtir. İzin belgesi bu çalışmada doğrulanmadı. Yeni indekslenebilir sayfalara tam çeviriyazı çoğaltılmadı; mevcut okuyucu işlevi korunur. Reklam gelirine geçişten önce bu izin doğrulanmalıdır. Arapça Tanzil metninin kaynak/lisans şartları ayrı değerlendirilir. AdSense istekleri ve CMP hazırlık bayrakları bu SEO sürümünde açılmaz.

## Resmî başvuru kaynakları

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: Canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=tr)
- [Google: Çok bölgeli siteler](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites?hl=tr)
- [Google: Site haritası](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Tanzil çeviri kullanım şartları](https://tanzil.net/trans/)
