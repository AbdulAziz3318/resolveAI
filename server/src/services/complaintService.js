import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import ComplaintUpdate from '../models/ComplaintUpdate.js';
import { analyzeComplaint } from './aiComplaintService.js';
import Escalation from '../models/Escalation.js';
import { calculatePriority } from './priorityService.js';
import { routeDepartment } from './departmentRoutingService.js';
import { assignBestWorker } from './assignmentService.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'Invalid complaint ID');
  }
}

async function nextComplaintId() {
  const latest = await Complaint.findOne()
    .sort({ complaintId: -1 })
    .select('complaintId')
    .lean();

  const current = latest
    ? Number(latest.complaintId.replace(/\D/g, ''))
    : 0;

  return `CMP-${String(current + 1).padStart(6, '0')}`;
}

function populatedComplaint(query) {
  return query
    .populate('createdBy', 'name email role')
    .populate('department', 'name')
    .populate(
      'assignedWorker',
      'name employeeId email skills availability',
    );
}

export async function createComplaint(user, input) {
  if (!input.title?.trim()) {
    throw createError(400, 'Complaint title is required');
  }

  if (!input.description?.trim()) {
    throw createError(
      400,
      'Complaint description is required',
    );
  }

  if (!input.location?.building?.trim()) {
    throw createError(
      400,
      'Complaint building/location is required',
    );
  }

  const complaint = await Complaint.create({
    complaintId: await nextComplaintId(),
    createdBy: user._id,
    title: input.title.trim(),
    description: input.description.trim(),
    imageUrl: input.imageUrl || '',
    category: input.category || 'OTHER',
    location: {
      building: input.location.building.trim(),
      floor: input.location.floor?.trim() || '',
      room: input.location.room?.trim() || '',
    },
    status: 'SUBMITTED',
  });

  await ComplaintUpdate.create({
    complaint: complaint._id,
    createdBy: user._id,
    message: 'Complaint submitted',
    type: 'STATUS',
  });

    const analysis = await analyzeComplaint({
    title: complaint.title,
    description: complaint.description,
    location: complaint.location,
  });
    const priorityResult = calculatePriority(
    {
      title: complaint.title,
      description: complaint.description,
    },
    analysis.priority,
  );

  const routingResult = await routeDepartment({
    category: analysis.category,
    aiDepartment: analysis.department,
  });

  complaint.status = routingResult.department
    ? 'ANALYZING'
    : 'ESCALATED';
      complaint.category = analysis.category;
  complaint.subCategory = analysis.subCategory;
    complaint.priority = priorityResult.priority;
  complaint.priorityScore =
    priorityResult.priorityScore;
  complaint.priorityReason =
    priorityResult.priorityReason;
  complaint.department =
    routingResult.department?._id || null;
  complaint.aiAnalysis = {
    source: analysis.source,
    summary: analysis.summary,
    sentiment: analysis.sentiment,
    keywords: analysis.keywords,
    confidence: analysis.confidence,
  };

  await complaint.save();
  if (!routingResult.department) {
    await Escalation.create({
      complaint: complaint._id,
      level: 'LEVEL_1',
      reason: routingResult.routingReason,
      status: 'OPEN',
      createdAt: new Date(),
    });
  }

  await ComplaintUpdate.create({
    complaint: complaint._id,
    createdBy: user._id,
    message: routingResult.department
      ? `Routed to ${routingResult.department.name}: ${routingResult.routingReason}`
      : `Escalated: ${routingResult.routingReason}`,
    type: 'SYSTEM',
  });
  await ComplaintUpdate.create({
    complaint: complaint._id,
    createdBy: user._id,
    message:
      analysis.source === 'AI'
        ? 'Complaint analyzed using Gemini'
        : 'Complaint analyzed using deterministic fallback',
    type: 'SYSTEM',
  });

  if (routingResult.department) {
    await assignBestWorker(complaint._id);
  }

  return populatedComplaint(
    Complaint.findById(complaint._id),
  );

  
}

export async function listMyComplaints(userId) {
  return populatedComplaint(
    Complaint.find({
      createdBy: userId,
    }).sort({ createdAt: -1 }),
  );
}

export async function getComplaint(user, id) {
  validateId(id);

  const complaint = await populatedComplaint(
    Complaint.findById(id),
  );

  if (!complaint) {
    throw createError(404, 'Complaint not found');
  }

  const userId = user._id.toString();

  const permitted =
    user.role === 'ADMIN' ||
    (user.role === 'USER' &&
      complaint.createdBy._id.toString() === userId) ||
    (user.role === 'WORKER' &&
      complaint.assignedWorker?._id.toString() === userId) ||
    (user.role === 'MANAGER' &&
      complaint.department?._id.toString() ===
        user.department?.toString());

  if (!permitted) {
    throw createError(403, 'Access denied');
  }

  const timeline = await ComplaintUpdate.find({
    complaint: complaint._id,
  })
    .populate('createdBy', 'name role')
    .sort({ createdAt: 1 });

  return {
    complaint,
    timeline,
  };
}

export async function listAccessibleComplaints(user) {
  const filter = {};

  if (user.role === 'USER') {
    filter.createdBy = user._id;
  }

  if (user.role === 'WORKER') {
    filter.assignedWorker = user._id;
  }

  if (user.role === 'MANAGER') {
    filter.department = user.department;
  }

  return populatedComplaint(
    Complaint.find(filter).sort({
      createdAt: -1,
    }),
  );
}

export async function updateComplaint(user, id, input) {
  validateId(id);

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    throw createError(404, 'Complaint not found');
  }

  const isOwner =
    complaint.createdBy.toString() ===
    user._id.toString();

  if (user.role !== 'ADMIN' && !isOwner) {
    throw createError(403, 'Access denied');
  }

  if (
    user.role !== 'ADMIN' &&
    !['SUBMITTED', 'REOPENED'].includes(
      complaint.status,
    )
  ) {
    throw createError(
      409,
      'Complaint cannot be edited after processing begins',
    );
  }

  const allowedFields = [
    'title',
    'description',
    'location',
  ];

  for (const field of allowedFields) {
    if (input[field] !== undefined) {
      complaint[field] = input[field];
    }
  }

  await complaint.save();

  await ComplaintUpdate.create({
    complaint: complaint._id,
    createdBy: user._id,
    message: 'Complaint information updated',
    type: 'SYSTEM',
  });

  return populatedComplaint(
    Complaint.findById(complaint._id),
  );
}