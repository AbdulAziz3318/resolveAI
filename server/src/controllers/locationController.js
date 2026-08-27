// Purpose: Controller boundary for location configuration.
import { respond } from './controllerTools.js';
export const locationController = { list(_request, response) { return respond(response, []); }, create(request, response) { return respond(response, request.body, 'Location created'); } };
