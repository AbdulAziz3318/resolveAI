import {
  createComplaint,
  getComplaint,
  listAccessibleComplaints,
  listMyComplaints,
  updateComplaint,
} from '../services/complaintService.js';

import {
  confirmResolution as confirmComplaintResolution,
  reopenResolution,
} from '../services/resolutionService.js';

export const complaintController = {
  async create(request, response, next) {
    try {
      const complaint = await createComplaint(
        request.user,
        request.body,
      );

      return response.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: complaint,
      });
    } catch (error) {
      return next(error);
    }
  },

  async myComplaints(request, response, next) {
    try {
      const complaints = await listMyComplaints(
        request.user._id,
      );

      return response.json({
        success: true,
        message: 'Complaints retrieved',
        data: complaints,
      });
    } catch (error) {
      return next(error);
    }
  },

  async details(request, response, next) {
    try {
      const result = await getComplaint(
        request.user,
        request.params.id,
      );

      return response.json({
        success: true,
        message: 'Complaint retrieved',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },

  async list(request, response, next) {
    try {
      const complaints =
        await listAccessibleComplaints(
          request.user,
        );

      return response.json({
        success: true,
        message: 'Complaints retrieved',
        data: complaints,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(request, response, next) {
    try {
      const complaint = await updateComplaint(
        request.user,
        request.params.id,
        request.body,
      );

      return response.json({
        success: true,
        message: 'Complaint updated',
        data: complaint,
      });
    } catch (error) {
      return next(error);
    }
  },

  async confirmResolution(
    request,
    response,
    next,
  ) {
    try {
      const complaint =
        await confirmComplaintResolution({
          complaintId: request.params.id,
          userId: request.user._id,
          rating: request.body.rating,
          feedback: request.body.feedback,
        });

      return response.json({
        success: true,
        message:
          'Resolution confirmed and complaint closed',
        data: complaint,
      });
    } catch (error) {
      return next(error);
    }
  },

  async reopen(request, response, next) {
    try {
      const result = await reopenResolution({
        complaintId: request.params.id,
        userId: request.user._id,
        reason: request.body.reason,
      });

      return response.json({
        success: true,
        message:
          result.outcome === 'REASSIGNED'
            ? 'Complaint reopened and reassigned'
            : 'Complaint reopened and escalated',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
};