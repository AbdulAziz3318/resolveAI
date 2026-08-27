// Purpose: Group organization administration endpoints for the Express composition layer.
// Purpose: Wire administrative dashboard requests.
import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
const router = Router();
router.get('/dashboard', adminController.dashboard);
router.get('/settings', adminController.settings);
export default router;
