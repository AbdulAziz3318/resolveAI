export const cloudinaryConfig = { cloudName: process.env.CLOUDINARY_CLOUD_NAME || '', apiKey: process.env.CLOUDINARY_API_KEY || '', apiSecret: process.env.CLOUDINARY_API_SECRET || '' };
// Purpose: Hold optional image-storage configuration for secure uploads.
export const cloudinaryConfigured = () => Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret);
