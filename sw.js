/* CH Inspector — service worker. App-shell cache so the tool opens & runs offline on-site.
   Inspections + photos live in IndexedDB (not here). Network is only needed for AI extraction. */
const CACHE = 'ch-inspector-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/coin_gold.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache or intercept the Anthropic API — always go to network.
  if (url.hostname.endsWith('anthropic.com')) return;
  if (e.request.method !== 'GET') return;
  // App shell + same-origin assets: cache-first, fall back to network, update cache.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then((hit) =>
        hit || fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return res;
        }).catch(() => caches.match('./index.html'))
      )
    );
  }
});
