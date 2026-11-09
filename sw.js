// Areté – service worker: a saját fájlok (index, ikonok) offline is megvannak; az API-hívások mindig a hálózatra mennek
const C = 'arete-v1';
const FAJLOK = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FAJLOK)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // API, betűtípus: nem nyúlunk hozzá
  e.respondWith(fetch(e.request).then(r => { const m = r.clone(); caches.open(C).then(c => c.put(e.request, m)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
