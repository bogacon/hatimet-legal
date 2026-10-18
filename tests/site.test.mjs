import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
const out=resolve('dist');
const walk=async(dir)=>{const paths=[];for(const e of await readdir(dir,{withFileTypes:true})){if(e.isDirectory())paths.push(...await walk(join(dir,e.name)));else paths.push(join(dir,e.name));}return paths;};
test('all published internal links and script/style assets resolve',async()=>{
 const broken=[];
 for(const file of (await walk(out)).filter((file)=>file.endsWith('.html'))){
  const html=await readFile(file,'utf8');
  for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
   if(!match[1].startsWith('/')||match[1].startsWith('//'))continue;
   const path=new URL(match[1].replaceAll('&amp;','&'),'https://hatimet.net').pathname;
   if(['/privacy.html','/support.html'].includes(path))continue;
   const destination=join(out,decodeURIComponent(path));
   let exists=false;for(const candidate of [destination,join(destination,'index.html'),destination+'.html'])try{if((await stat(candidate)).isFile())exists=true;}catch{}
   if(!exists&& !/^\/(?:reader|join|group|dua|religious-day|prayer-guide|dua-category)\//.test(path))broken.push([file,path]);
  }
 }
 assert.deepEqual(broken,[]);
});
test('sitemap contains exactly 114 surahs and 54 dua pages and only canonical public URLs',async()=>{
 const sitemap=await readFile(join(out,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/\/kuran\/\d+-/g)||[]).length,114);assert.equal((sitemap.match(/\/dualar\/[a-z]/g)||[]).length,54);assert.ok(!/\/profile|\/sign-in|\/join\//.test(sitemap));
});
test('website root uses the interactive dashboard and has no application-opening gate',async()=>{
 const root=await readFile(join(out,'index.html'),'utf8');assert.match(root,/_expo\/static\/js/);assert.ok(!root.includes('Uygulamayı aç'));assert.match(root,/lang="tr"/);
});

test('connected account is crawlable on the homepage and editorial content while account pages have no ad tag',async()=>{
 const config=JSON.parse(await readFile('config/adsense.json','utf8'));
 if(!config.connectScript)return;
 for(const path of ['index.html','kuran/index.html','kuran/1-fatiha-suresi/index.html','kullanim-rehberi/index.html','iletisim/index.html','cerez-politikasi/index.html']){
  const html=await readFile(join(out,path),'utf8');const head=html.split('</head>')[0];
  assert.ok(head.includes('client='+config.publisherId),path);assert.ok(head.includes('pauseAdRequests=1'),path);
  assert.ok(!html.includes('<ins class="adsbygoogle"'),path);
 }
 for(const path of ['sign-in.html','auth-callback.html','reset-password.html','reader.html']){
  const html=await readFile(join(out,path),'utf8');assert.ok(!html.includes('pagead2.googlesyndication.com'),path);
 }
 assert.equal(await readFile(join(out,'ads.txt'),'utf8'),'google.com, pub-2026830697384470, DIRECT, f08c47fec0942fa0\n');
});
test('legal page navigation uses valid root paths from nested canonical URLs',async()=>{
 for(const path of ['gizlilik/index.html','destek/index.html']){
  const html=await readFile(join(out,path),'utf8');assert.match(html,/<a class="back" href="\/">/);
  assert.ok(!/href="(?:index|privacy)\.html"/.test(html));
 }
});
