export function prepareAdsense(config) {
  if (!config.enabled) return { head: '', placement: '', adsTxt: '# AdSense is not active. No publisher account is connected.\n' };
  if (!/^ca-pub-\d{16}$/.test(config.publisherId || '')) throw new Error('A real AdSense publisher ID is required.');
  if (!/^\d{10}$/.test(config.contentSlotId || '')) throw new Error('A real content ad unit slot ID is required.');
  if (config.cmpReady !== true) throw new Error('Configure and verify a Google-certified CMP before activating ads.');
  return {
    head: `<meta name="google-adsense-account" content="${config.publisherId}"><script src="/adsense.js" defer data-publisher="${config.publisherId}"></script>`,
    placement: `<aside class="ad-placement" aria-label="Reklam"><span>Reklam</span><ins class="adsbygoogle" style="display:block" data-ad-client="${config.publisherId}" data-ad-slot="${config.contentSlotId}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside>`,
    adsTxt: `google.com, ${config.publisherId.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`,
  };
}
