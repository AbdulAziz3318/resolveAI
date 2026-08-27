// Purpose: Group complaint lifecycle endpoints for the Express composition layer.
// Purpose: Wire complaint creation and lifecycle requests.
import { Router } from 'express';
import { complaintController } from '../controllers/complaintController.js';
const router = Router();
router.post('/', complaintController.create);
export default router;
