import {
  createShift,
  deleteShift,
  listShifts,
  updateShift,
} from '../services/shiftService.js';

export const shiftController = {
  async list(request, response, next) {
    try {
      const includeInactive =
        request.user.role === 'ADMIN' &&
        request.query.includeInactive === 'true';

      const shifts = await listShifts({
        includeInactive,
      });

      return response.json({
        success: true,
        message: 'Shifts retrieved',
        data: shifts,
      });
    } catch (error) {
      return next(error);
    }
  },

  async create(request, response, next) {
    try {
      const shift = await createShift(request.body);

      return response.status(201).json({
        success: true,
        message: 'Shift created',
        data: shift,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(request, response, next) {
    try {
      const shift = await updateShift(
        request.params.id,
        request.body,
      );

      return response.json({
        success: true,
        message: 'Shift updated',
        data: shift,
      });
    } catch (error) {
      return next(error);
    }
  },

  async remove(request, response, next) {
    try {
      await deleteShift(request.params.id);

      return response.json({
        success: true,
        message: 'Shift deleted',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
};