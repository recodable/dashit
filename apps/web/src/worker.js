const cacheName = "v1";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll([]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open(cacheName).then((cache) => {
      return cache.match(e.request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(e.request).then((response) => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
