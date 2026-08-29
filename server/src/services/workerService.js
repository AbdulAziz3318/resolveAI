import Assignment from '../models/Assignment.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function getWorkerDashboard(
  workerId,
) {
  const worker = await User.findOne({
    _id: workerId,
    role: 'WORKER',
    isActive: true,
  })
    .select('-password')
    .populate('department', 'name')
    .populate('shift', 'name startTime endTime')
    .populate(
      'assignedLocations',
      'name type',
    );

  if (!worker) {
    throw createError(404, 'Worker not found');
  }

  const [complaints, assignments, notifications] =
    await Promise.all([
      Complaint.find({
        assignedWorker: workerId,
      })
        .populate('createdBy', 'name email')
        .populate(
  'assignedWorker',
  'name employeeId email availability',
)
        .populate('department', 'name')
        .sort({ updatedAt: -1 }),

      Assignment.find({
        worker: workerId,
      })
        .populate(
          'complaint',
          'complaintId title category priority status location',
        )
        .sort({ createdAt: -1 }),

      Notification.find({
        user: workerId,
      })
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

  const statistics = {
    totalAssigned: assignments.length,
    pendingAcceptance:
      assignments.filter(
        (item) =>
          item.status ===
          'PENDING_ACCEPTANCE',
      ).length,
    activeJobs:
      complaints.filter((item) =>
        ['ACCEPTED', 'IN_PROGRESS'].includes(
          item.status,
        ),
      ).length,
    awaitingConfirmation:
      complaints.filter(
        (item) =>
          item.status ===
          'AWAITING_CONFIRMATION',
      ).length,
    completed:
      assignments.filter(
        (item) => item.status === 'COMPLETED',
      ).length,
  };

  return {
    worker,
    statistics,
    complaints,
    assignments,
    notifications,
  };
}

export async function updateWorkerAvailability(
  workerId,
  availability,
) {
  const allowed = [
    'AVAILABLE',
    'BUSY',
    'ON_BREAK',
    'OFF_DUTY',
    'LEAVE',
  ];

  if (!allowed.includes(availability)) {
    throw createError(
      400,
      `Availability must be one of: ${allowed.join(', ')}`,
    );
  }

  const worker = await User.findOneAndUpdate(
    {
      _id: workerId,
      role: 'WORKER',
      isActive: true,
    },
    {
      $set: {
        availability,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select('-password');

  if (!worker) {
    throw createError(404, 'Worker not found');
  }

  return worker;
}