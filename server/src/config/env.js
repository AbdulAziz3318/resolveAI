import 'dotenv/config';
// Purpose: Centralize server environment configuration and defaults.
export const env = { port: Number(process.env.PORT || 5000), mongoUri: process.env.MONGODB_URI || '', jwtSecret: process.env.JWT_SECRET || 'resolveai-development-secret', clientUrl: process.env.CLIENT_URL || 'http://localhost:5173', geminiApiKey: process.env.GEMINI_API_KEY || '' };
