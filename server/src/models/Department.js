import mongoose from 'mongoose';

const complaintCategories = [
  'ELECTRICAL',
  'PLUMBING',
  'WATER',
  'NETWORK',
  'CLEANING',
  'SECURITY',
  'INFRASTRUCTURE',
  'IT_SUPPORT',
  'EQUIPMENT',
  'OTHER',
];

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    supportedCategories: [
      {
        type: String,
        enum: complaintCategories,
      },
    ],

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    defaultSlaHours: {
      LOW: {
        type: Number,
        min: 1,
        default: 72,
      },
      MEDIUM: {
        type: Number,
        min: 1,
        default: 24,
      },
      HIGH: {
        type: Number,
        min: 1,
        default: 8,
      },
      CRITICAL: {
        type: Number,
        min: 1,
        default: 2,
      },
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

export default mongoose.models.Department ||
  mongoose.model('Department', departmentSchema);