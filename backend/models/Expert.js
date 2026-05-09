const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
}, { _id: false });

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Tech', 'Business', 'Health', 'Finance', 'Legal', 'Design'],
    required: true
  },
  experience: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  bio: { type: String, required: true },
  avatar: { type: String },
  availableSlots: [slotSchema]
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
