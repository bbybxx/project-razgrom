// Service Worker для PWA
const CACHE_NAME = 'razgrom-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/js/fun.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap'
];

// Установка Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем кешированную версию если доступна
        if (response) {
          return response;
        }
        
        // Иначе делаем сетевой запрос
        return fetch(event.request).then(function(response) {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонируем ответ для кеша
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(function() {
          // Показываем оффлайн страницу при ошибке сети
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Очистка старых кешей
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
