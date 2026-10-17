export function prepareAdsense(config) {
  const publisher = config.publisherId || '';
  if (publisher && !/^ca-pub-\d{16}$/.test(publisher)) throw new Error('A real AdSense publisher ID is required.');
  if (config.connectScript && !publisher) throw new Error('A real AdSense publisher ID is required.');
  const verificationMeta = publisher ? `<meta name="google-adsense-account" content="${publisher}">` : '';
  // Google documents pauseAdRequests for connecting a site before consent/ad
  // serving is ready. The async account snippet remains crawlable in <head>.
  const connectionCode = config.connectScript ? `<script>window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.pauseAdRequests=1;</script><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}" crossorigin="anonymous"></script>` : '';
  const verificationHead = verificationMeta + connectionCode;
  const adsTxt = publisher ? `google.com, ${publisher.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n` : '# AdSense is not active. No publisher account is connected.\n';
  if (!config.enabled) return { head: verificationHead, verificationHead, verificationMeta, placement: '', adsTxt };
  if (!publisher) throw new Error('A real AdSense publisher ID is required.');
  if (!/^\d{10}$/.test(config.contentSlotId || '')) throw new Error('A real content ad unit slot ID is required.');
  if (config.cmpReady !== true) throw new Error('Configure and verify a Google-certified CMP before activating ads.');
  return {
    verificationHead,
    verificationMeta,
    head: `${verificationMeta}<script src="/adsense.js" defer data-publisher="${config.publisherId}"></script>`,
    placement: `<aside class="ad-placement" aria-label="Reklam"><span>Reklam</span><ins class="adsbygoogle" style="display:block" data-ad-client="${config.publisherId}" data-ad-slot="${config.contentSlotId}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside>`,
    adsTxt: `google.com, ${config.publisherId.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`,
  };
}
