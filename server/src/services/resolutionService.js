import mongoose from 'mongoose';
import Assignment from '../models/Assignment.js';
import AutomationLog from '../models/AutomationLog.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { assignBestWorker } from './assignmentService.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function complaintIdentity(id) {
  return {
    $or: [
      { complaintId: id },
      ...(mongoose.isValidObjectId(id)
        ? [{ _id: id }]
        : []),
    ],
  };
}

async function findOwnedComplaint(id, userId) {
  const complaint = await Complaint.findOne({
    ...complaintIdentity(id),
    createdBy: userId,
  });

  if (!complaint) {
    throw createError(404, 'Complaint not found');
  }

  return complaint;
}

function populatedComplaint(query) {
  return query
    .populate('createdBy', 'name email')
    .populate('department', 'name')
    .populate(
      'assignedWorker',
      'name employeeId email availability',
    );
}

export async function confirmResolution({
  complaintId,
  userId,
  rating,
  feedback,
}) {
  const complaint = await findOwnedComplaint(
    complaintId,
    userId,
  );

  if (
    complaint.status !==
    'AWAITING_CONFIRMATION'
  ) {
    throw createError(
      409,
      'Complaint is not awaiting confirmation',
    );
  }

  const numericRating =
    rating === undefined ||
    rating === null ||
    rating === ''
      ? null
      : Number(rating);

  if (
    numericRating !== null &&
    (!Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5)
  ) {
    throw createError(
      400,
      'Rating must be an integer from 1 to 5',
    );
  }

  complaint.status = 'CLOSED';
  complaint.closedAt = new Date();

  if (numericRating !== null) {
    complaint.userRating = numericRating;
  }

  if (typeof feedback === 'string') {
    complaint.userFeedback = feedback.trim();
  }

  await complaint.save();

  if (complaint.assignedWorker) {
    const worker = await User.findById(
      complaint.assignedWorker,
    );

    if (worker) {
      const previousCompleted =
        worker.completedComplaints || 0;

      if (numericRating !== null) {
        worker.averageRating =
          Math.round(
            ((
              (worker.averageRating || 0) *
                previousCompleted +
              numericRating
            ) /
              (previousCompleted + 1)) *
              100,
          ) / 100;
      }

      worker.completedComplaints =
        previousCompleted + 1;

      await worker.save();

      await Notification.create({
        user: worker._id,
        type: 'STATUS_UPDATE',
        title: 'Resolution confirmed',
        message:
          `${complaint.complaintId} was confirmed and closed.`,
        complaint: complaint._id,
        isRead: false,
      });
    }
  }

  await AutomationLog.create({
    action: 'COMPLAINT_CLOSED',
    complaint: complaint._id,
    user: userId,
    message:
      'User confirmed the resolution',
    metadata: {
      rating: numericRating,
      feedback: complaint.userFeedback,
    },
  });

  return populatedComplaint(
    Complaint.findById(complaint._id),
  );
}

export async function reopenResolution({
  complaintId,
  userId,
  reason,
}) {
  if (
    typeof reason !== 'string' ||
    !reason.trim()
  ) {
    throw createError(
      400,
      'Reopen reason is required',
    );
  }

  const complaint = await findOwnedComplaint(
    complaintId,
    userId,
  );

  if (
    complaint.status !==
    'AWAITING_CONFIRMATION'
  ) {
    throw createError(
      409,
      'Only a complaint awaiting confirmation can be reopened',
    );
  }

  const previousWorker =
    complaint.assignedWorker;

  const previousAssignment =
    await Assignment.findOne({
      complaint: complaint._id,
    }).sort({ createdAt: -1 });

  complaint.status = 'REOPENED';
  complaint.reopenReason = reason.trim();
  complaint.assignedWorker = null;

  await complaint.save();

  await AutomationLog.create({
    action: 'RESOLUTION_REJECTED',
    complaint: complaint._id,
    assignment: previousAssignment?._id,
    user: userId,
    message:
      'User rejected the submitted resolution',
    metadata: {
      reason: complaint.reopenReason,
    },
  });

  const excludedWorkerIds = previousWorker
    ? [previousWorker]
    : [];

  const nextAttempt =
    (previousAssignment?.reassignmentAttempt ||
      0) + 1;

  const replacement = await assignBestWorker(
    complaint._id,
    excludedWorkerIds,
    nextAttempt,
  );

  const updatedComplaint =
    await populatedComplaint(
      Complaint.findById(complaint._id),
    );

  return {
    complaint: updatedComplaint,
    outcome: replacement
      ? 'REASSIGNED'
      : 'ESCALATED',
    replacementAssignment: replacement,
  };
}