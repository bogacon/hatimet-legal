/* The Google-certified CMP integration must dispatch this event only when its
   current, region-appropriate consent decision permits loading Google ads.
   No CMP response means no ad request. This is not a consent-management platform. */
(() => {
  const publisher = document.currentScript?.dataset.publisher;
  if (!/^ca-pub-\d{16}$/.test(publisher || '')) return;
  let loaded = false;
  window.addEventListener('hatimet:ads-permitted', () => {
    if (loaded) return;
    loaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`;
    script.onload = () => document.querySelectorAll('ins.adsbygoogle').forEach(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
    document.head.append(script);
  }, { once: true });
})();
