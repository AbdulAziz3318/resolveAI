const rules = [
  {
    category: 'NETWORK',
    department: 'IT',
    terms: ['wifi', 'internet', 'network', 'router', 'connection'],
  },
  {
    category: 'IT_SUPPORT',
    department: 'IT',
    terms: ['computer', 'printer', 'software', 'login', 'laptop'],
  },
  {
    category: 'ELECTRICAL',
    department: 'MAINTENANCE',
    terms: ['fan', 'light', 'switch', 'wire', 'power', 'electric'],
  },
  {
    category: 'PLUMBING',
    department: 'MAINTENANCE',
    terms: ['pipe', 'leak', 'tap', 'toilet', 'drain'],
  },
  {
    category: 'WATER',
    department: 'MAINTENANCE',
    terms: ['water', 'purifier', 'tank', 'motor'],
  },
  {
    category: 'CLEANING',
    department: 'HOUSEKEEPING',
    terms: ['dirty', 'garbage', 'waste', 'clean', 'smell'],
  },
  {
    category: 'SECURITY',
    department: 'SECURITY',
    terms: ['security', 'camera', 'cctv', 'gate', 'theft'],
  },
  {
    category: 'INFRASTRUCTURE',
    department: 'MAINTENANCE',
    terms: ['wall', 'roof', 'door', 'window', 'ceiling'],
  },
  {
    category: 'EQUIPMENT',
    department: 'MAINTENANCE',
    terms: ['machine', 'equipment', 'device'],
  },
];

export function classifyByRules(input) {
  const text = [
    input.title,
    input.description,
    input.location?.building,
    input.location?.floor,
    input.location?.room,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const matchedRule = rules.find((rule) =>
    rule.terms.some((term) => text.includes(term)),
  );

  const urgencyTerms = [
    'danger',
    'fire',
    'burning',
    'unsafe',
    'emergency',
    'shock',
  ];

  const highImpactTerms = [
    'outage',
    'everyone',
    'whole block',
    'cannot',
    'not working',
  ];

  const urgencyFound = urgencyTerms.some((term) =>
    text.includes(term),
  );

  const highImpactFound = highImpactTerms.some((term) =>
    text.includes(term),
  );

  const words = text
    .split(/\W+/)
    .filter((word) => word.length > 4);

  return {
    summary: input.title.trim(),
    category: matchedRule?.category || 'OTHER',
    subCategory: matchedRule?.category || 'OTHER',
    priority: urgencyFound
      ? 'CRITICAL'
      : highImpactFound
        ? 'HIGH'
        : 'MEDIUM',
    department:
      matchedRule?.department || 'GENERAL_ADMIN',
    keywords: [...new Set(words)].slice(0, 8),
    sentiment:
      urgencyFound || text.includes('frustrated')
        ? 'FRUSTRATED'
        : 'NEUTRAL',
    confidence: matchedRule ? 0.75 : 0.4,
    source: 'FALLBACK',
  };
}