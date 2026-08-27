import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Location from '../models/Location.js';
import Shift from '../models/Shift.js';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id, label) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, `Invalid ${label} ID`);
  }
}

function publicUser(user) {
  const result = user.toObject ? user.toObject() : { ...user };
  delete result.password;
  return result;
}

async function validateReferences({
  department,
  shift,
  assignedLocations = [],
}) {
  validateId(department, 'department');
  validateId(shift, 'shift');

  const [departmentExists, shiftExists] = await Promise.all([
    Department.exists({ _id: department, isActive: true }),
    Shift.exists({ _id: shift, isActive: true }),
  ]);

  if (!departmentExists) {
    throw createError(400, 'Department does not exist or is inactive');
  }

  if (!shiftExists) {
    throw createError(400, 'Shift does not exist or is inactive');
  }

  for (const locationId of assignedLocations) {
    validateId(locationId, 'location');
  }

  if (assignedLocations.length) {
    const locationCount = await Location.countDocuments({
      _id: { $in: assignedLocations },
      isActive: true,
    });

    if (locationCount !== new Set(assignedLocations).size) {
      throw createError(
        400,
        'One or more locations do not exist or are inactive',
      );
    }
  }
}

export async function listWorkers(filter = {}) {
  const query = {
    role: 'WORKER',
  };

  if (filter.department) {
    validateId(filter.department, 'department');
    query.department = filter.department;
  }

  if (filter.isActive !== undefined) {
    query.isActive = filter.isActive;
  }

  return User.find(query)
    .populate('department', 'name')
    .populate('shift', 'name startTime endTime')
    .populate('assignedLocations', 'name type')
    .sort({ name: 1 });
}

export async function getWorker(id) {
  validateId(id, 'worker');

  const worker = await User.findOne({
    _id: id,
    role: 'WORKER',
  })
    .populate('department', 'name')
    .populate('shift', 'name startTime endTime')
    .populate('assignedLocations', 'name type');

  if (!worker) {
    throw createError(404, 'Worker not found');
  }

  return worker;
}

export async function createWorker(input) {
  const requiredFields = [
    'name',
    'employeeId',
    'email',
    'phone',
    'department',
    'shift',
    'temporaryPassword',
  ];

  for (const field of requiredFields) {
    if (!input[field] || String(input[field]).trim() === '') {
      throw createError(400, `${field} is required`);
    }
  }

  if (input.temporaryPassword.length < 8) {
    throw createError(
      400,
      'Temporary password must be at least 8 characters',
    );
  }

  await validateReferences(input);

  const email = input.email.trim().toLowerCase();
  const employeeId = input.employeeId.trim();

  const duplicate = await User.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (duplicate) {
    throw createError(
      409,
      duplicate.email === email
        ? 'Email already exists'
        : 'Employee ID already exists',
    );
  }

  const worker = await User.create({
    name: input.name.trim(),
    employeeId,
    email,
    phone: input.phone.trim(),
    password: await bcrypt.hash(input.temporaryPassword, 12),
    role: 'WORKER',
    department: input.department,
    skills: input.skills || [],
    assignedLocations: [
      ...new Set(input.assignedLocations || []),
    ],
    shift: input.shift,
    availability: input.availability || 'AVAILABLE',
    maxActiveJobs: input.maxActiveJobs ?? 4,
    mustChangePassword: true,
    isActive: true,
  });

  return publicUser(worker);
}

export async function updateWorker(id, input) {
  validateId(id, 'worker');

  const worker = await User.findOne({
    _id: id,
    role: 'WORKER',
  });

  if (!worker) {
    throw createError(404, 'Worker not found');
  }

  if (
    input.department ||
    input.shift ||
    input.assignedLocations
  ) {
    await validateReferences({
      department: input.department || worker.department,
      shift: input.shift || worker.shift,
      assignedLocations:
        input.assignedLocations || worker.assignedLocations,
    });
  }

  const allowedFields = [
    'name',
    'employeeId',
    'email',
    'phone',
    'department',
    'skills',
    'assignedLocations',
    'shift',
    'availability',
    'maxActiveJobs',
  ];

  for (const field of allowedFields) {
    if (input[field] !== undefined) {
      worker[field] = input[field];
    }
  }

  await worker.save();

  return publicUser(worker);
}

export async function setWorkerStatus(id, isActive) {
  validateId(id, 'worker');

  const worker = await User.findOne({
    _id: id,
    role: 'WORKER',
  });

  if (!worker) {
    throw createError(404, 'Worker not found');
  }

  worker.isActive = Boolean(isActive);
  worker.availability = worker.isActive
    ? 'AVAILABLE'
    : 'INACTIVE';

  await worker.save();

  return publicUser(worker);
}

export async function resetWorkerPassword(id, temporaryPassword) {
  validateId(id, 'worker');

  if (
    typeof temporaryPassword !== 'string' ||
    temporaryPassword.length < 8
  ) {
    throw createError(
      400,
      'Temporary password must be at least 8 characters',
    );
  }

  const worker = await User.findOne({
    _id: id,
    role: 'WORKER',
  }).select('+password');

  if (!worker) {
    throw createError(404, 'Worker not found');
  }

  worker.password = await bcrypt.hash(temporaryPassword, 12);
  worker.mustChangePassword = true;

  await worker.save();
}

export async function listManagers() {
  return User.find({
    role: 'MANAGER',
  })
    .populate('department', 'name')
    .sort({ name: 1 });
}

export async function createManager(input) {
  const requiredFields = [
    'name',
    'employeeId',
    'email',
    'phone',
    'department',
    'temporaryPassword',
  ];

  for (const field of requiredFields) {
    if (!input[field] || String(input[field]).trim() === '') {
      throw createError(400, `${field} is required`);
    }
  }

  if (input.temporaryPassword.length < 8) {
    throw createError(
      400,
      'Temporary password must be at least 8 characters',
    );
  }

  validateId(input.department, 'department');

  const department = await Department.findOne({
    _id: input.department,
    isActive: true,
  });

  if (!department) {
    throw createError(
      400,
      'Department does not exist or is inactive',
    );
  }

  const email = input.email.trim().toLowerCase();
  const employeeId = input.employeeId.trim();

  const duplicate = await User.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (duplicate) {
    throw createError(
      409,
      duplicate.email === email
        ? 'Email already exists'
        : 'Employee ID already exists',
    );
  }

  const manager = await User.create({
    name: input.name.trim(),
    employeeId,
    email,
    phone: input.phone.trim(),
    password: await bcrypt.hash(
      input.temporaryPassword,
      12,
    ),
    role: 'MANAGER',
    department: department._id,
    availability: 'AVAILABLE',
    maxActiveJobs: 0,
    mustChangePassword: true,
    isActive: true,
  });

  department.manager = manager._id;
  await department.save();

  return publicUser(manager);
}