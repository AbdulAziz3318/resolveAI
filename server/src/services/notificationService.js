export function notificationPayload(user, type, title, message, complaint, assignment) {
  const userId = typeof user === 'string' ? user : user?._id;
  return {
    user: userId,
    type,
    title,
    message,
    complaint,
    assignment,
    isRead: false,
    createdAt: new Date(),
  };
}

export function listNotifications(userId, notifications = []) {
  return [...notifications]
    .filter((notification) => notification.user === userId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export function markNotificationRead(userId, notificationId, notifications = []) {
  const notification = notifications.find(
    (entry) => entry.user === userId && entry._id === notificationId,
  );

  if (!notification) return null;
  notification.isRead = true;
  return notification;
}

export function markAllNotificationsRead(userId, notifications = []) {
  const unread = notifications.filter((entry) => entry.user === userId && !entry.isRead);
  unread.forEach((entry) => {
    entry.isRead = true;
  });
  return unread;
}

