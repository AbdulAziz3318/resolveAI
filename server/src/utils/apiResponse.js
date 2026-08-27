export function success(res, data, message = 'Success') { return res.json({ success: true, message, data }); }
export function failure(res, message, status = 400) { return res.status(status).json({ success: false, message }); }
