// Purpose: Generate stable public identifiers for complaints and incidents.
export function generateId(prefix, sequence) { return `${prefix}-${String(sequence).padStart(6, '0')}`; }
