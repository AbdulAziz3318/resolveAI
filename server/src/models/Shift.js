import mongoose from 'mongoose';

const workingDays = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
];

const shiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },

    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },

    workingDays: [
      {
        type: String,
        enum: workingDays,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

shiftSchema.pre('validate', function validateTimes(next) {
  if (this.startTime === this.endTime) {
    return next(
      new Error('Shift start and end times must differ'),
    );
  }

  this.workingDays = [...new Set(this.workingDays)];

  return next();
});

export default mongoose.models.Shift ||
  mongoose.model('Shift', shiftSchema);