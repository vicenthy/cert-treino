// Service worker: cache do app inteiro para funcionar offline.
// Ao mudar qualquer arquivo, incremente VERSION para os aparelhos baixarem a nova versão.
const VERSION = "dva-treino-v4";
const FILES = [
  "./", "index.html", "styles.css", "app.js", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png",
  "data/exam.js", "data/q-d1.js", "data/q-d2.js", "data/q-d3.js", "data/q-d4.js", "data/q-lote2.js", "data/q-lote3.js", "data/compare.js", "data/gen.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Rede primeiro (pega atualizações quando online), cache como fallback offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
