// Purpose: Controller boundary for worker actions and workload state.
import { respond } from './controllerTools.js';
export const workerController = { dashboard(_request, response) { return respond(response, { status: 'ready' }); }, availability(request, response) { return respond(response, { availability: request.body.availability }, 'Availability updated'); } };
