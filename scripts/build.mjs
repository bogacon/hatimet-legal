import { readFile, writeFile, mkdir, cp, rm, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { prepareAdsense } from './adsense.mjs';
import { createServiceWorker } from './service-worker.mjs';
import { editorialPages } from './editorial-pages.mjs';
import { seoPages } from './seo-pages.mjs';
import { breadcrumbSchema, catalogSchema, searchSurahName } from './seo.mjs';
const ads = prepareAdsense(JSON.parse(await readFile('config/adsense.json','utf8')));

const mobile = resolve(process.env.HATIMET_MOBILE_SOURCE || '../uygulamareposu');
const out = resolve('dist');
const domain = 'https://hatimet.net';
const quran = JSON.parse(await readFile(join(mobile, 'src/content/quran-uthmani-1.1.json'), 'utf8'));
const duas = JSON.parse(await readFile(join(mobile, 'src/content/dua-catalog-v1.json'), 'utf8'));
const names = JSON.parse(await readFile(join(mobile, 'src/content/baby-names-v1.json'), 'utf8'));
const loadContent = async (file) => {
  const source = (await readFile(join(mobile, 'src/content', file), 'utf8')).replace(/^import[^\n]*\n/gm, '');
  return import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source, { mode: 'strip' })).toString('base64')}`);
};
const calendar = await loadContent('religious-days.ts');
const guides = await loadContent('prayer-guides.ts');
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const slug = (value) => value.toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ı', 'i').replaceAll('â', 'a').replaceAll('’', '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const surahPath = (surah) => `/kuran/${surah.id}-${slug(surah.nameTr)}-suresi/`;
const button = (label, href, secondary = false) => `<a class="button${secondary ? ' secondary' : ''}" href="${escape(href)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const paths = [];
const seoInventory = [];
const crumbs = (title, parent) => `<nav class="crumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span aria-hidden="true">/</span>${parent ? `<a href="${parent[1]}">${escape(parent[0])}</a><span aria-hidden="true">/</span>` : ''}<span>${escape(title)}</span></nav>`;
function layout({ title, description, path, body, schema, noindex = false }) {
  const headingArt = path.startsWith('/kuran') ? 'courtyard-dawn' : path.startsWith('/dualar') ? 'dua-garden' : path.startsWith('/namaz') || path.startsWith('/dini-gunler') ? 'prayer-dawn' : path.startsWith('/zikir') ? 'dhikr-beads' : path.startsWith('/isimler') ? 'profile-journal' : path.startsWith('/hakkimizda') ? 'community-lanterns' : 'explore-path';
  body = body.replace('class="content-heading"', `class="content-heading" style="--heading-image:url('/media/${headingArt}.jpg')"`);
  const ld = [{ '@context': 'https://schema.org', '@type':'WebPage', name:title, description, url:domain + path, inLanguage:'tr-TR', breadcrumb:{'@id':domain+path+'#breadcrumb'}, publisher:{'@id':domain+'/#organization'}, isPartOf:{ '@type':'WebSite', '@id':domain+'/#website', name:'Hatim Et', url:domain } }];
  const breadcrumb=breadcrumbSchema(body,path);if(breadcrumb)ld.push(breadcrumb);
  if (schema) ld.push(schema);
  const shareImage=domain+'/media/'+headingArt+'.jpg';
  seoInventory.push({path,title,description,indexable:!noindex,canonical:domain+path,language:'tr-TR',schemaTypes:ld.map(s=>s['@type'])});
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}"><link rel="canonical" href="${domain}${escape(path)}"><meta name="theme-color" content="#0f3d33"><link rel="icon" href="/logo.png"><meta property="og:type" content="website"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="Hatim Et"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${domain}${escape(path)}"><meta property="og:image" content="${shareImage}"><meta property="og:image:alt" content="${escape(title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${shareImage}"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${json(ld)}</script><script src="/site.js" defer></script>${noindex ? ads.verificationMeta : ads.head}</head><body><a class="skip" href="#main">İçeriğe geç</a><header class="top"><div class="wrap"><a class="brand" href="/" aria-label="Hatim Et ana sayfa"><img src="/logo.png" width="42" height="42" alt="">Hatim Et</a><nav class="nav" aria-label="Ana gezinme"><a href="/kuran/">Kur’an-ı Kerim</a><a href="/dualar/">Dualar</a><a href="/namaz-vakitleri/">Namaz vakitleri</a><a href="/hatim-takibi/">Hatim takibi</a><a class="button" href="/profile">Hesabım <span aria-hidden="true">↗</span></a></nav></div></header><main id="main">${body}${path.startsWith('/namaz-rehberi/') || path === '/isimler/' ? `<div class="wrap">${ads.placement}</div>` : ''}</main><footer class="footer"><div class="wrap"><div><a class="brand" href="/">Hatim Et</a><p class="small">Kur’an okuma ve ibadet yolculuğuna eşlik eden sade bir alan.<br>Arapça Kur’an metni: <a href="https://tanzil.net">Tanzil Uthmani 1.1</a>.</p></div><nav aria-label="Alt gezinme"><a href="/gizlilik/">Gizlilik</a><a href="/destek/">Destek</a><a href="/kaynaklar/">Kaynaklar</a><a href="/hakkimizda/">Hakkımızda</a><a href="/kullanim-rehberi/">Kullanım rehberi</a><a href="/iletisim/">İletişim</a><a href="/cerez-politikasi/">Çerezler ve depolama</a><a href="/sign-in">Giriş yap</a></nav></div></footer></body></html>`;
}
async function page(path, title, description, body, schema, noindex = false) {
  const file = path.endsWith('/') ? path + 'index.html' : path;
  const destination = join(out, file);
  await mkdir(resolve(destination, '..'), { recursive: true });
  await writeFile(destination, layout({ title, description, path, body, schema, noindex }));
  if (!noindex) paths.push(path);
}
const content = (title, intro, html, parent) => `<div class="wrap content">${crumbs(title, parent)}<header class="content-heading"><h1>${escape(title)}</h1><p class="intro">${escape(intro)}</p></header>${html}</div>`;
const search = (label) => `<label class="search"><span aria-hidden="true">⌕</span><input type="search" data-search placeholder="${escape(label)}" aria-label="${escape(label)}"></label><p class="small" data-search-status aria-live="polite"></p>`;

