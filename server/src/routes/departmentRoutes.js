import { Router } from 'express';
import { departmentController } from '../controllers/departmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  departmentController.list,
);

router.post(
  '/',
  authorizeRoles('ADMIN'),
  departmentController.create,
);

router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  departmentController.update,
);

export default router;