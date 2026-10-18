import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
const root='dist';
const meta=(html,name)=>html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1];
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
test('all canonical public URLs have a unique Turkish title, description and a matching self canonical',async()=>{
 const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);const titles=new Set(),descriptions=new Set();
 assert.equal(urls.length,192);assert.equal(new Set(urls).size,urls.length);
 for(const url of urls){const path=new URL(url).pathname;const html=await readFile(join(root,path==='/'?'index.html':path+'index.html'),'utf8');
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];assert.ok(title&&title.length>10,url);assert.ok(!titles.has(title),'Duplicate title: '+url);titles.add(title);
  const description=meta(html,'description');assert.ok(description&&description.length>45,url);assert.ok(!descriptions.has(description),'Duplicate description: '+url);descriptions.add(description);
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"\s*\/?>/)?.[1],url,url);assert.match(html,/<html\s+lang="tr(?:-TR)?"/);assert.ok(!/noindex/.test(meta(html,'robots')||''),url);
 }
});
test('public content breadcrumbs match visible navigation and catalog lists contain actual source URLs',async()=>{
 const inventory=JSON.parse(await readFile(join(root,'seo-inventory.json'),'utf8'));
 for(const p of inventory.filter(p=>p.indexable)){
  const html=await readFile(join(root,p.path+'index.html'),'utf8');const ld=schemas(html);const breadcrumb=ld.find(x=>x['@type']==='BreadcrumbList');assert.ok(breadcrumb,p.path);
  assert.equal(breadcrumb.itemListElement.at(-1).item,p.canonical);assert.equal(breadcrumb.itemListElement[0].item,'https://hatimet.net/');
  for(const [i,item] of breadcrumb.itemListElement.entries()){assert.equal(item.position,i+1);assert.ok(item.name);}
 }
 for(const [path,count] of [['kuran',114],['dualar',54]]){
  const ld=schemas(await readFile(join(root,path,'index.html'),'utf8'));const collection=ld.find(x=>x['@type']==='CollectionPage');assert.equal(collection.mainEntity.numberOfItems,count);assert.equal(collection.mainEntity.itemListElement.length,count);
 }
});
test('homepage includes the same crawlable resource content before JavaScript and in the dashboard bundle',async()=>{
 const html=await readFile(join(root,'index.html'),'utf8');assert.equal((html.match(/<title\b/g)||[]).length,1);assert.match(html,/id="hatimet-public-content"/);assert.match(html,/Kur’an okuma, hatim takibi ve Türkiye namaz vakitleri/);
 for(const path of ['/kuran/','/hatim-takibi/','/namaz-vakitleri/','/kuran-okuma-rehberi/'])assert.ok(html.includes(`href="${path}"`),path);
 const ld=schemas(html);assert.ok(ld.some(x=>x['@type']==='WebSite'));assert.ok(ld.some(x=>x['@type']==='Organization'));
 assert.ok(html.includes('html,body,#root{height:100%'));assert.ok(html.includes('overflow:auto!important'));
});
test('Turkey prayer directory has 81 official province links without invented daily times or location doorway pages',async()=>{
 const html=await readFile(join(root,'namaz-vakitleri/index.html'),'utf8');const links=[...html.matchAll(/href="(https:\/\/namazvakitleri\.diyanet\.gov\.tr\/tr-TR\/\d+\/[^\"]+)"/g)];assert.equal(links.length,81);assert.equal(new Set(links.map(m=>m[1])).size,81);assert.match(html,/yaklaşık/);
 for(const path of ['hatim-takibi','kuran-okuma-rehberi']){const guide=await readFile(join(root,path,'index.html'),'utf8');assert.ok(guide.length>6000);assert.ok(schemas(guide).some(x=>x['@type']==='Article'));}
});
