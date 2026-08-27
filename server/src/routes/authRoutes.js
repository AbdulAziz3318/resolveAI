// Purpose: Group authentication endpoints for the Express composition layer.
// Purpose: Wire authentication requests to authentication controllers.
import { Router } from 'express';
import { authController } from '../controllers/authController.js';
const router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
export default router;
