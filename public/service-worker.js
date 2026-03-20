const CACHE_NAME = 'pos-cache-v1';

const urlsToCache = [
  '/',
  '/index.php?page=pos',
  '/assets/css/style.css',
  '/assets/js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});