import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {createServiceWorker} from '../scripts/service-worker.mjs';
function worker(){
 const events={},stored=new Map(),downloads=[],pending=[];
 const key=r=>typeof r==='string'?r:r.url;
 const cache={addAll:async paths=>downloads.push(...paths),put:async(r,v)=>stored.set(key(r),v)};
 const caches={open:async()=>cache,keys:async()=>[],match:async r=>stored.get(key(r)),delete:async()=>true};
 runInNewContext(createServiceWorker({revision:'test',core:['/','/entry.js'],assets:['/entry.js','/reader.js','/media/hatim.jpg']}),{self:{location:{origin:'https://hatimet.net'},addEventListener:(n,f)=>events[n]=f},caches,URL,Response,fetch:async r=>{downloads.push(key(r));return new Response('content');}});
 return {events,stored,downloads,pending};
}
test('installation does not fetch unvisited screens and illustrations',async()=>{const w=worker();let done;w.events.install({waitUntil:p=>done=p});await done;assert.deepEqual(w.downloads,['/','/entry.js']);});
test('a visited screen asset is cached once and available for the next request',async()=>{const w=worker();const request={url:'https://hatimet.net/reader.js',method:'GET',mode:'cors'};let response;const fire=()=>w.events.fetch({request,respondWith:p=>response=p,waitUntil:p=>w.pending.push(p)});fire();assert.equal(await(await response).text(),'content');await Promise.all(w.pending);fire();assert.equal(await(await response).text(),'content');assert.deepEqual(w.downloads,[request.url]);});
test('authentication and API requests bypass the offline cache',()=>{const w=worker();for(const path of ['/auth-callback?code=secret','/sign-in','/reset-password','/api/prayer/9541'])w.events.fetch({request:{url:'https://hatimet.net'+path,method:'GET',mode:'navigate'},respondWith:()=>assert.fail('Sensitive request intercepted')});assert.deepEqual(w.downloads,[]);});
