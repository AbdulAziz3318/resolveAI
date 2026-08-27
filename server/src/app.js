import express from 'express';
// Purpose: Provide the reusable Express application composition boundary.
export const app = express();
app.use(express.json());
export default app;
