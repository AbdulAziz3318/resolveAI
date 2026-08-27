// Purpose: Shared controller helpers for consistent success and validation responses.
export function requiredFields(request, response, fields) { const missing = fields.filter(field => !request.body?.[field]); if (missing.length) { response.status(400).json({ success: false, message: `Required fields: ${missing.join(', ')}` }); return false; } return true; }
export function respond(response, data, message = 'Success') { return response.json({ success: true, message, data }); }
export function notConfigured(response, name) { return response.status(501).json({ success: false, message: `${name} is not configured in this runtime` }); }
