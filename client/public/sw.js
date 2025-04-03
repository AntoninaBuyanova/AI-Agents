// Service Worker для перехвата и модификации заголовков

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

// Перехват ответов и модификация заголовков
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Создаем новый объект Response с модифицированными заголовками
        const newHeaders = new Headers(response.headers);
        
        // Удаляем блокирующие X-Robots-Tag заголовки
        if (newHeaders.has('x-robots-tag')) {
          const originalValue = newHeaders.get('x-robots-tag');
          console.log('Original X-Robots-Tag:', originalValue);
          
          // Если заголовок содержит noindex или none, заменяем его
          if (originalValue.includes('noindex') || originalValue.includes('none')) {
            newHeaders.set('x-robots-tag', 'index, follow');
            console.log('Modified X-Robots-Tag to: index, follow');
          }
        } else {
          // Если заголовка нет, добавляем его
          newHeaders.set('x-robots-tag', 'index, follow');
          console.log('Added X-Robots-Tag: index, follow');
        }
        
        // Возвращаем новый ответ с модифицированными заголовками
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      })
      .catch(error => {
        console.error('Service Worker fetch error:', error);
        // В случае ошибки просто возвращаем оригинальный запрос
        return fetch(event.request);
      })
  );
}); 