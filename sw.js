const CACHE_NAME = 1
const urlsToCache = ['/sw-demo/dist']
// const reqExt = 'html,js,css,png'

self.addEventListener('message', event => {
  console.log('skipWaiting')
  if (event.data === 'skipWaiting') self.skipWaiting()
})

self.addEventListener('install', event => {
  console.log('call install')
  // self.skipWaiting()

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', function (event) {
  // const url = event.request.url
  // const i = url.lastIndexOf('.')
  // const ext = url.substr(i + 1)
  // console.log(url)
  // if (!reqExt.includes(ext) || !url.includes('http')) {
  //   event.respondWith(fetch(event.request))
  //   return
  // }

  event.respondWith(
    caches.match(event.request).then(function (resp) {
      return (
        resp ||
        fetch(event.request).then(function (response) {
          return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, response.clone())
            return response
          })
        })
      )
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('activate')

  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
