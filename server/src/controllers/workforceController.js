// Purpose: Controller boundary for worker lifecycle and import operations.
import { respond } from './controllerTools.js';
export const workforceController = { list(_request, response) { return respond(response, []); }, create(request, response) { return respond(response, request.body, 'Worker created'); } };
