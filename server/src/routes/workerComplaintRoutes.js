import { Router } from 'express';
import { workerComplaintController } from '../controllers/workerComplaintController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('WORKER'));

router.post(
  '/:complaintId/start',
  workerComplaintController.start,
);

router.post(
  '/:complaintId/resolve',
  workerComplaintController.resolve,
);

export default router;