export const authorizeRoles = (...allowedRoles) => (request, response, next) => allowedRoles.includes(request.user?.role) ? next() : response.status(403).json({ success: false, message: 'Insufficient permissions' });
// Purpose: Enforce role-based access at the route boundary.
