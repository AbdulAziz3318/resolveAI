import Assignment from '../models/Assignment.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { rejectWorkerAssignment } from '../services/assignmentService.js';

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function populatedAssignment(query) {
  return query
    .populate(
      'complaint',
      'complaintId title description category subCategory priority status location',
    )
    .populate(
      'worker',
      'name employeeId email availability',
    );
}

export const assignmentController = {
  async listMine(request, response, next) {
    try {
      const assignments = await populatedAssignment(
        Assignment.find({
  worker: request.user._id,
})
  .sort({ assignedAt: -1 })
  .limit(50)
      );

      return response.json({
        success: true,
        message: 'Assignments retrieved successfully',
        data: assignments,
      });
    } catch (error) {
      return next(error);
    }
  },

  async accept(request, response, next) {
    try {
      const complaint = await Complaint.findOne({
        $or: [
          { complaintId: request.params.complaintId },
          ...(request.params.complaintId.match(/^[a-f\d]{24}$/i)
            ? [{ _id: request.params.complaintId }]
            : []),
        ],
      });

      if (!complaint) {
        throw createError(404, 'Complaint not found');
      }

      const assignment = await Assignment.findOne({
        complaint: complaint._id,
        worker: request.user._id,
        status: 'PENDING_ACCEPTANCE',
      });

      if (!assignment) {
        throw createError(
          404,
          'Pending assignment not found for this worker',
        );
      }

      if (
        assignment.acceptanceDeadline &&
        assignment.acceptanceDeadline < new Date()
      ) {
        assignment.status = 'EXPIRED';
        assignment.expiredAt = new Date();
        await assignment.save();

        throw createError(
          409,
          'Assignment acceptance deadline has expired',
        );
      }

      assignment.status = 'ACCEPTED';
      assignment.acceptedAt = new Date();
      await assignment.save();

      complaint.status = 'ACCEPTED';
      await complaint.save();

      await User.findByIdAndUpdate(request.user._id, {
        availability: 'ASSIGNED',
      });

      const result = await populatedAssignment(
        Assignment.findById(assignment._id),
      );

      return response.json({
        success: true,
        message: 'Assignment accepted successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },

  async reject(request, response, next) {
  try {
    const result =
      await rejectWorkerAssignment({
        complaintId:
          request.params.complaintId,
        workerId: request.user._id,
        reason: request.body.reason,
      });

    return response.json({
      success: true,
      message:
        result.outcome === 'REASSIGNED'
          ? 'Assignment rejected and reassigned'
          : 'Assignment rejected and escalated',
      data: {
        outcome: result.outcome,
        rejectedAssignment:
          result.rejectedAssignment,
        replacementAssignment:
          result.replacementAssignment,
      },
    });
  } catch (error) {
    return next(error);
  }
},
};