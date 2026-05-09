const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getBookingsByEmail } = require('../controllers/bookingController');
const { validateBooking, validateStatusUpdate } = require('../middleware/validate');

router.get('/', getBookingsByEmail);
router.post('/', validateBooking, createBooking);
router.patch('/:id/status', validateStatusUpdate, updateBookingStatus);

module.exports = router;
