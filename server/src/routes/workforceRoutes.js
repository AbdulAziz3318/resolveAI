import { Router } from 'express';
import { workforceController } from '../controllers/workforceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get('/', workforceController.list);
router.post('/', workforceController.create);
router.get('/:id', workforceController.get);
router.put('/:id', workforceController.update);
router.patch(
  '/:id/status',
  workforceController.changeStatus,
);
router.post(
  '/:id/reset-password',
  workforceController.resetPassword,
);

export default router;