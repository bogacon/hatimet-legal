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
