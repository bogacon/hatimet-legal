import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareAdsense } from '../scripts/adsense.mjs';
test('unconnected AdSense emits no account, placement or Google request',()=>{
 const ads=prepareAdsense({enabled:false});assert.equal(ads.head,'');assert.equal(ads.placement,'');assert.ok(!ads.adsTxt.includes('DIRECT'));
});
test('activation fails without real identifiers and a verified CMP',()=>{
 assert.throws(()=>prepareAdsense({enabled:true}));
 assert.throws(()=>prepareAdsense({enabled:true,publisherId:'ca-pub-1234567890123456',contentSlotId:'1234567890'}),/CMP/);
 const ads=prepareAdsense({enabled:true,publisherId:'ca-pub-1234567890123456',contentSlotId:'1234567890',cmpReady:true});
 assert.match(ads.adsTxt,/pub-1234567890123456, DIRECT/);assert.match(ads.placement,/aria-label="Reklam"/);
});

test('site ownership can be verified before ad slots and consent integration are activated',()=>{
 const ads=prepareAdsense({enabled:false,publisherId:'ca-pub-1234567890123456'});
 assert.match(ads.verificationHead,/google-adsense-account/);
 assert.equal(ads.head,ads.verificationHead);assert.equal(ads.placement,'');
 assert.ok(!ads.head.includes('<script'));assert.match(ads.adsTxt,/pub-1234567890123456, DIRECT/);
 assert.throws(()=>prepareAdsense({enabled:false,publisherId:'fake'}));
});

test('account connection embeds the supplied async snippet after pausing requests, without activating placements',()=>{
 const ads=prepareAdsense({enabled:false,publisherId:'ca-pub-2026830697384470',connectScript:true,cmpReady:false});
 assert.match(ads.head,/<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-2026830697384470" crossorigin="anonymous"><\/script>/);
 assert.ok(ads.head.indexOf('pauseAdRequests=1')<ads.head.indexOf('<script async'));
 assert.equal((ads.head.match(/adsbygoogle\.js/g)||[]).length,1);
 assert.equal(ads.placement,'');
 assert.equal(ads.adsTxt,'google.com, pub-2026830697384470, DIRECT, f08c47fec0942fa0\n');
 assert.throws(()=>prepareAdsense({connectScript:true}),/publisher/);
});
