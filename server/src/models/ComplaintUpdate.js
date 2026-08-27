import mongoose from 'mongoose';

const complaintUpdateSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        'STATUS',
        'COMMENT',
        'SYSTEM',
        'PROGRESS',
        'RESOLUTION',
      ],
      default: 'STATUS',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ComplaintUpdate ||
  mongoose.model('ComplaintUpdate', complaintUpdateSchema);