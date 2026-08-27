import test from 'node:test';
import assert from 'node:assert/strict';
import {
  notificationPayload,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../src/services/notificationService.js';

test('notificationPayload creates unread notification for a user', () => {
  const payload = notificationPayload('user-1', 'ASSIGNMENT', 'New assignment', 'CMP-1001 ready', 'complaint-1', 'assignment-1');

  assert.equal(payload.user, 'user-1');
  assert.equal(payload.type, 'ASSIGNMENT');
  assert.equal(payload.isRead, false);
  assert.ok(payload.createdAt instanceof Date);
});

test('listNotifications filters by user and resolves unread state', () => {
  const notifications = [
    { _id: 'n1', user: 'user-1', isRead: false },
    { _id: 'n2', user: 'user-2', isRead: false },
    { _id: 'n3', user: 'user-1', isRead: true },
  ];

  const result = listNotifications('user-1', notifications);
  assert.deepEqual(result.map((n) => n._id), ['n1', 'n3']);
});

test('markNotificationRead and markAllNotificationsRead update state', () => {
  const notifications = [
    { _id: 'n1', user: 'user-1', isRead: false },
    { _id: 'n2', user: 'user-1', isRead: false },
    { _id: 'n3', user: 'user-2', isRead: false },
  ];

  assert.equal(markNotificationRead('user-1', 'n1', notifications)?.isRead, true);
  assert.equal(markAllNotificationsRead('user-1', notifications).every((n) => n.isRead), true);
  assert.equal(notifications.find((n) => n._id === 'n3')?.isRead, false);
});
