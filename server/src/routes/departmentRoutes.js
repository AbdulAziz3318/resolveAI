// Purpose: Group department configuration endpoints.
// Purpose: Wire department configuration requests.
import { Router } from 'express';
import { departmentController } from '../controllers/departmentController.js';
const router = Router();
router.get('/', departmentController.list);
router.post('/', departmentController.create);
export default router;
