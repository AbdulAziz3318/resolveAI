import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    imageUrl: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      enum: [
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
      ],
      default: 'OTHER',
    },

    subCategory: {
      type: String,
      default: '',
    },

    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
    },

    priorityScore: {
      type: Number,
      min: 0,
      default: 0,
    },

    priorityReason: {
      type: String,
      default: '',
    },

    location: {
      building: {
        type: String,
        required: true,
        trim: true,
      },
      floor: {
        type: String,
        trim: true,
        default: '',
      },
      room: {
        type: String,
        trim: true,
        default: '',
      },
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'ANALYZING',
        'ASSIGNED',
        'AWAITING_ACCEPTANCE',
        'ACCEPTED',
        'IN_PROGRESS',
        'RESOLVED',
        'AWAITING_CONFIRMATION',
        'CLOSED',
        'REOPENED',
        'ESCALATED',
        'REJECTED',
        'CANCELLED',
      ],
      default: 'SUBMITTED',
      index: true,
    },

    aiAnalysis: {
      source: String,
      summary: String,
      sentiment: String,
      keywords: [String],
      confidence: Number,
    },

    possibleDuplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },

    duplicateConfidence: {
      type: Number,
      default: 0,
    },

    masterIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterIncident',
      default: null,
    },

    slaDeadline: Date,
    slaBreached: {
      type: Boolean,
      default: false,
    },
    slaWarningSent: {
      type: Boolean,
      default: false,
    },

    startedAt: Date,
    resolutionNote: String,
    resolvedAt: Date,
    closedAt: Date,
    userRating: Number,
    userFeedback: String,
    reopenReason: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Complaint ||
  mongoose.model('Complaint', complaintSchema);