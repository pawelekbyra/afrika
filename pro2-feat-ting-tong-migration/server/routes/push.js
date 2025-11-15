const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const auth = require('../middleware/auth');

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidPublicKey,
  vapidPrivateKey
);

// Na razie przechowujemy subskrypcje w pamięci. W docelowej aplikacji powinny być w bazie danych.
let subscriptions = [];

// POST /api/push/subscribe - Subskrypcja powiadomień
router.post('/subscribe', auth, (req, res) => {
  const subscription = req.body;

  // Prosta walidacja
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  // Dodaj subskrypcję do naszej "bazy danych"
  // W realnej aplikacji powiąż subskrypcję z req.user.id
  console.log('Otrzymano subskrypcję:', subscription);
  subscriptions.push(subscription);

  res.status(201).json({ message: 'Subscription successful' });
});

// POST /api/push/send - Wyślij powiadomienie do wszystkich subskrybentów (do celów testowych)
router.post('/send', auth, (req, res) => {
  const payload = JSON.stringify({
    title: req.body.title || 'Nowe powiadomienie!',
    body: req.body.body || 'Masz nową wiadomość od Ting Tong.',
    icon: '/vite.svg', // Opcjonalnie: URL do ikony
  });

  console.log('Wysyłanie powiadomienia do', subscriptions.length, 'subskrybentów');

  const sendPromises = subscriptions.map(sub =>
    webpush.sendNotification(sub, payload).catch(err => {
      console.error('Błąd wysyłania powiadomienia:', err);
      // Jeśli subskrypcja wygasła (kod 410), usuń ją
      if (err.statusCode === 410) {
        subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
      }
    })
  );

  Promise.all(sendPromises)
    .then(() => res.json({ message: 'Powiadomienia wysłane.' }))
    .catch(err => {
      console.error('Błąd podczas wysyłania powiadomień:', err);
      res.status(500).send('Błąd serwera');
    });
});

module.exports = router;
