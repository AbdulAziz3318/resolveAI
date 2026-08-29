import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Location from '../models/Location.js';
import Shift from '../models/Shift.js';
import User from '../models/User.js';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

await mongoose.connect(process.env.MONGODB_URI);

const department =
  (await Department.findOne({
    name: /maintenance/i,
  })) ||
  (await Department.create({
    name: 'Maintenance',
    description:
      'Electrical, plumbing and facility maintenance',
    supportedCategories: [
      'ELECTRICAL',
      'PLUMBING',
      'FACILITY',
    ],
    defaultSlaHours: {
      LOW: 48,
      MEDIUM: 24,
      HIGH: 8,
      CRITICAL: 2,
    },
    isActive: true,
  }));

const shift =
  (await Shift.findOne({
    name: /morning/i,
  })) ||
  (await Shift.create({
    name: 'Morning Shift',
    startTime: '00:00',
    endTime: '23:59',
    workingDays: [
      'SUN',
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
    ],
    isActive: true,
  }));

const location =
  (await Location.findOne({
    name: 'Block A',
  })) ||
  (await Location.create({
    name: 'Block A',
    type: 'BUILDING',
    description: 'Main campus block',
    isActive: true,
  }));

const accounts = [
  {
    name: 'ResolveAI Administrator',
    email: 'admin@resolveai.demo',
    password: 'Admin@123',
    role: 'ADMIN',
  },
  {
    name: 'Maintenance Manager',
    email: 'manager@resolveai.demo',
    password: 'Manager@123',
    role: 'MANAGER',
    department: department._id,
  },
  {
    name: 'Demo Worker',
    email: 'worker@resolveai.demo',
    password: 'Worker@123',
    role: 'WORKER',
    employeeId: 'DEMO-WORKER-001',
    department: department._id,
    shift: shift._id,
    assignedLocations: [location._id],
    skills: [
      'Electrical',
      'Wiring',
      'Lighting',
    ],
    availability: 'AVAILABLE',
    maxActiveJobs: 5,
    averageRating: 5,
completedComplaints: 25,
  },
  {
    name: 'Demo Resident',
    email: 'user@resolveai.demo',
    password: 'User@123',
    role: 'USER',
  },
];

for (const account of accounts) {
  const password = await bcrypt.hash(
    account.password,
    12,
  );

  await User.findOneAndUpdate(
    {
      email: account.email,
    },
    {
      $set: {
        ...account,
        password,
        isActive: true,
        mustChangePassword: false,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  console.log(
    `Ready: ${account.role} ${account.email}`,
  );
}

await mongoose.disconnect();

console.log('Demo accounts seeded successfully');