await stat(join(mobile, 'dist-web/index.html'));
await rm(out, { recursive:true, force:true }); await mkdir(out, { recursive:true });
await cp('public', out, { recursive:true });
await cp(join(mobile, 'dist-web'), out, { recursive:true });
if (ads.verificationHead) {
 const indexPath = join(out, 'index.html');
 await writeFile(indexPath, (await readFile(indexPath, 'utf8')).replace('</head>', ads.verificationHead + '</head>'));
}
for (const asset of ['logo.png','avatar-boy.png','avatar-girl.png','avatar-man.png','avatar-woman.png']) await cp(asset, join(out, asset));
for (const [file, directory] of [['privacy.html','gizlilik'],['support.html','destek']]) { await mkdir(join(out,directory),{recursive:true}); await cp(file,join(out,directory,'index.html')); }
paths.push('/');

await page('/kuran/', 'Kur’an-ı Kerim Oku — 114 Sûre | Hatim Et', 'Kur’an-ı Kerim’in 114 sûresini Arapça oku. Sûre isimleri, ayet sayıları, cüz ve sayfa bilgileri. Tanzil Uthmani 1.1 kaynaklı tam metin.', content('Kur’an-ı Kerim', '114 sûre. 6236 ayet. Okumak istediğin sûreyi seç.', search('Sûre adı veya numarası ara')+`<div class="catalog">${quran.surahs.map((s)=>`<a data-search-item href="${surahPath(s)}"><span class="index">${s.id}</span><span><b>${escape(s.nameTr)}</b> <span lang="ar" dir="rtl">${escape(s.nameArabic)}</span><span class="meta">${s.verseCount} ayet · ${s.origin} · ${s.startPage}. sayfa</span></span></a>`).join('')}</div><div class="notice">Yer imi, kelime takibi ve kaldığın yere dönüş için ${button('Okuyucuyu aç','/quran',true)}</div>`),catalogSchema('/kuran/','Kur’an-ı Kerim sûreleri',quran.surahs.map(s=>({name:s.nameTr,path:surahPath(s)}))));
for (const s of quran.surahs) {
 const verses = `<ol class="verses">${s.verses.map((v)=>`<li id="ayet-${v.ayah}"><p class="arabic" lang="ar" dir="rtl">${escape(v.text)}</p><div class="verse-meta"><span>${s.id}:${v.ayah} · Cüz ${v.juz} · Sayfa ${v.page}</span><a href="/reader?surah=${s.id}&amp;ayah=${v.ayah}">Okuyucuda aç ↗</a></div></li>`).join('')}</ol>`;
 const source = `<div class="source-box"><strong>Metin kaynağı ve kullanım şartları</strong><p>${escape(quran.source)} · ${escape(quran.license)}</p><p>${escape(quran.copyright)}</p><a href="${escape(quran.sourceUrl)}">Tanzil kaynak metni</a> · <a href="${escape(quran.updatesUrl)}">Metin güncellemeleri</a><p>${escape(quran.textPolicy)}</p></div>`;
 const before = quran.surahs[s.id-2], after = quran.surahs[s.id];
 await page(surahPath(s), `${searchSurahName(s.nameTr)} Suresi Oku — Arapça ${s.verseCount} Ayet | Hatim Et`, `${s.nameTr} sûresinin ${s.verseCount} ayetini Arapça oku. ${s.origin} dönemine ait ${s.id}. sûre; ${s.startPage}. sayfadan başlar. Kaynak: Tanzil Uthmani 1.1.`, content(`${s.nameTr} sûresi`, `${s.id}. sûre · ${s.origin} · ${s.verseCount} ayet · Başlangıç sayfası ${s.startPage}`, button('Kaldığın yeri kaydederek oku', `/reader?surah=${s.id}`)+verses+source+`<nav class="prev-next" aria-label="Sûreler arasında gezinme">${before ? `<a href="${surahPath(before)}">← ${escape(before.nameTr)}</a>` : '<span></span>'}${after ? `<a href="${surahPath(after)}">${escape(after.nameTr)} →</a>` : ''}</nav>`, ['Kur’an-ı Kerim','/kuran/']));
}
await page('/dualar/', 'Kur’an’dan Dualar — Kaynaklı Dua Kataloğu | Hatim Et', '54 kaynaklı Kur’an duası: şükür, sabır, şifa, aile, bağışlanma ve hidayet için dualar. Ayet metinlerini ve Diyanet kaynaklarını incele.', content('Her hâline bir dua', 'Duanı bul. Ayetini oku. Kaynağını incele.', search('Dua veya konu ara')+`<div class="catalog">${duas.entries.map((d)=>`<a data-search-item href="/dualar/${d.id}/"><span><b>${escape(d.title)}</b><span class="meta">${escape(d.topicLabel)} · ${escape(d.sourceLabel)}</span></span></a>`).join('')}</div>`),catalogSchema('/dualar/','Kur’an’dan dualar',duas.entries.map(d=>({name:d.title,path:'/dualar/'+d.id+'/'}))));
for(const d of duas.entries) {
 const text=d.verseRefs.map((r)=>{const s=quran.surahs[r.surah-1];const v=s.verses.find((v)=>v.ayah===r.ayah);return `<li><p class="arabic" lang="ar" dir="rtl">${escape(v.text)}</p><div class="verse-meta"><a href="${surahPath(s)}#ayet-${r.ayah}">${escape(s.nameTr)} ${r.surah}:${r.ayah}</a></div></li>`;}).join('');
 await page(`/dualar/${d.id}/`, `${d.title} Duası — Kur’an’dan Dua | Hatim Et`, `${d.title}: ${d.topicLabel} konusunda Kur’an duası. ${d.sourceLabel}. Arapça ayet metni ve kaynak bağlantısı.`, content(d.title, `${d.category} · ${d.topicLabel}`, `<ul class="verses">${text}</ul><div class="source-box"><strong>Kaynak</strong><p>${escape(d.sourceLabel)}</p><a href="${escape(d.sourceUrl)}" rel="external">Diyanet’te tefsir ve açıklamayı oku ↗</a></div><p>${button('Favorilerine eklemek için sitede görüntüle',`/dua/${d.id}`)}</p>`, ['Dualar','/dualar/']));
}
const generic = [
 ['/namaz-vakitleri/','Namaz Vakitleri ve İmsakiye','Şehrini ve ilçeni seçerek günlük vakitleri, sıradaki namaza kalan süreyi ve aylık imsakiye takvimini incele.', '/prayer', 'Vakitleri aç', '<h2>Kaynağını bilerek takip et</h2><p>Uygulama veri bulunduğunda Diyanet sayfası veya takvim aynasını kullanır. Resmî veri alınamadığında yaklaşık astronomik hesap gösterilir ve kaynak açıkça belirtilir. Her iki durumda da bulunduğun yer için resmî vakitleri doğrulayabilirsin.</p><p><a href="https://namazvakitleri.diyanet.gov.tr">Diyanet resmî namaz vakitleri</a></p><h2>Günlük takip araçları</h2><p><a href="/prayer-journal">Namaz günlüğü</a> · <a href="/kaza">Kaza namazı takibi</a> · <a href="/qibla">Kıble pusulası</a> · <a href="/imsakiye">Aylık imsakiye</a></p>'],
 ['/zikir-sayaci/','Zikirmatik — Zikir Sayacı','Hazır veya kişisel bir zikir seç; 33, 99, 100, 1000 ya da kendi belirlediğin hedefle devam et.', '/zikirmatik','Zikirmatiği aç','<h2>Kendi düzenini oluştur</h2><p>Zikir oturumların tarayıcında saklanır. Haftalık hedefini ve yedi günlük geçmişini görebilir, kişisel bir zikir adı ekleyebilirsin. Telefonda titreşim desteği tarayıcı ve cihazına bağlıdır.</p>'],
];
const provinces=await loadContent('turkey-provinces.ts');
for(const [path,t,d,h,b,extra] of generic) {
 const directory=path==='/namaz-vakitleri/'?`<h2>Türkiye’de il ve ilçe seçimi</h2><p>Vakitler konuma ve tarihe göre değişir. Burada sabit bir saat tablosu yayınlamak yerine, sitede kendi il ve ilçeni seçerek güncel kaynağı kontrol edebilirsin. İmsak, güneş, öğle, ikindi, akşam ve yatsı ayrı vakitlerdir; imsak ile güneşi birbirinin yerine kullanma. Resmî veri alınamadığında gösterilen yaklaşık hesap kaynağı ayrıca belirtilir.</p><p><a href="/city-picker">Sitede il ve ilçe seç</a> · <a href="/imsakiye">Aylık imsakiye</a> · <a href="/namaz-rehberi/">Namaz kılınışı rehberi</a></p><h3>81 il için resmî kaynak bağlantıları</h3><p>Aşağıdaki bağlantılar il merkezinin Diyanet sayfasını açar. İlçene ait vakit için resmî sayfada veya uygulamadaki ilçe seçimini ayrıca kontrol et.</p><ul class="province-links">${provinces.turkeyProvinces.map(p=>`<li><a href="https://namazvakitleri.diyanet.gov.tr/tr-TR/${p.ilceId}/${slug(p.name)}-icin-namaz-vakti" rel="external">${escape(p.name)} namaz vakitleri</a></li>`).join('')}</ul>`:'';
 await page(path, path==='/namaz-vakitleri/'?'Türkiye Namaz Vakitleri: İl, İlçe ve İmsakiye | Hatim Et':`${t} | Hatim Et`, d, content(t,d,`<p>${button(b,h)}</p>${extra}${directory}`));
}
const prayerGuides=guides.prayerGuides || guides.PRAYER_GUIDES;
if (!Array.isArray(prayerGuides)) throw new Error('Prayer guides export changed; update build mapping.');
await page('/namaz-rehberi/','Namaz Nasıl Kılınır? — Kaynaklı Namaz Rehberi | Hatim Et','Beş vakit, cuma ve bayram namazı için rekât sırası ve adım adım namaz kılınışı. Diyanet Namaz İlmihali kaynaklı rehber.',content('Namaz rehberi','Namazın rekât sırası ve kılınışını kaynaklı açıklamalarla öğren.',`<div class="catalog">${prayerGuides.map((g)=>`<a href="/namaz-rehberi/${g.id}/"><span><b>${escape(g.title.tr)}</b><span class="meta">${escape(g.subtitle.tr)}</span></span></a>`).join('')}</div><p><a href="${guides.PRAYER_GUIDE_SOURCE.url}">Kaynak: Diyanet Namaz İlmihali</a></p>`));
for(const g of prayerGuides) await page(`/namaz-rehberi/${g.id}/`,`${g.title.tr} Nasıl Kılınır? | Hatim Et`,`${g.title.tr}: ${g.subtitle.tr}. Rekât sırası, kıraat ve oturuşlar. Kaynak: Diyanet Namaz İlmihali.`,content(g.title.tr,g.subtitle.tr,`<p>${escape(g.order.tr)}</p>${g.importantNote ? `<div class="notice">${escape(g.importantNote.tr)}</div>`:''}${g.parts.map((p)=>`<section><h2>${escape(p.title.tr)}</h2><p>${escape(p.status.tr)} · ${p.rakats} rekât</p>${p.note ? `<p>${escape(p.note.tr)}</p>`:''}<ol>${p.steps.map((s)=>`<li><h3>${escape(s.title.tr)}</h3><p>${escape(s.body.tr)}</p></li>`).join('')}</ol></section>`).join('')}<div class="source-box"><a href="${guides.PRAYER_GUIDE_SOURCE.url}">Diyanet Namaz İlmihali — kaynak PDF</a></div>`,['Namaz rehberi','/namaz-rehberi/']));
await page('/dini-gunler/','2026–2027 Dinî Günler ve Kandiller | Hatim Et','Diyanet kaynaklı 2026–2027 dinî günler, kandiller, Ramazan ve bayram tarihleri. Takvim ve sitedeki kaynaklı açıklamalar.',content('Dinî günler','Diyanet takviminden 2026–2027 tarihleri. Hicrî günler akşamdan başlar; bulunduğun yerin duyurularını kontrol et.',`<div class="notice">Veri sürümü: ${escape(calendar.RELIGIOUS_DAYS_DATA_VERSION)} · <a href="${calendar.RELIGIOUS_DAYS_SOURCE}">Resmî takvim</a></div><table class="calendar"><thead><tr><th scope="col">Tarih</th><th scope="col">Gün</th><th scope="col">Hicrî tarih</th></tr></thead><tbody>${calendar.RELIGIOUS_DAYS.map((d)=>`<tr><td><time datetime="${d.date}">${new Date(d.date+'T12:00:00+03:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Istanbul'})}</time></td><td><a href="/religious-day/${d.id}">${escape(d.title)}</a></td><td>${escape(d.hijri)}</td></tr>`).join('')}</tbody></table>`));
await page('/isimler/','Bebek İsimleri ve Anlamları | Hatim Et','263 kız ve erkek ismi; isim anlamları, Kur’an referansları ve peygamber isimleri. Kaynak ve içerik notlarıyla bebek isimleri kataloğu.',content('Bebek isimleri','İsimlerin anlamlarını incele, favorilerini sitede bir araya getir.',search('İsim veya anlam ara')+`<div class="name-list">${names.entries.map((n)=>`<article data-search-item><h2>${escape(n.name)}</h2><span class="small">${escape(n.gender)}</span><p>${escape(n.meaning)}</p></article>`).join('')}</div><div class="notice">${escape(names.disclaimer)}<p><a href="${escape(names.sourceUrl)}">İçerik kaynağı</a></p></div><p>${button('İsimleri favorilerine ekle','/baby-names')}</p>`));
await page('/kaynaklar/','İçerik Kaynakları ve Lisanslar | Hatim Et','Hatim Et Kur’an metni, dualar, namaz rehberleri ve dinî gün takvimi için içerik kaynakları, lisanslar ve kullanım açıklamaları.',content('Kaynaklar ve lisanslar','İçeriklerin kaynağını inceleyebilmen için bağlantıları bir araya getirdik.',`<h2>Kur’an-ı Kerim</h2><p>${escape(quran.copyright)} · ${escape(quran.license)}</p><p>${escape(quran.textPolicy)}</p><p><a href="${quran.sourceUrl}">Tanzil Uthmani 1.1</a> · <a href="${quran.updatesUrl}">Tanzil metin güncellemeleri</a></p><h2>Dualar</h2><p>Dua kataloğundaki Arapça ayetler aynı Tanzil metninden alınır. Her dua sayfasında Diyanet Kur’an portalına kaynak bağlantısı bulunur.</p><h2>Namaz rehberleri</h2><a href="${guides.PRAYER_GUIDE_SOURCE.url}">Diyanet Namaz İlmihali</a><h2>Dinî günler</h2><a href="${calendar.RELIGIOUS_DAYS_SOURCE}">Diyanet dinî günler takvimi</a><h2>Namaz vakitleri</h2><p>Diyanet sayfası, takvim aynası ve veri yokluğunda yaklaşık cihaz içi hesap. Güncel kaynağı sitede görebilirsin.</p>`));
await page('/hakkimizda/','Hatim Et Hakkında ve İletişim | Hatim Et','Hatim Et’in amacı, sunduğu araçlar, içerik yaklaşımı ve iletişim bilgileri.',content('Hatim Et hakkında','Kur’an okumayı ve günlük ibadet takibini kolaylaştıran kişisel bir yardımcı.',`<h2>Ne sunuyoruz?</h2><p>Tam Kur’an metni, kelimeyle okuma takibi, yer imleri, bireysel ve ortak hatim, namaz vakitleri, dua kataloğu ve kişisel takip araçları. Telefonda ve bilgisayarda aynı web sitesi kullanılabilir.</p><h2>Kayıtlar senin kontrolünde</h2><p>Misafir olarak kişisel araçları kullanabilirsin. Tarayıcı verilerini temizlemek kayıtlarını silebilir. Bir hesapla buluta yedekleme ve geri yükleme seçeneği sunulur; ortak hatimlerde hesap gerekir.</p><h2>İçerik yaklaşımı</h2><p>Arapça Kur’an metni Tanzil Uthmani 1.1 kaynağından değiştirilmeden sunulur. Dua, namaz rehberi ve takvim sayfalarında kaynak bağlantıları yer alır. Okuma ve takip verileri ibadetin değerini ölçmez.</p><h2>İletişim ve düzeltme bildirimleri</h2><p>Proje sorumlusu: Boğaç Ondalıkoğlu. İçerik düzeltmesi, destek ve veri talepleri için <a href="mailto:bogacondalikoglu@gmail.com">bogacondalikoglu@gmail.com</a> adresine yazabilirsin. Sorunun görüldüğü sayfayı belirtmen yardımcı olur.</p><p><a href="/kaynaklar/">Kaynaklar</a> · <a href="/gizlilik/">Gizlilik</a> · <a href="/destek/">Destek</a></p>`));
for (const item of editorialPages) await page(item.path, item.title, item.description, content(item.title, item.intro, item.html));
for (const item of seoPages) await page(item.path,item.title,item.description,content(item.heading,item.intro,item.html),{'@context':'https://schema.org','@type':'Article',headline:item.heading,inLanguage:'tr-TR',datePublished:'2026-10-18',dateModified:'2026-10-18',author:{'@type':'Organization',name:'Hatim Et',url:domain+'/hakkimizda/'},publisher:{'@id':domain+'/#organization'},mainEntityOfPage:domain+item.path});
await writeFile(join(out,'ads.txt'),ads.adsTxt);
await page('/404.html','Sayfa Bulunamadı | Hatim Et','Aradığın sayfa bulunamadı.',content('Bu sayfayı bulamadık.','Bağlantı değişmiş veya hatalı olabilir.',button('Ana sayfaya dön','/')),null,true);
await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p)=>`<url><loc>${domain}${escape(p)}</loc></url>`).join('')}<url><loc>${domain}/gizlilik/</loc></url><url><loc>${domain}/destek/</loc></url></urlset>`);
await writeFile(join(out,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${domain}/sitemap.xml\n`);
await writeFile(join(out,'manifest.webmanifest'),json({id:'/',name:'Hatim Et',short_name:'Hatim Et',lang:'tr',start_url:'/',scope:'/',display:'standalone',background_color:'#f7f4ee',theme_color:'#0f3d33',icons:[{src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'}]}));
await cp(join(mobile,'assets/images/icon.png'),join(out,'icon-512.png'));
await writeFile(join(out,'seo-inventory.json'),json(seoInventory));
console.log(`Built ${paths.length} indexable pages; 114 surahs, 54 duas, ${prayerGuides.length} prayer guides, ${names.entries.length} names; interactive website at /.`);
// Pages advanced mode works with dashboard zip upload and the same ASSETS API.
await cp('worker/index.mjs',join(out,'_worker.js'));
const { readdir } = await import('node:fs/promises');
const { createHash } = await import('node:crypto');
const listAssets = async (directory, prefix='') => {
  const found=[];
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const relative=prefix+'/'+entry.name;
    if(entry.isDirectory())found.push(...await listAssets(join(directory,entry.name),relative));
    else if(/\.(?:js|css|wasm|ttf|woff2?|png|jpe?g|wav)$/.test(relative) && !relative.endsWith('/_worker.js'))found.push(relative);
  }
  return found;
};
const assets=await listAssets(out);
const revisionHash=createHash('sha256');
for(const asset of assets){revisionHash.update(asset);revisionHash.update(await readFile(join(out,asset)));}
const revision=revisionHash.digest('hex').slice(0,12);
const rootHtml=await readFile(join(out,'index.html'),'utf8');
const core=[...new Set(['/',...Array.from(rootHtml.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))"/g),m=>m[1]),...assets.filter(p=>p.endsWith('.wasm') || /\/worker-[^/]+\.js$/.test(p) || /Ionicons[^/]*\.ttf$/.test(p))])];
await writeFile(join(out,'sw.js'),createServiceWorker({revision,assets,core}));
// The homepage hero is discovered before the JavaScript app is ready.
await writeFile(join(out,'index.html'),rootHtml.replace('</head>','<link rel="preload" as="image" href="/media/serene-courtyard.jpg" fetchpriority="high"></head>'));
