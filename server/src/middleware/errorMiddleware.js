export function errorMiddleware(
  error,
  request,
  response,
  next,
) {
  console.error(error);

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.code === 11000) {
    return response.status(409).json({
      success: false,
      message: 'A record with that value already exists',
    });
  }

  return response.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : 'Internal server error',
  });
}