import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function seedAdmin() {
  const {
    MONGODB_URI,
    ADMIN_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
  } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required',
    );
  }

  if (ADMIN_PASSWORD.length < 12) {
    throw new Error(
      'ADMIN_PASSWORD must be at least 12 characters',
    );
  }

  await mongoose.connect(MONGODB_URI);

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: ADMIN_NAME.trim(),
        email,
        password,
        role: 'ADMIN',
        isActive: true,
        mustChangePassword: false,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log(`Admin account ready: ${admin.email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(`Admin seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });