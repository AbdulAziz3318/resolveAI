import mongoose from 'mongoose';

const notificationSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      type: {
        type: String,
        required: true,
        trim: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      complaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
      },

      assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
      },

      isRead: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    },
  );

notificationSchema.index({
  user: 1,
  createdAt: -1,
});

export default
  mongoose.models.Notification ||
  mongoose.model(
    'Notification',
    notificationSchema,
  );