import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  locationController.list,
);

router.post(
  '/',
  authorizeRoles('ADMIN'),
  locationController.create,
);

router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  locationController.update,
);

router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  locationController.remove,
);

export default router;