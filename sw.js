/* BoxSheet service worker: app shell cached so the tool works with no network. */
var CACHE = 'boxsheet-v1';
var SHELL = ['./', './index.html', './manifest.json', './vendor/jspdf.umd.min.js',
             './icons/icon-192.png', './icons/icon-512.png', './privacy.html'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (hit) {
    if (hit) return hit;
    return fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function(){});
      return res;
    }).catch(function () { return caches.match('./index.html'); });
  }));
});
