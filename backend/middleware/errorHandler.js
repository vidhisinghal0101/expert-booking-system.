const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${status} - ${message}`);
  if (err.stack) console.error(err.stack);

  res.status(status).json({ message, status });
};

module.exports = errorHandler;
