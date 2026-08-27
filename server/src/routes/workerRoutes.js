// Purpose: Group worker workflow endpoints for the Express composition layer.
// Purpose: Wire worker dashboard and availability requests.
import { Router } from 'express';
import { workerController } from '../controllers/workerController.js';
const router = Router();
router.get('/dashboard', workerController.dashboard);
router.put('/availability', workerController.availability);
export default router;
