// Purpose: Controller boundary for notification read-state operations.
import { respond } from './controllerTools.js';
import { store } from '../runtime/store.js';
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService.js';

export const notificationController = {
  list(request, response) {
    return respond(response, listNotifications(request.user._id, store.notifications));
  },
  markRead(request, response) {
    const notification = markNotificationRead(request.user._id, request.params.id, store.notifications);
    if (!notification) {
      return response.status(404).json({ success: false, message: 'Notification not found' });
    }
    return respond(response, notification, 'Notification marked as read');
  },
  markAllRead(request, response) {
    const notifications = markAllNotificationsRead(request.user._id, store.notifications);
    return respond(response, notifications, 'Notifications marked as read');
  },
};
