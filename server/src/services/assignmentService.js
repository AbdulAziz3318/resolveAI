// Purpose: Score eligible workers using the specification's assignment weights.
export const availabilityScore = { AVAILABLE: 25, ASSIGNED: 18, BUSY: 8 };
export function scoreBreakdown({ skill = 0, availability = 'AVAILABLE', workload = 0, rating = 0, location = 0 }) { return { skill, availability: availabilityScore[availability] || 0, workload: workload === 0 ? 20 : workload <= 2 ? 15 : 10, performance: rating ? Math.round(rating / 5 * 10) : 5, location }; }
export function assignmentTotal(breakdown) { return Object.values(breakdown).reduce((total, value) => total + value, 0); }
