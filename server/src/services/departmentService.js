import mongoose from 'mongoose';
import Department from '../models/Department.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'Invalid department ID');
  }
}

export async function listDepartments({
  includeInactive = false,
} = {}) {
  const filter = includeInactive
    ? {}
    : { isActive: true };

  return Department.find(filter)
    .populate('manager', 'name email role')
    .sort({ name: 1 });
}

export async function createDepartment(input) {
  const name = input.name?.trim();

  if (!name) {
    throw createError(400, 'Department name is required');
  }

  const duplicate = await Department.exists({
    name: {
      $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      $options: 'i',
    },
  });

  if (duplicate) {
    throw createError(409, 'Department already exists');
  }

  return Department.create({
    name,
    description: input.description?.trim() || '',
    supportedCategories: input.supportedCategories || [],
    manager: input.manager || null,
    defaultSlaHours: input.defaultSlaHours,
    isActive: input.isActive ?? true,
  });
}

export async function updateDepartment(id, input) {
  validateId(id);

  const allowedFields = [
    'name',
    'description',
    'supportedCategories',
    'manager',
    'defaultSlaHours',
    'isActive',
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (input[field] !== undefined) {
      updates[field] = input[field];
    }
  }

  const department = await Department.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!department) {
    throw createError(404, 'Department not found');
  }

  return department;
}