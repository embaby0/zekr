const CACHE_NAME = "static_cache"
const STATIC_ASSETS = [
  '/index.html',
  '/main-page.css'
]

async function preCache() {
  const cache = await caches.open(CACHE_NAME)
  return cache.addAll(STATIC_ASSETS)
}

self.addEventListener('install', event => {
  console.log("[SW] installed");
  event.waitUntil(preCache())
})

self.addEventListener('activate', event => {
  console.log("[SW] activated");
})

async function fetchAssets(event) {
  try {
    const response = await fetch(event.request)
    return response
  } catch (err) {
    const cache = await caches.open(CACHE_NAME)
    return cache.match(event.request)
  }
}

self.addEventListener('fetch', event => {
  console.log("[SW] fetched");
  event.respondWith(fetchAssets(event))
})

