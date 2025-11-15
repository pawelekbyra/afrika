// public/sw.js

self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Otrzymano powiadomienie push:', data);

  const options = {
    body: data.body,
    icon: data.icon || '/vite.svg',
    badge: '/vite.svg'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
