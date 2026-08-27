import mongoose from 'mongoose';
import Location from '../models/Location.js';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id, label = 'location') {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, `Invalid ${label} ID`);
  }
}

async function validateParent(parentLocation, currentId = null) {
  if (!parentLocation) {
    return null;
  }

  validateId(parentLocation, 'parent location');

  if (
    currentId &&
    parentLocation.toString() === currentId.toString()
  ) {
    throw createError(
      400,
      'A location cannot be its own parent',
    );
  }

  const parent = await Location.findById(parentLocation);

  if (!parent || !parent.isActive) {
    throw createError(
      400,
      'Parent location does not exist or is inactive',
    );
  }

  return parent._id;
}

export async function listLocations({
  includeInactive = false,
} = {}) {
  const filter = includeInactive
    ? {}
    : { isActive: true };

  return Location.find(filter)
    .populate('parentLocation', 'name type')
    .sort({
      type: 1,
      name: 1,
    });
}

export async function createLocation(input) {
  const name = input.name?.trim();

  if (!name) {
    throw createError(400, 'Location name is required');
  }

  const parentLocation = await validateParent(
    input.parentLocation,
  );

  const duplicate = await Location.exists({
    name,
    parentLocation,
  });

  if (duplicate) {
    throw createError(
      409,
      'Location already exists under this parent',
    );
  }

  return Location.create({
    name,
    type: input.type || 'BUILDING',
    parentLocation,
    description: input.description?.trim() || '',
    isActive: input.isActive ?? true,
  });
}

export async function updateLocation(id, input) {
  validateId(id);

  const location = await Location.findById(id);

  if (!location) {
    throw createError(404, 'Location not found');
  }

  const allowedFields = [
    'name',
    'type',
    'description',
    'isActive',
  ];

  for (const field of allowedFields) {
    if (input[field] !== undefined) {
      location[field] = input[field];
    }
  }

  if (input.parentLocation !== undefined) {
    location.parentLocation = await validateParent(
      input.parentLocation,
      location._id,
    );
  }

  await location.save();

  return location;
}

export async function deleteLocation(id) {
  validateId(id);

  const childExists = await Location.exists({
    parentLocation: id,
  });

  if (childExists) {
    throw createError(
      409,
      'Location cannot be deleted while it has child locations',
    );
  }

  const assignedUser = await User.exists({
    assignedLocations: id,
  });

  if (assignedUser) {
    throw createError(
      409,
      'Location cannot be deleted while assigned to users',
    );
  }

  const location = await Location.findByIdAndDelete(id);

  if (!location) {
    throw createError(404, 'Location not found');
  }
}