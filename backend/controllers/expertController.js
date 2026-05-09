const Expert = require('../models/Expert');

const getExperts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const { category, search } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .select('-availableSlots')
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      experts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) {
      const err = new Error('Expert not found');
      err.status = 404;
      return next(err);
    }
    res.json(expert);
  } catch (err) {
    next(err);
  }
};

module.exports = { getExperts, getExpertById };
