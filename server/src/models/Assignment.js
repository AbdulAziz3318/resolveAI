import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    assignmentScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    scoreBreakdown: {
      skill: {
        type: Number,
        required: true,
      },
      availability: {
        type: Number,
        required: true,
      },
      workload: {
        type: Number,
        required: true,
      },
      performance: {
        type: Number,
        required: true,
      },
      location: {
        type: Number,
        required: true,
      },
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    acceptanceDeadline: {
      type: Date,
      required: true,
    },

    acceptedAt: Date,
    expiredAt: Date,
    completedAt: Date,

    reassignmentAttempt: {
      type: Number,
      min: 0,
      default: 0,
    },

    rejectedAt: Date,

rejectionReason: {
  type: String,
  trim: true,
  maxlength: 500,
},

    status: {
      type: String,
      enum: [
        'PENDING_ACCEPTANCE',
        'ACCEPTED',
        'EXPIRED',
        'REASSIGNED',
        'COMPLETED',
        'CANCELLED',
        'REJECTED',
      ],
      default: 'PENDING_ACCEPTANCE',
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Assignment ||
  mongoose.model('Assignment', assignmentSchema);