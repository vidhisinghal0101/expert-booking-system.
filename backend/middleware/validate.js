const validateBooking = (req, res, next) => {
  const { expertId, userName, email, phone, date, timeSlot } = req.body;
  const errors = [];

  if (!expertId) errors.push('expertId is required');
  if (!userName || userName.trim() === '') errors.push('userName is required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
  if (!phone || !/^\d{10}$/.test(phone)) errors.push('Phone must be a 10-digit number');
  if (!date) errors.push('date is required');
  if (!timeSlot) errors.push('timeSlot is required');

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  next();
};

module.exports = { validateBooking, validateStatusUpdate };
