// Purpose: Group shift configuration endpoints.
// Purpose: Wire shift configuration requests.
import { Router } from 'express';
import { shiftController } from '../controllers/shiftController.js';
const router = Router();
router.get('/', shiftController.list);
router.post('/', shiftController.create);
export default router;
