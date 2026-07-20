// Conservative shell worker: precaches the offline page and icons, and
// serves the offline page when a navigation can't reach the network.
// Deliberately NO data caching — the logbook is live ink; a stale page
// claiming today isn't sealed would be worse than a candle-lit pause.

const CACHE = "logbook-shell-v1";
const SHELL = ["/offline.html", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(url.pathname).then((hit) => hit ?? fetch(req)),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/offline.html")),
    );
  }
});
