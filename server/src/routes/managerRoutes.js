import { Router } from 'express';
import { managerController } from '../controllers/managerController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('MANAGER'));

router.get(
  '/dashboard',
  managerController.dashboard,
);

router.get(
  '/escalations',
  managerController.escalations,
);

router.post(
  '/escalations/:id/acknowledge',
  managerController.acknowledgeEscalation,
);

export default router;