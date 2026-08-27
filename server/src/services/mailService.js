import { mailConfigured } from '../config/mail.js';
export async function sendMail({ to, subject, text }) { if (!mailConfigured()) return { sent: false, reason: 'SMTP_NOT_CONFIGURED' }; return { sent: false, reason: 'SMTP_TRANSPORT_NOT_IMPLEMENTED', to, subject, text }; }
