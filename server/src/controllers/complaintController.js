// Purpose: Controller boundary for complaint lifecycle request validation.
import { requiredFields, respond } from './controllerTools.js';
export const complaintController = { create(request, response) { if (!requiredFields(request, response, ['title', 'description'])) return; return respond(response, { title: request.body.title, description: request.body.description, status: 'SUBMITTED' }, 'Complaint request accepted'); } };
