// Purpose: Group workforce administration endpoints.
// Purpose: Wire worker management requests.
import { Router } from 'express';
import { workforceController } from '../controllers/workforceController.js';
const router = Router();
router.get('/', workforceController.list);
router.post('/', workforceController.create);
export default router;
