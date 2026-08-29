import Assignment from '../models/Assignment.js';
import AutomationLog from '../models/AutomationLog.js';
import Complaint from '../models/Complaint.js';
import Escalation from '../models/Escalation.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { isShiftActive } from '../utils/shiftUtils.js';

const activeAssignmentStatuses = [
  'PENDING_ACCEPTANCE',
  'ACCEPTED',
];

const availabilityScores = {
  AVAILABLE: 25,
  ASSIGNED: 18,
  BUSY: 8,
};

const relatedSkills = {
  ELECTRICAL: [
    'electrical',
    'wiring',
    'fan',
    'light',
    'switchboard',
    'power',
  ],
  PLUMBING: [
    'plumbing',
    'pipe',
    'leak',
    'tap',
    'drain',
  ],
  WATER: [
    'water',
    'purifier',
    'motor',
    'pump',
  ],
  NETWORK: [
    'network',
    'wifi',
    'router',
    'internet',
  ],
  IT_SUPPORT: [
    'computer',
    'software',
    'printer',
    'hardware',
  ],
  CLEANING: [
    'cleaning',
    'housekeeping',
    'waste',
  ],
  SECURITY: [
    'security',
    'cctv',
    'access control',
    'patrol',
  ],
  INFRASTRUCTURE: [
    'infrastructure',
    'carpentry',
    'masonry',
    'repair',
  ],
  EQUIPMENT: [
    'equipment',
    'machine',
    'device',
  ],
};

function normalize(value = '') {
  return value.trim().toLowerCase();
}

function calculateSkillScore(worker, complaint) {
  const workerSkills = worker.skills.map(normalize);

  const exactSignals = [
    normalize(complaint.category),
    normalize(complaint.subCategory),
  ].filter(Boolean);

  const exactMatch = workerSkills.some((skill) =>
    exactSignals.some(
      (signal) =>
        skill.includes(signal) ||
        signal.includes(skill),
    ),
  );

  if (exactMatch) {
    return 40;
  }

  const related =
    relatedSkills[complaint.category] || [];

  const relatedMatch = workerSkills.some((skill) =>
    related.some(
      (term) =>
        skill.includes(term) ||
        term.includes(skill),
    ),
  );

  return relatedMatch ? 25 : 0;
}

function calculateWorkloadScore(activeJobs) {
  if (activeJobs === 0) return 20;
  if (activeJobs <= 2) return 15;
  if (activeJobs <= 4) return 10;
  return 0;
}

function calculatePerformanceScore(rating) {
  if (!rating) return 5;

  return Math.round((rating / 5) * 10);
}

function calculateLocationScore(worker, complaint) {
  const complaintLocation = normalize(
    complaint.location?.building,
  );

  const exactMatch = worker.assignedLocations.some(
    (location) =>
      normalize(location.name) === complaintLocation,
  );

  return exactMatch ? 5 : 0;
}

async function scoreCandidate(worker, complaint) {
  if (!worker.isActive) return null;

  if (
    !['AVAILABLE', 'ASSIGNED', 'BUSY'].includes(
      worker.availability,
    )
  ) {
    return null;
  }

  if (!worker.shift || !isShiftActive(worker.shift)) {
    return null;
  }

  const activeJobs = await Assignment.countDocuments({
    worker: worker._id,
    status: {
      $in: activeAssignmentStatuses,
    },
  });

  if (activeJobs >= worker.maxActiveJobs) {
    return null;
  }

  const breakdown = {
    skill: calculateSkillScore(worker, complaint),
    availability:
      availabilityScores[worker.availability] || 0,
    workload: calculateWorkloadScore(activeJobs),
    performance: calculatePerformanceScore(
      worker.averageRating,
    ),
    location: calculateLocationScore(
      worker,
      complaint,
    ),
  };

  const assignmentScore = Object.values(
    breakdown,
  ).reduce((total, value) => total + value, 0);

  return {
    worker,
    activeJobs,
    assignmentScore,
    scoreBreakdown: breakdown,
  };
}

