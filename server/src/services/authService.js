import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

export function sanitizeUser(user) {
  const result = user.toObject ? user.toObject() : { ...user };
  delete result.password;
  return result;
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '2d',
    },
  );
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await User.exists({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: passwordHash,
    role: 'USER',
    isActive: true,
  });

  return {
    user: sanitizeUser(user),
    token: createToken(user),
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({
    email: normalizeEmail(email),
  }).select('+password');

  if (!user || !user.isActive) {
    throw createError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw createError(401, 'Invalid email or password');
  }

  return {
    user: sanitizeUser(user),
    token: createToken(user),
  };
}

export async function changeUserPassword(
  userId,
  currentPassword,
  newPassword,
) {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw createError(404, 'User not found');
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!passwordMatches) {
    throw createError(400, 'Current password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.mustChangePassword = false;

  await user.save();
}