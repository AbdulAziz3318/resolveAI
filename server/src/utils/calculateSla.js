// Purpose: Convert a priority and SLA policy into an absolute deadline.
const hoursByPriority = { LOW: 72, MEDIUM: 24, HIGH: 8, CRITICAL: 2 };
export function calculateSla(priority, from = new Date(), overrides = {}) { const hours = overrides[priority] ?? hoursByPriority[priority] ?? 24; return new Date(from.getTime() + hours * 3600000); }
