import {
  createWorker,
  getWorker,
  listWorkers,
  resetWorkerPassword,
  setWorkerStatus,
  updateWorker,
} from '../services/workforceService.js';

export const workforceController = {
  async list(request, response, next) {
    try {
      const workers = await listWorkers({
        department: request.query.department,
        isActive:
          request.query.isActive === undefined
            ? undefined
            : request.query.isActive === 'true',
      });

      return response.json({
        success: true,
        message: 'Workers retrieved',
        data: workers,
      });
    } catch (error) {
      return next(error);
    }
  },

  async get(request, response, next) {
    try {
      const worker = await getWorker(request.params.id);

      return response.json({
        success: true,
        message: 'Worker retrieved',
        data: worker,
      });
    } catch (error) {
      return next(error);
    }
  },

  async create(request, response, next) {
    try {
      const worker = await createWorker(request.body);

      return response.status(201).json({
        success: true,
        message: 'Worker created',
        data: worker,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(request, response, next) {
    try {
      const worker = await updateWorker(
        request.params.id,
        request.body,
      );

      return response.json({
        success: true,
        message: 'Worker updated',
        data: worker,
      });
    } catch (error) {
      return next(error);
    }
  },

  async changeStatus(request, response, next) {
    try {
      const worker = await setWorkerStatus(
        request.params.id,
        request.body.isActive,
      );

      return response.json({
        success: true,
        message: 'Worker status updated',
        data: worker,
      });
    } catch (error) {
      return next(error);
    }
  },

  async resetPassword(request, response, next) {
    try {
      await resetWorkerPassword(
        request.params.id,
        request.body.temporaryPassword,
      );

      return response.json({
        success: true,
        message: 'Temporary password set',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
};