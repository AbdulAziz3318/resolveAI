import mongoose from 'mongoose';

const escalationSchema =
  new mongoose.Schema(
    {
      complaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
        index: true,
      },

      level: {
        type: String,
        enum: [
          'LEVEL_1',
          'LEVEL_2',
          'LEVEL_3',
        ],
        default: 'LEVEL_1',
      },

      reason: {
        type: String,
        required: true,
        trim: true,
      },

      escalatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },

      acknowledgedAt: Date,
      resolvedAt: Date,

      status: {
        type: String,
        enum: [
          'OPEN',
          'ACKNOWLEDGED',
          'RESOLVED',
        ],
        default: 'OPEN',
        index: true,
      },
    },
    {
      timestamps: true,
    },
  );

export default
  mongoose.models.Escalation ||
  mongoose.model(
    'Escalation',
    escalationSchema,
  );