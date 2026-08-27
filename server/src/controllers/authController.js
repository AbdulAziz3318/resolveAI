import {
  changeUserPassword,
  loginUser,
  registerUser,
  sanitizeUser,
} from '../services/authService.js';

function validateRequiredFields(body, fields) {
  for (const field of fields) {
    if (!body[field] || String(body[field]).trim() === '') {
      const error = new Error(`${field} is required`);
      error.statusCode = 400;
      throw error;
    }
  }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    const error = new Error('Password must be at least 8 characters');
    error.statusCode = 400;
    throw error;
  }
}

export const authController = {
  async register(request, response, next) {
    try {
      validateRequiredFields(request.body, [
        'name',
        'email',
        'password',
      ]);

      validatePassword(request.body.password);

      const data = await registerUser(request.body);

      return response.status(201).json({
        success: true,
        message: 'Account created successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  async login(request, response, next) {
    try {
      validateRequiredFields(request.body, [
        'email',
        'password',
      ]);

      const data = await loginUser(request.body);

      return response.json({
        success: true,
        message: 'Login successful',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  async me(request, response) {
    return response.json({
      success: true,
      message: 'Current user',
      data: sanitizeUser(request.user),
    });
  },

  async changePassword(request, response, next) {
    try {
      validateRequiredFields(request.body, [
        'currentPassword',
        'newPassword',
      ]);

      validatePassword(request.body.newPassword);

      await changeUserPassword(
        request.user._id,
        request.body.currentPassword,
        request.body.newPassword,
      );

      return response.json({
        success: true,
        message: 'Password updated successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
};