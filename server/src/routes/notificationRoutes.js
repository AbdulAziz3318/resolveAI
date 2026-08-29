import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  notificationController.list,
);

router.put(
  '/read-all',
  notificationController.markAllRead,
);

router.put(
  '/:id/read',
  notificationController.markRead,
);

export default router;