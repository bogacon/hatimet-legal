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
