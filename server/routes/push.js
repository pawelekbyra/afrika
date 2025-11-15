const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const auth = require('../middleware/auth');
const PushSubscription = require('../models/PushSubscription');

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidPublicKey,
  vapidPrivateKey
);

// POST /api/push/subscribe - Subskrypcja powiadomień
router.post('/subscribe', auth, async (req, res) => {
  const subscription = req.body;

  try {
    // Sprawdź, czy subskrypcja już istnieje
    const existingSubscription = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (existingSubscription) {
      return res.status(200).json({ message: 'Subscription already exists' });
    }

    // Utwórz nową subskrypcję
    await PushSubscription.create({
      user: req.user.id,
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Błąd podczas subskrypcji:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/push/send - Wyślij powiadomienie do wszystkich subskrybentów (do celów testowych)
router.post('/send', auth, async (req, res) => {
  try {
    const subscriptions = await PushSubscription.find();

    const payload = JSON.stringify({
      title: req.body.title || 'Nowe powiadomienie!',
      body: req.body.body || 'Masz nową wiadomość od Ting Tong.',
      icon: '/vite.svg',
    });

    const sendPromises = subscriptions.map(sub =>
      webpush.sendNotification(sub.toObject(), payload).catch(async (err) => {
        if (err.statusCode === 410) {
          // Jeśli subskrypcja wygasła, usuń ją z bazy danych
          await PushSubscription.deleteOne({ _id: sub._id });
        } else {
          console.error('Błąd wysyłania powiadomienia:', err);
        }
      })
    );

    await Promise.all(sendPromises);
    res.json({ message: 'Powiadomienia wysłane.' });
  } catch (error) {
    console.error('Błąd podczas wysyłania powiadomień:', error);
    res.status(500).send('Błąd serwera');
  }
});

module.exports = router;
