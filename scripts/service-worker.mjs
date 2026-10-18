// Precache only the opening workspace. Other screens and illustrations enter
// the offline cache when used, instead of competing with the first page load.
export function createServiceWorker({revision,assets,core}) {
 return `const CACHE='hatimet-web-${revision}';const FILES=${JSON.stringify(assets)};const CORE=${JSON.stringify(core)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('hatimet-web-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname==='/auth-callback'||url.pathname==='/sign-in'||url.pathname==='/reset-password')return;
if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(response=>response||caches.match('/')).then(response=>response||Response.error())));return;}
if(FILES.includes(url.pathname))event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;})));});
`;
}
