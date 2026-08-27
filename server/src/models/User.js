import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ['USER', 'WORKER', 'MANAGER', 'ADMIN'],
      default: 'USER',
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    assignedLocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],

    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
    },

    availability: {
      type: String,
      enum: [
        'AVAILABLE',
        'ASSIGNED',
        'BUSY',
        'ON_BREAK',
        'OFF_DUTY',
        'LEAVE',
        'INACTIVE',
      ],
      default: 'AVAILABLE',
    },

    maxActiveJobs: {
      type: Number,
      min: 0,
      default: 0,
    },

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    completedComplaints: {
      type: Number,
      min: 0,
      default: 0,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model('User', userSchema);