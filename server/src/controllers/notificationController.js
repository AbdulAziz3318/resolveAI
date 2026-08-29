import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService.js';

export const notificationController = {
  async list(request, response, next) {
    try {
      const notifications =
        await listNotifications(
          request.user._id,
        );

      return response.json({
        success: true,
        message:
          'Notifications retrieved',
        data: notifications,
      });
    } catch (error) {
      return next(error);
    }
  },

  async markRead(request, response, next) {
    try {
      const notification =
        await markNotificationRead(
          request.user._id,
          request.params.id,
        );

      if (!notification) {
        return response.status(404).json({
          success: false,
          message: 'Notification not found',
        });
      }

      return response.json({
        success: true,
        message:
          'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      return next(error);
    }
  },

  async markAllRead(
    request,
    response,
    next,
  ) {
    try {
      const result =
        await markAllNotificationsRead(
          request.user._id,
        );

      return response.json({
        success: true,
        message:
          'Notifications marked as read',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
};