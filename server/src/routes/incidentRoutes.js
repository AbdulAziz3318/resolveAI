// Purpose: Group master-incident endpoints.
// Purpose: Wire master incident lifecycle requests.
import { Router } from 'express';
import { incidentController } from '../controllers/incidentController.js';
const router = Router();
router.get('/', incidentController.list);
router.post('/', incidentController.create);
router.post('/:id/close', incidentController.close);
export default router;
