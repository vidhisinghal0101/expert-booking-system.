const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { emitSlotBooked, getIO } = require('../socket/socketManager');

const createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

    // Atomically mark the slot as booked only if it's currently available
    const expert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        availableSlots: {
          $elemMatch: { date: date, time: timeSlot, isBooked: false }
        }
      },
      {
        $set: { 'availableSlots.$[slot].isBooked': true }
      },
      {
        arrayFilters: [{ 'slot.date': date, 'slot.time': timeSlot, 'slot.isBooked': false }],
        new: true
      }
    );

    if (!expert) {
      return res.status(409).json({ message: 'Slot already booked or not found' });
    }

    const booking = await Booking.create({
      expertId,
      expertName: expert.name,
      userName,
      email,
      phone,
      date,
      timeSlot,
      notes: notes || '',
      status: 'Pending'
    });

    // Emit real-time socket event
    const io = getIO();
    if (io) {
      emitSlotBooked(io, expertId, date, timeSlot);
    }

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      const err = new Error('Booking not found');
      err.status = 404;
      return next(err);
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const bookings = await Booking.find({ email })
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, updateBookingStatus, getBookingsByEmail };
