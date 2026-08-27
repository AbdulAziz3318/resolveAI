// Purpose: Group manager oversight endpoints for the Express composition layer.
// Purpose: Wire manager oversight requests.
import { Router } from 'express';
import { managerController } from '../controllers/managerController.js';
const router = Router();
router.get('/dashboard', managerController.dashboard);
router.post('/escalations/:id/acknowledge', managerController.acknowledgeEscalation);
export default router;
