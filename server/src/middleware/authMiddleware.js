import jwt from 'jsonwebtoken';
// Purpose: Verify bearer tokens before protected route handlers execute.
export function authenticate(request, response, next) { const token = request.headers.authorization?.replace('Bearer ', ''); if (!token) return response.status(401).json({ success: false, message: 'Authentication required' }); try { request.auth = jwt.verify(token, process.env.JWT_SECRET || 'resolveai-development-secret'); next(); } catch { response.status(401).json({ success: false, message: 'Invalid token' }); } }
