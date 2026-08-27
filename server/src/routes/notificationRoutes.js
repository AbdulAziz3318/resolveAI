// Purpose: Group notification read-state endpoints.
// Purpose: Wire notification list and read-state requests.
import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';

const router = Router();

router.get('/', notificationController.list);
router.put('/read-all', notificationController.markAllRead);
router.put('/:id/read', notificationController.markRead);

export default router;
