import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authenticate(request, response, next) {
  try {
    const authorization = request.headers.authorization || '';

    if (!authorization.startsWith('Bearer ')) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      return next(error);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required');
    }

    const token = authorization.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      const error = new Error('Account is unavailable');
      error.statusCode = 401;
      return next(error);
    }

    request.auth = payload;
    request.user = user;

    return next();
  } catch (originalError) {
    if (originalError.statusCode) {
      return next(originalError);
    }

    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    return next(error);
  }
}