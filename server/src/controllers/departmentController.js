import {
  createDepartment,
  listDepartments,
  updateDepartment,
} from '../services/departmentService.js';

export const departmentController = {
  async list(request, response, next) {
    try {
      const includeInactive =
        request.user.role === 'ADMIN' &&
        request.query.includeInactive === 'true';

      const departments = await listDepartments({
        includeInactive,
      });

      return response.json({
        success: true,
        message: 'Departments retrieved',
        data: departments,
      });
    } catch (error) {
      return next(error);
    }
  },

  async create(request, response, next) {
    try {
      const department = await createDepartment(
        request.body,
      );

      return response.status(201).json({
        success: true,
        message: 'Department created',
        data: department,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(request, response, next) {
    try {
      const department = await updateDepartment(
        request.params.id,
        request.body,
      );

      return response.json({
        success: true,
        message: 'Department updated',
        data: department,
      });
    } catch (error) {
      return next(error);
    }
  },
};