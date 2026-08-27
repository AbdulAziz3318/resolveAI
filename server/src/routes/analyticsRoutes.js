// Purpose: Group analytics and operational insight endpoints.
// Purpose: Wire analytics overview requests.
import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
const router = Router();
router.get('/overview', analyticsController.overview);
export default router;
