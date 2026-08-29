import { Router } from 'express';
import { complaintController } from '../controllers/complaintController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);
router.get(
  '/',
  complaintController.list,
);

router.post(
  '/',
  authorizeRoles('USER', 'ADMIN'),
  complaintController.create,
);

router.get(
  '/my',
  authorizeRoles('USER'),
  complaintController.myComplaints,
);

router.get(
  '/:id',
  complaintController.details,
);

router.put(
  '/:id',
  authorizeRoles('USER', 'ADMIN'),
  complaintController.update,
);

router.post(
  '/:id/confirm-resolution',
  authorizeRoles('USER'),
  complaintController.confirmResolution,
);

router.post(
  '/:id/reopen',
  authorizeRoles('USER'),
  complaintController.reopen,
);

export default router;