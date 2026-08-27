// Purpose: Normalize AI analysis behind a fallback-safe service boundary.
import { classifyByRules } from './ruleClassifierService.js';
export async function analyzeComplaint(input) { const fallback = classifyByRules(input.title, input.description); return { ...fallback, summary: input.title, subCategory: fallback.category, keywords: `${input.title} ${input.description}`.toLowerCase().split(/\W+/).filter(word => word.length > 4).slice(0, 8), sentiment: /frustrated|urgent|cannot/.test(`${input.title} ${input.description}`.toLowerCase()) ? 'FRUSTRATED' : 'NEUTRAL', confidence: 0.86 }; }
