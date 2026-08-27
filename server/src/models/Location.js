import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        'CAMPUS',
        'ZONE',
        'BUILDING',
        'FLOOR',
        'ROOM',
        'OTHER',
      ],
      default: 'BUILDING',
    },

    parentLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },

    description: {
      type: String,
      trim: true,
      default: '',
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

locationSchema.index(
  {
    name: 1,
    parentLocation: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.models.Location ||
  mongoose.model('Location', locationSchema);