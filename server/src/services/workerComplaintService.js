import Assignment from '../models/Assignment.js';
import AutomationLog from '../models/AutomationLog.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
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

async function findWorkerComplaint(
  complaintId,
  workerId,
) {
  const complaint = await Complaint.findOne({
    complaintId,
    assignedWorker: workerId,
  });

  if (!complaint) {
    throw createError(
      404,
      'Assigned complaint not found',
    );
  }

  return complaint;
}

export async function startAssignedWork({
  complaintId,
  workerId,
}) {
  const complaint = await findWorkerComplaint(
    complaintId,
    workerId,
  );

  if (complaint.status !== 'ACCEPTED') {
    throw createError(
      409,
      'Only an accepted complaint can be started',
    );
  }

  complaint.status = 'IN_PROGRESS';
  complaint.startedAt = new Date();

  await complaint.save();

  await AutomationLog.create({
    action: 'WORK_STARTED',
    complaint: complaint._id,
    user: workerId,
    message: 'Assigned worker started work',
    metadata: {
      startedAt: complaint.startedAt,
    },
  });

  return populatedComplaint(
    Complaint.findById(complaint._id),
  );
}

export async function resolveAssignedWork({
  complaintId,
  workerId,
  resolutionNote,
}) {
  if (
    typeof resolutionNote !== 'string' ||
    !resolutionNote.trim()
  ) {
    throw createError(
      400,
      'Resolution note is required',
    );
  }

  const complaint = await findWorkerComplaint(
    complaintId,
    workerId,
  );

  if (complaint.status !== 'IN_PROGRESS') {
    throw createError(
      409,
      'Only an in-progress complaint can be resolved',
    );
  }

  complaint.status = 'AWAITING_CONFIRMATION';
  complaint.resolutionNote =
    resolutionNote.trim();
  complaint.resolvedAt = new Date();

  await complaint.save();

  await Assignment.findOneAndUpdate(
    {
      complaint: complaint._id,
      worker: workerId,
      status: 'ACCEPTED',
    },
    {
      $set: {
        status: 'COMPLETED',
        completedAt: complaint.resolvedAt,
      },
    },
  );

  const remainingActiveAssignments =
    await Assignment.countDocuments({
      worker: workerId,
      status: {
        $in: [
          'PENDING_ACCEPTANCE',
          'ACCEPTED',
        ],
      },
    });

  await User.findByIdAndUpdate(workerId, {
    availability:
      remainingActiveAssignments > 0
        ? 'ASSIGNED'
        : 'AVAILABLE',
  });

  if (complaint.createdBy) {
    await Notification.create({
      user: complaint.createdBy,
      type: 'RESOLUTION',
      title: 'Resolution ready for confirmation',
      message:
        `${complaint.complaintId} is ready for your review.`,
      complaint: complaint._id,
      isRead: false,
    });
  }

  await AutomationLog.create({
    action: 'RESOLUTION_SUBMITTED',
    complaint: complaint._id,
    user: workerId,
    message:
      'Worker submitted complaint resolution',
    metadata: {
      resolutionNote:
        complaint.resolutionNote,
      resolvedAt: complaint.resolvedAt,
    },
  });

  return populatedComplaint(
    Complaint.findById(complaint._id),
  );
}