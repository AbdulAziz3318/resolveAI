// Purpose: Controller boundary for shift configuration.
import { respond } from './controllerTools.js';
export const shiftController = { list(_request, response) { return respond(response, []); }, create(request, response) { return respond(response, request.body, 'Shift created'); } };
