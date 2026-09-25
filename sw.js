/* BoxSheet service worker: keeps the whole app, including the PDF engine, on the device. */
var CACHE = 'boxsheet-v2';
var SHELL = ['./', './index.html', './manifest.json', './sw.js',
             './vendor/jspdf.umd.min.js',
             './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png',
             './privacy.html'];

// cache each file on its own, so one missing file cannot stop the rest
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, {cache: 'reload'})).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // the PDF engine: always answer from the cache, ignoring any ?r= cache-buster
  if (url.pathname.indexOf('/vendor/jspdf') !== -1) {
    e.respondWith(
      caches.match('./vendor/jspdf.umd.min.js', {ignoreSearch: true}).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('./vendor/jspdf.umd.min.js', copy); });
          return res;
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        }
        return res;
      }).catch(function () {
        return req.mode === 'navigate' ? caches.match('./index.html') : Response.error();
      });
    })
  );
});
