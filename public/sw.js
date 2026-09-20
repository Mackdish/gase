const CACHE_NAME = "gas-shop-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Never cache API/auth requests. They must always reach the Worker.
  if (new URL(request.url).pathname.startsWith("/api/")) {
    return;
  }

  // Network-first for navigations so a previous server error can never be
  // permanently cached as the homepage.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then(
          (cached) => cached || new Response("Offline", { status: 503 })
        )
      )
    );
    return;
  }

  // Let Cloudflare/browser caching handle static assets normally.
});
