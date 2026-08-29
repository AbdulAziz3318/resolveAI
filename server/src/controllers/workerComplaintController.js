import {
  resolveAssignedWork,
  startAssignedWork,
} from '../services/workerComplaintService.js';

export const workerComplaintController = {
  async start(request, response, next) {
    try {
      const complaint =
        await startAssignedWork({
          complaintId:
            request.params.complaintId,
          workerId: request.user._id,
        });

      return response.json({
        success: true,
        message: 'Work started successfully',
        data: complaint,
      });
    } catch (error) {
      return next(error);
    }
  },

  async resolve(request, response, next) {
    try {
      const complaint =
        await resolveAssignedWork({
          complaintId:
            request.params.complaintId,
          workerId: request.user._id,
          resolutionNote:
            request.body.resolutionNote,
        });

      return response.json({
        success: true,
        message:
          'Resolution submitted successfully',
        data: complaint,
      });
    } catch (error) {
      return next(error);
    }
  },
};