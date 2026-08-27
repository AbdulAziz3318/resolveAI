export const mailConfig = { host: process.env.SMTP_HOST || '', port: Number(process.env.SMTP_PORT || 587), user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '', from: process.env.MAIL_FROM || '' };
// Purpose: Hold optional SMTP configuration without blocking core workflows.
export const mailConfigured = () => Boolean(mailConfig.host && mailConfig.user && mailConfig.pass && mailConfig.from);
