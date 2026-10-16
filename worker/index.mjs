export function isApplicationPath(path) {
  return path === '/' || new Set(['quran','hatim','prayer','duas','zikirmatik','explore','qibla','prayer-journal','kaza','prayer-guide','imsakiye','religious-days','mosques','quiz','knowledge','baby-names','funeral','bookmarks','streak','leaderboard','profile','privacy','legal','sign-in','onboarding','reader','city-picker','auth-callback','reset-password','home-settings','prayer-settings','notification-settings','language','avatar','group','group-create','_sitemap','join','dua','dua-category','religious-day','(tabs)']).has(path.split('/')[1]);
}
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(self), accelerometer=(self), gyroscope=(self), magnetometer=(self), on-device-speech-recognition=(self)',
};
export function withHeaders(response, path) {
  const result = new Response(response.body, response);
  for (const [key, value] of Object.entries(securityHeaders)) result.headers.set(key, value);
  if (isApplicationPath(path)) {
    result.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    result.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    if (path !== '/') result.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  if (path.includes('/_expo/') || path.endsWith('.wasm')) result.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  else if (!path.startsWith('/api/')) result.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return result;
}

export async function handleRequest(request, env, fetchUpstream = fetch) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  if (url.hostname === 'www.hatimet.net') { url.hostname = 'hatimet.net'; return Response.redirect(url.href, 301); }
  if (url.pathname.startsWith('/api/prayer/')) {
    const id = url.pathname.slice('/api/prayer/'.length);
    if (!/^\d{4,6}$/.test(id)) return new Response('Invalid district', { status: 400 });
    try {
      const upstream = await fetchUpstream(`https://namazvakitleri.diyanet.gov.tr/tr-TR/${id}/x-icin-namaz-vakti`, {
        headers: { Accept: 'text/html', 'User-Agent': 'HatimEt/1.0 (+https://hatimet.net/support.html)' },
        signal: AbortSignal.timeout(8000), cf: { cacheTtl: 3600, cacheEverything: true },
      });
      if (!upstream.ok) return new Response('Prayer source unavailable', { status: 502 });
      // Supply upstream text, never execute upstream scripts in this origin.
      return new Response(request.method === 'HEAD' ? null : await upstream.text(), { headers: {
        'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=1800', ...securityHeaders,
      } });
    } catch { return new Response('Prayer source unavailable', { status: 502 }); }
  }
  if (url.pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
  if (url.pathname === '/privacy.html') return Response.redirect(`${url.origin}/gizlilik/`, 301);
  if (url.pathname === '/support.html') return Response.redirect(`${url.origin}/destek/`, 301);
  let response = await env.ASSETS.fetch(request);
  if (response.status === 404 && isApplicationPath(url.pathname) && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    // Dynamic invitations and content IDs must hydrate the Expo Router shell on refresh.
    const shell = new URL('/', url);
    response = await env.ASSETS.fetch(new Request(shell, { method: request.method }));
  }
  if (response.status === 404) {
    const page = await env.ASSETS.fetch(new Request(new URL('/404.html', url), { method: request.method }));
    response = new Response(page.body, { status: 404, headers: page.headers });
  }
  const result = withHeaders(response, url.pathname);
  if (url.hostname.endsWith('.pages.dev') || url.hostname.endsWith('.workers.dev')) result.headers.set('X-Robots-Tag', 'noindex, follow');
  return result;
}
export default { fetch: (request, env) => handleRequest(request, env) };
