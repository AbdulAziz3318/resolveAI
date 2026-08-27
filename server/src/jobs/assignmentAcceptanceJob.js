export function findExpiredAssignments(assignments, now = new Date()) { return assignments.filter(assignment => assignment.status === 'PENDING_ACCEPTANCE' && assignment.acceptanceDeadline < now); }
