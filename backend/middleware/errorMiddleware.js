const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  // call next() with error to trigger error handler
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // if status code is 200, set to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // set status code
  res.status(statusCode);
  // return error message
  res.json({
    message: message,
    // only show stack trace in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
