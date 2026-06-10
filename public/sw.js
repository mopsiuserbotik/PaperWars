const CACHE_NAME = "paper-wars-shell-v8";
const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/client.js",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/sfx/attack.mp3",
  "/sfx/drone.mp3",
  "/sfx/drone_run.mp3",
  "/sfx/d_house.mp3",
  "/sfx/d_tehnika.mp3",
  "/sfx/fail.mp3",
  "/sfx/kreyser.mp3",
  "/sfx/money.mp3",
  "/sfx/osechka.mp3",
  "/sfx/pvo.mp3",
  "/sfx/rain.mp3",
  "/sfx/raketa.mp3",
  "/sfx/rpg.mp3",
  "/sfx/rszo.mp3",
  "/sfx/rszo_hit.mp3",
  "/sfx/rszo_shot.mp3",
  "/sfx/shahed.mp3",
  "/sfx/soyuz.mp3",
  "/sfx/stroyka.mp3",
  "/sfx/tank.mp3",
  "/sfx/tank_shot.mp3",
  "/sfx/war.mp3",
  "/sfx/win.mp3",
  "/sfx/yaderka.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.match("/").then((response) => response || caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
