const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  expertName: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