async function escalateNoWorker(complaint) {
  complaint.status = 'ESCALATED';
  complaint.assignedWorker = null;

  await complaint.save();

  await Escalation.findOneAndUpdate(
    {
      complaint: complaint._id,
      reason: 'No eligible worker available',
    },
    {
      $setOnInsert: {
        complaint: complaint._id,
        level: 'LEVEL_1',
        reason: 'No eligible worker available',
        status: 'OPEN',
        createdAt: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  await AutomationLog.create({
    action: 'ASSIGNMENT_FAILED',
    complaint: complaint._id,
    message:
      'Complaint escalated because no eligible worker was available',
    metadata: {
      department: complaint.department,
    },
  });

  return null;
}

export async function assignBestWorker(
  complaintId,
  excludedWorkerIds = [],
  reassignmentAttempt = 0,
) {
  const complaint = await Complaint.findById(
    complaintId,
  );

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  if (!complaint.department) {
    return escalateNoWorker(complaint);
  }

  const existingAssignment = await Assignment.findOne({
    complaint: complaint._id,
    status: {
      $in: activeAssignmentStatuses,
    },
  });

  if (existingAssignment) {
    return existingAssignment;
  }

  const workers = await User.find({
    role: 'WORKER',
    department: complaint.department,
    isActive: true,
    _id: {
      $nin: excludedWorkerIds,
    },
  })
    .populate('shift')
    .populate('assignedLocations', 'name type');

  const scoredCandidates = (
    await Promise.all(
      workers.map((worker) =>
        scoreCandidate(worker, complaint),
      ),
    )
  )
    .filter(Boolean)
    .sort((first, second) => {
      if (
        second.assignmentScore !==
        first.assignmentScore
      ) {
        return (
          second.assignmentScore -
          first.assignmentScore
        );
      }

      return first.activeJobs - second.activeJobs;
    });

  const selected = scoredCandidates[0];

  if (!selected) {
    return escalateNoWorker(complaint);
  }

  const acceptanceMinutes = Math.max(
    1,
    Number(
      process.env.ASSIGNMENT_ACCEPTANCE_MINUTES ||
        15,
    ),
  );

  const assignment = await Assignment.create({
    complaint: complaint._id,
    worker: selected.worker._id,
    assignmentScore: selected.assignmentScore,
    scoreBreakdown: selected.scoreBreakdown,
    assignedAt: new Date(),
    acceptanceDeadline: new Date(
      Date.now() + acceptanceMinutes * 60 * 1000,
    ),
    reassignmentAttempt,
    status: 'PENDING_ACCEPTANCE',
  });

  complaint.assignedWorker = selected.worker._id;
  complaint.status = 'AWAITING_ACCEPTANCE';

  await complaint.save();

  await Notification.create({
    user: selected.worker._id,
    type: 'ASSIGNMENT',
    title: 'New assignment',
    message:
      `${complaint.complaintId}: ${complaint.title}`,
    complaint: complaint._id,
    assignment: assignment._id,
    isRead: false,
  });

  await AutomationLog.create({
    action: 'SMART_ASSIGNMENT',
    complaint: complaint._id,
    assignment: assignment._id,
    user: selected.worker._id,
    message:
      `Assigned ${selected.worker.name} with score ${selected.assignmentScore}`,
    metadata: {
      assignmentScore: selected.assignmentScore,
      scoreBreakdown: selected.scoreBreakdown,
      activeJobs: selected.activeJobs,
    },
  });

  return Assignment.findById(assignment._id)
    .populate(
      'worker',
      'name employeeId email skills availability',
    );
}

export async function rejectWorkerAssignment({
  complaintId,
  workerId,
  reason,
}) {
  if (
    typeof reason !== 'string' ||
    !reason.trim()
  ) {
    const error = new Error(
      'Rejection reason is required',
    );
    error.statusCode = 400;
    throw error;
  }

  const complaint = await Complaint.findOne({
    complaintId,
  });

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const assignment = await Assignment.findOne({
    complaint: complaint._id,
    worker: workerId,
    status: 'PENDING_ACCEPTANCE',
  });

  if (!assignment) {
    const error = new Error(
      'Pending assignment not found for this worker',
    );
    error.statusCode = 404;
    throw error;
  }

  assignment.status = 'REJECTED';
  assignment.rejectedAt = new Date();
  assignment.rejectionReason = reason.trim();

  await assignment.save();

  complaint.assignedWorker = null;
  complaint.status = 'ANALYZING';

  await complaint.save();

  await AutomationLog.create({
    action: 'ASSIGNMENT_REJECTED',
    complaint: complaint._id,
    assignment: assignment._id,
    user: workerId,
    message: 'Worker rejected the assignment',
    metadata: {
      reason: assignment.rejectionReason,
      reassignmentAttempt:
        assignment.reassignmentAttempt,
    },
  });

  const excludedWorkerIds =
    await Assignment.distinct('worker', {
      complaint: complaint._id,
      status: {
        $in: ['REJECTED', 'EXPIRED', 'REASSIGNED'],
      },
    });

  const nextAttempt =
    assignment.reassignmentAttempt + 1;

  const maximumAttempts = Math.max(
    0,
    Number(
      process.env.MAX_AUTO_REASSIGNMENTS || 3,
    ),
  );

  if (nextAttempt > maximumAttempts) {
    await escalateNoWorker(complaint);

    return {
      rejectedAssignment: assignment,
      replacementAssignment: null,
      outcome: 'ESCALATED',
    };
  }

  const replacementAssignment =
    await assignBestWorker(
      complaint._id,
      excludedWorkerIds,
      nextAttempt,
    );

  return {
    rejectedAssignment: assignment,
    replacementAssignment,
    outcome: replacementAssignment
      ? 'REASSIGNED'
      : 'ESCALATED',
  };
}

export async function processExpiredAssignments(
  currentTime = new Date(),
) {
  const overdueAssignments = await Assignment.find({
    status: 'PENDING_ACCEPTANCE',
    acceptanceDeadline: {
      $lte: currentTime,
    },
  });

  const result = {
    examined: overdueAssignments.length,
    expired: 0,
    reassigned: 0,
    escalated: 0,
  };

  for (const overdue of overdueAssignments) {
    const assignment =
      await Assignment.findOneAndUpdate(
        {
          _id: overdue._id,
          status: 'PENDING_ACCEPTANCE',
          acceptanceDeadline: {
            $lte: currentTime,
          },
        },
        {
          $set: {
            status: 'EXPIRED',
            expiredAt: currentTime,
          },
        },
        {
          new: true,
        },
      );

    if (!assignment) {
      continue;
    }

    result.expired += 1;

    const complaint = await Complaint.findById(
      assignment.complaint,
    );

    if (!complaint) {
      continue;
    }

    complaint.assignedWorker = null;
    complaint.status = 'ANALYZING';

    await complaint.save();

    await AutomationLog.create({
      action: 'ASSIGNMENT_EXPIRED',
      complaint: complaint._id,
      assignment: assignment._id,
      user: assignment.worker,
      message:
        'Worker acceptance deadline expired',
      metadata: {
        acceptanceDeadline:
          assignment.acceptanceDeadline,
        reassignmentAttempt:
          assignment.reassignmentAttempt,
      },
    });

    const excludedWorkerIds =
      await Assignment.distinct('worker', {
        complaint: complaint._id,
        status: {
          $in: [
            'REJECTED',
            'EXPIRED',
            'REASSIGNED',
          ],
        },
      });

    const nextAttempt =
      assignment.reassignmentAttempt + 1;

    const maximumAttempts = Math.max(
      0,
      Number(
        process.env.MAX_AUTO_REASSIGNMENTS ||
          3,
      ),
    );

    if (nextAttempt > maximumAttempts) {
      await escalateNoWorker(complaint);
      result.escalated += 1;
      continue;
    }

    const replacement = await assignBestWorker(
      complaint._id,
      excludedWorkerIds,
      nextAttempt,
    );

    if (replacement) {
      result.reassigned += 1;
    } else {
      result.escalated += 1;
    }
  }

  return result;
}