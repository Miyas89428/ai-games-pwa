
const CACHE_NAME = "ai-games-v1";

const OFFLINE_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./games/game1.html",
  "./games/game2.html"
];

// 安裝時下載所有必要檔案
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(OFFLINE_FILES);
      await self.skipWaiting();
    })()
  );
});

// 啟用新版並清除舊快取
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// 優先使用已儲存的檔案
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;

      return fetch(event.request);
    })()
  );
});
