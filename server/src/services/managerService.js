import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import Escalation from '../models/Escalation.js';
import User from '../models/User.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getManagerDepartment(managerId) {
  const manager = await User.findOne({
    _id: managerId,
    role: 'MANAGER',
    isActive: true,
  }).populate('department', 'name');

  if (!manager) {
    throw createError(404, 'Manager not found');
  }

  if (!manager.department) {
    throw createError(
      409,
      'Manager has no assigned department',
    );
  }

  return {
    manager,
    departmentId: manager.department._id,
  };
}

export async function getManagerDashboard(
  managerId,
) {
  const { manager, departmentId } =
    await getManagerDepartment(managerId);

  const complaints = await Complaint.find({
    department: departmentId,
  })
    .populate('createdBy', 'name email')
    .populate(
      'assignedWorker',
      'name employeeId availability',
    )
    .sort({ updatedAt: -1 });

  const complaintIds = complaints.map(
    (complaint) => complaint._id,
  );

  const [workers, escalations] =
    await Promise.all([
      User.find({
        role: 'WORKER',
        department: departmentId,
        isActive: true,
      })
        .select('-password')
        .populate('shift', 'name startTime endTime')
        .populate(
          'assignedLocations',
          'name type',
        )
        .sort({ name: 1 }),

      Escalation.find({
        complaint: {
          $in: complaintIds,
        },
      })
        .populate(
          'complaint',
          'complaintId title priority status',
        )
        .populate(
          'escalatedTo',
          'name email role',
        )
        .sort({ createdAt: -1 }),
    ]);

  const statistics = {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(
      (complaint) =>
        !['CLOSED', 'CANCELLED'].includes(
          complaint.status,
        ),
    ).length,
    criticalComplaints: complaints.filter(
      (complaint) =>
        complaint.priority === 'CRITICAL' &&
        !['CLOSED', 'CANCELLED'].includes(
          complaint.status,
        ),
    ).length,
    escalatedComplaints: complaints.filter(
      (complaint) =>
        complaint.status === 'ESCALATED',
    ).length,
    activeWorkers: workers.length,
    availableWorkers: workers.filter(
      (worker) =>
        worker.availability === 'AVAILABLE',
    ).length,
    openEscalations: escalations.filter(
      (escalation) =>
        escalation.status === 'OPEN',
    ).length,
  };

  return {
    manager,
    statistics,
    complaints,
    workers,
    escalations,
  };
}

export async function listManagerEscalations(
  managerId,
) {
  const { departmentId } =
    await getManagerDepartment(managerId);

  const complaintIds = await Complaint.find({
    department: departmentId,
  }).distinct('_id');

  return Escalation.find({
    complaint: {
      $in: complaintIds,
    },
  })
    .populate(
      'complaint',
      'complaintId title priority status location',
    )
    .populate(
      'escalatedTo',
      'name email role',
    )
    .sort({ createdAt: -1 });
}

export async function acknowledgeEscalation({
  escalationId,
  managerId,
}) {
  if (
    !mongoose.isValidObjectId(escalationId)
  ) {
    throw createError(
      400,
      'Invalid escalation ID',
    );
  }

  const { departmentId } =
    await getManagerDepartment(managerId);

  const escalation =
    await Escalation.findById(
      escalationId,
    ).populate('complaint');

  if (!escalation?.complaint) {
    throw createError(
      404,
      'Escalation not found',
    );
  }

  if (
    String(escalation.complaint.department) !==
    String(departmentId)
  ) {
    throw createError(
      403,
      'Escalation belongs to another department',
    );
  }

  if (escalation.status === 'RESOLVED') {
    throw createError(
      409,
      'Resolved escalation cannot be acknowledged',
    );
  }

  escalation.status = 'ACKNOWLEDGED';
  escalation.acknowledgedAt = new Date();
  escalation.escalatedTo = managerId;

  await escalation.save();

  return Escalation.findById(
    escalation._id,
  )
    .populate(
      'complaint',
      'complaintId title priority status location',
    )
    .populate(
      'escalatedTo',
      'name email role',
    );
}