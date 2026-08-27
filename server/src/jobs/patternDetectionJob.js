import { detectRecurringPatterns } from '../services/patternDetectionService.js';
export function runPatternDetection(complaints) { return detectRecurringPatterns(complaints.filter(complaint => complaint.createdAt > new Date(Date.now() - 7 * 86400000))); }
