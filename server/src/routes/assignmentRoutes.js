import { Router } from 'express';
import { assignmentController } from '../controllers/assignmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('WORKER'));

router.get('/', assignmentController.listMine);
router.post(
  '/:complaintId/accept',
  assignmentController.accept,
);

router.post(
  '/:complaintId/reject',
  assignmentController.reject,
);


export default router;