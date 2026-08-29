import {
  acknowledgeEscalation,
  getManagerDashboard,
  listManagerEscalations,
} from '../services/managerService.js';

export const managerController = {
  async dashboard(request, response, next) {
    try {
      const dashboard =
        await getManagerDashboard(
          request.user._id,
        );

      return response.json({
        success: true,
        message:
          'Manager dashboard retrieved',
        data: dashboard,
      });
    } catch (error) {
      return next(error);
    }
  },

  async escalations(
    request,
    response,
    next,
  ) {
    try {
      const escalations =
        await listManagerEscalations(
          request.user._id,
        );

      return response.json({
        success: true,
        message: 'Escalations retrieved',
        data: escalations,
      });
    } catch (error) {
      return next(error);
    }
  },

  async acknowledgeEscalation(
    request,
    response,
    next,
  ) {
    try {
      const escalation =
        await acknowledgeEscalation({
          escalationId: request.params.id,
          managerId: request.user._id,
        });

      return response.json({
        success: true,
        message:
          'Escalation acknowledged',
        data: escalation,
      });
    } catch (error) {
      return next(error);
    }
  },
};