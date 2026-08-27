import { Router } from 'express';
import { managerProvisioningController } from '../controllers/managerProvisioningController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get(
  '/',
  managerProvisioningController.list,
);

router.post(
  '/',
  managerProvisioningController.create,
);

export default router;