export const escalationLevels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3'];
export function createEscalation(complaint, reason, escalatedTo) { return { complaint, level: 'LEVEL_1', reason, escalatedTo, status: 'OPEN', createdAt: new Date() }; }
