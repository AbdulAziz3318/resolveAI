// Purpose: Calculate explainable priority scores from operational risk signals.
const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
export function calculatePriority({ title = '', description = '' }) { const text = `${title} ${description}`.toLowerCase(); let score = 5; if (/danger|fire|unsafe/.test(text)) score += 40; if (/outage|essential|cannot|emergency/.test(text)) score += 30; if (/many|everyone|whole block/.test(text)) score += 25; if (/repeated|again|still/.test(text)) score += 15; if (/urgent|immediately|asap/.test(text)) score += 10; return { priority: score > 70 ? 'CRITICAL' : score > 40 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW', score, reason: `Priority score ${score} calculated from complaint signals` }; }
export { levels };
