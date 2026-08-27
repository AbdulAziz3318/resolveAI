// Purpose: Controller boundary for department configuration.
import { respond } from './controllerTools.js';
export const departmentController = { list(_request, response) { return respond(response, []); }, create(request, response) { return respond(response, request.body, 'Department created'); } };
