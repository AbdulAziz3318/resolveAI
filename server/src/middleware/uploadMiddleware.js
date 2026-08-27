import multer from 'multer';
// Purpose: Restrict uploaded evidence to supported image types and 5 MB.
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, done) => done(null, allowed.has(file.mimetype)) });
