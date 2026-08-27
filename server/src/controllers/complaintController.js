import {
  createComplaint,
  getComplaint,
  listAccessibleComplaints,
  listMyComplaints,
  updateComplaint,
} from '../services/complaintService.js';
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
        await listAccessibleComplaints(request.user);

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
};