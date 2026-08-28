import { GoogleGenAI } from '@google/genai';
import { classifyByRules } from './ruleClassifierService.js';

const categories = [
  'ELECTRICAL',
  'PLUMBING',
  'WATER',
  'NETWORK',
  'CLEANING',
  'SECURITY',
  'INFRASTRUCTURE',
  'IT_SUPPORT',
  'EQUIPMENT',
  'OTHER',
];

const priorities = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
];

const sentiments = [
  'NEUTRAL',
  'FRUSTRATED',
  'URGENT',
  'ANGRY',
];

const responseSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    category: {
      type: 'string',
      enum: categories,
    },
    subCategory: { type: 'string' },
    priority: {
      type: 'string',
      enum: priorities,
    },
    department: { type: 'string' },
    keywords: {
      type: 'array',
      items: { type: 'string' },
    },
    sentiment: {
      type: 'string',
      enum: sentiments,
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
  },
  required: [
    'summary',
    'category',
    'subCategory',
    'priority',
    'department',
    'keywords',
    'sentiment',
    'confidence',
  ],
};

function validAnalysis(result) {
  return (
    result &&
    typeof result.summary === 'string' &&
    categories.includes(result.category) &&
    typeof result.subCategory === 'string' &&
    priorities.includes(result.priority) &&
    typeof result.department === 'string' &&
    Array.isArray(result.keywords) &&
    sentiments.includes(result.sentiment) &&
    Number.isFinite(result.confidence) &&
    result.confidence >= 0 &&
    result.confidence <= 1
  );
}

export async function analyzeComplaint(input) {
  const fallback = classifyByRules(input);

  if (
    !process.env.GEMINI_API_KEY ||
    !process.env.GEMINI_MODEL
  ) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: `
Analyze this institutional service complaint.

Title: ${input.title}
Description: ${input.description}
Building: ${input.location?.building || ''}
Floor: ${input.location?.floor || ''}
Room: ${input.location?.room || ''}

Return only the requested structured analysis.
      `.trim(),
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.1,
      },
    });

    const result = JSON.parse(response.text);

    if (!validAnalysis(result)) {
      return fallback;
    }

    return {
      ...result,
      keywords: result.keywords.slice(0, 10),
      source: 'AI',
    };
  } catch (error) {
    console.error(
      `Gemini analysis failed; fallback used: ${error.message}`,
    );

    return fallback;
  }
}