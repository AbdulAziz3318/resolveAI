// Purpose: Controller boundary for authentication validation and response shaping.
import { requiredFields, respond } from './controllerTools.js';
export const authController = { register(request, response) { if (!requiredFields(request, response, ['name', 'email', 'password'])) return; return respond(response, { email: request.body.email, role: 'USER' }, 'Registration request accepted'); }, login(request, response) { if (!requiredFields(request, response, ['email', 'password'])) return; return respond(response, { email: request.body.email }, 'Login request accepted'); } };
