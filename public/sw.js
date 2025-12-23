/**
 * Service Worker para cache offline
 */

const CACHE_NAME = "devtoolkit-v1";
const RUNTIME_CACHE = "devtoolkit-runtime-v1";

// Archivos a cachear en la instalación
const STATIC_CACHE_URLS = [
  "/",
  "/tools/json-formatter",
  "/tools/base64",
  "/manifest.json",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Estrategia: Network First, fallback a Cache
self.addEventListener("fetch", (event) => {
  // Solo cachear requests GET
  if (event.request.method !== "GET") {
    return;
  }

  // No cachear requests a APIs externas
  if (event.request.url.startsWith("http") && !event.request.url.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar la respuesta para cachearla
        const responseToCache = response.clone();

        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Si no hay en cache, devolver página offline
          if (event.request.destination === "document") {
            return caches.match("/");
          }

          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});

// Mensajes del cliente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.delete(CACHE_NAME);
    caches.delete(RUNTIME_CACHE);
  }
});

