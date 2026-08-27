import { Router } from 'express';
import { shiftController } from '../controllers/shiftController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  shiftController.list,
);

router.post(
  '/',
  authorizeRoles('ADMIN'),
  shiftController.create,
);

router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  shiftController.update,
);

router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  shiftController.remove,
);

export default router;