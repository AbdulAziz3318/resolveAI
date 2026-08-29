import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

// Temporarily retained for legacy endpoints still awaiting migration.
export function notificationPayload(
  user,
  type,
  title,
  message,
  complaint,
  assignment,
) {
  return {
    user:
      typeof user === 'string'
        ? user
        : user?._id,
    type,
    title,
    message,
    complaint,
    assignment,
    isRead: false,
    createdAt: new Date(),
  };
}

export async function listNotifications(
  userId,
) {
  return Notification.find({
    user: userId,
  })
    .populate(
      'complaint',
      'complaintId title status priority',
    )
    .populate(
      'assignment',
      'status acceptanceDeadline',
    )
    .sort({ createdAt: -1 });
}

export async function markNotificationRead(
  userId,
  notificationId,
) {
  if (
    !mongoose.isValidObjectId(notificationId)
  ) {
    return null;
  }

  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId,
    },
    {
      $set: {
        isRead: true,
      },
    },
    {
      new: true,
    },
  );
}

export async function markAllNotificationsRead(
  userId,
) {
  const result = await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    },
  );

  return {
    modifiedCount: result.modifiedCount,
  };
}