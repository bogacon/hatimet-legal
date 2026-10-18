import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../worker/index.mjs';
const env={ASSETS:{fetch:async(request)=>new URL(request.url).pathname === '/'?new Response('<html>application</html>',{headers:{'Content-Type':'text/html'}}):new Response('missing',{status:404})}};
test('application deep links receive the SQLite isolation headers and noindex',async()=>{const r=await handleRequest(new Request('https://hatimet.net/join/token'),env);assert.equal(r.status,200);assert.equal(r.headers.get('Cross-Origin-Opener-Policy'),'same-origin');assert.equal(r.headers.get('Cross-Origin-Embedder-Policy'),'require-corp');assert.match(await r.text(),/application/);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');});
test('only district IDs can reach the fixed upstream',async()=>{for(const path of ['https://evil.test','12abc','../secrets','1234?url=evil']){const r=await handleRequest(new Request('https://hatimet.net/api/prayer/'+encodeURIComponent(path)),env,()=>assert.fail('Upstream called for invalid input'));assert.equal(r.status,400);}});
test('upstream failures do not look like successful calendar data',async()=>{const r=await handleRequest(new Request('https://hatimet.net/api/prayer/9541'),env,async()=>new Response('no',{status:503}));assert.equal(r.status,502);});
test('upstream HTML is served as text and has a bounded cache lifetime',async()=>{const r=await handleRequest(new Request('https://hatimet.net/api/prayer/9541'),env,async(url)=>{assert.equal(url,'https://namazvakitleri.diyanet.gov.tr/tr-TR/9541/x-icin-namaz-vakti');return new Response('<script>unsafe()</script>');});assert.equal(r.headers.get('Content-Type'),'text/plain; charset=utf-8');assert.equal(r.headers.get('Cache-Control'),'public, max-age=1800');});
test('unknown content remains a real 404',async()=>{const r=await handleRequest(new Request('https://hatimet.net/missing'),env);assert.equal(r.status,404);});
test('reject writes',async()=>{assert.equal((await handleRequest(new Request('https://hatimet.net/',{method:'POST'}),env)).status,405);});

test('microphone and speech recognition are blocked on reader and app pages',async()=>{for(const path of ['/reader','/quran','/sign-in']){const r=await handleRequest(new Request('https://hatimet.net'+path),env);assert.match(r.headers.get('Permissions-Policy'),/microphone=\(\)/);assert.match(r.headers.get('Permissions-Policy'),/on-device-speech-recognition=\(\)/);}});

test('public URL variants converge on the same HTTPS apex canonical while retaining query values',async()=>{
 for(const [input,expected] of [
  ['http://www.hatimet.net/kuran/index.html?source=search','https://hatimet.net/kuran/?source=search'],
  ['https://hatimet.net/kuran/1-fatiha-suresi.html','https://hatimet.net/kuran/1-fatiha-suresi/'],
  ['https://hatimet.net/hatim-takibi','https://hatimet.net/hatim-takibi/'],
  ['https://hatimet.net/index.html','https://hatimet.net/'],
 ]){const r=await handleRequest(new Request(input),env);assert.equal(r.status,301,input);assert.equal(r.headers.get('Location'),expected,input);}
});
test('application routes retain their original path and noindex, without canonical redirects',async()=>{const r=await handleRequest(new Request('https://hatimet.net/reader?surah=1&ayah=7'),env);assert.equal(r.status,200);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');});

test('Google verification HTML is served directly despite Pages clean URL normalization',async()=>{
 const assets={ASSETS:{fetch:async request=>{const path=new URL(request.url).pathname;return path.endsWith('.html')?Response.redirect('https://hatimet.net/google24b7eeb02389a427',308):new Response('google-site-verification: google24b7eeb02389a427.html');}}};
 const r=await handleRequest(new Request('https://hatimet.net/google24b7eeb02389a427.html'),assets);assert.equal(r.status,200);assert.match(await r.text(),/^google-site-verification:/);assert.equal(r.headers.get('X-Robots-Tag'),'noindex, follow');
});
