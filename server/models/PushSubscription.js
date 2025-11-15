const mongoose = require('mongoose');

const PushSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
}, {
  timestamps: true,
});

const PushSubscription = mongoose.model('PushSubscription', PushSubscriptionSchema);

module.exports = PushSubscription;
