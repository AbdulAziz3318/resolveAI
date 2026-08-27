import mongoose from 'mongoose';
import Shift from '../models/Shift.js';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'Invalid shift ID');
  }
}

function escapedName(name) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listShifts({
  includeInactive = false,
} = {}) {
  const filter = includeInactive
    ? {}
    : { isActive: true };

  return Shift.find(filter).sort({
    startTime: 1,
    name: 1,
  });
}

export async function createShift(input) {
  const name = input.name?.trim();

  if (!name) {
    throw createError(400, 'Shift name is required');
  }

  if (!input.startTime || !input.endTime) {
    throw createError(
      400,
      'Shift start time and end time are required',
    );
  }

  const duplicate = await Shift.exists({
    name: {
      $regex: `^${escapedName(name)}$`,
      $options: 'i',
    },
  });

  if (duplicate) {
    throw createError(409, 'Shift already exists');
  }

  return Shift.create({
    name,
    startTime: input.startTime,
    endTime: input.endTime,
    workingDays: input.workingDays || [],
    isActive: input.isActive ?? true,
  });
}

export async function updateShift(id, input) {
  validateId(id);

  const shift = await Shift.findById(id);

  if (!shift) {
    throw createError(404, 'Shift not found');
  }

  const allowedFields = [
    'name',
    'startTime',
    'endTime',
    'workingDays',
    'isActive',
  ];

  for (const field of allowedFields) {
    if (input[field] !== undefined) {
      shift[field] = input[field];
    }
  }

  await shift.save();

  return shift;
}
export async function deleteShift(id) {
  validateId(id);

  const assignedUser = await User.exists({
    shift: id,
  });

  if (assignedUser) {
    throw createError(
      409,
      'Shift cannot be deleted while assigned to users',
    );
  }

  const shift = await Shift.findByIdAndDelete(id);

  if (!shift) {
    throw createError(404, 'Shift not found');
  }
}