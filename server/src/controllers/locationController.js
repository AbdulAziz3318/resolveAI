import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from '../services/locationService.js';

export const locationController = {
  async list(request, response, next) {
    try {
      const includeInactive =
        request.user.role === 'ADMIN' &&
        request.query.includeInactive === 'true';

      const locations = await listLocations({
        includeInactive,
      });

      return response.json({
        success: true,
        message: 'Locations retrieved',
        data: locations,
      });
    } catch (error) {
      return next(error);
    }
  },

  async create(request, response, next) {
    try {
      const location = await createLocation(
        request.body,
      );

      return response.status(201).json({
        success: true,
        message: 'Location created',
        data: location,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(request, response, next) {
    try {
      const location = await updateLocation(
        request.params.id,
        request.body,
      );

      return response.json({
        success: true,
        message: 'Location updated',
        data: location,
      });
    } catch (error) {
      return next(error);
    }
  },

  async remove(request, response, next) {
    try {
      await deleteLocation(request.params.id);

      return response.json({
        success: true,
        message: 'Location deleted',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
};