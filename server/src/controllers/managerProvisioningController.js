import {
  createManager,
  listManagers,
} from '../services/workforceService.js';

export const managerProvisioningController = {
  async list(request, response, next) {
    try {
      const managers = await listManagers();

      return response.json({
        success: true,
        message: 'Managers retrieved',
        data: managers,
      });
    } catch (error) {
      return next(error);
    }
  },

  async create(request, response, next) {
    try {
      const manager = await createManager(request.body);

      return response.status(201).json({
        success: true,
        message: 'Manager created',
        data: manager,
      });
    } catch (error) {
      return next(error);
    }
  },
};