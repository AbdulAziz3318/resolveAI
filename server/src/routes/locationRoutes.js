// Purpose: Group location configuration endpoints.
// Purpose: Wire location configuration requests.
import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';
const router = Router();
router.get('/', locationController.list);
router.post('/', locationController.create);
export default router;
