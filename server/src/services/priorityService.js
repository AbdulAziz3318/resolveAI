const priorityMap = (score) => {
  if (score >= 71) return 'CRITICAL';
  if (score >= 41) return 'HIGH';
  if (score >= 21) return 'MEDIUM';
  return 'LOW';
};

export function calculatePriority(input, aiPriority = null) {
  const text = `${input.title} ${input.description}`.toLowerCase();

  let score = 5;
  const reasons = ['Normal operational issue (+5)'];

  if (/danger|fire|unsafe|shock|burning/.test(text)) {
    score += 40;
    reasons.push('Safety risk detected (+40)');
  }

  if (
    /outage|essential|cannot|not working|no water|no power/.test(
      text,
    )
  ) {
    score += 30;
    reasons.push('Essential service failure detected (+30)');
  }

  if (
    /everyone|many users|whole block|entire|all students/.test(
      text,
    )
  ) {
    score += 25;
    reasons.push('Multiple users affected (+25)');
  }

  if (/repeated|again|still|recurring/.test(text)) {
    score += 15;
    reasons.push('Repeated issue detected (+15)');
  }

  if (/urgent|immediately|asap|emergency/.test(text)) {
    score += 10;
    reasons.push('Urgency language detected (+10)');
  }

  if (aiPriority === 'HIGH') {
    score += 5;
    reasons.push('AI high-priority signal (+5)');
  }

  if (aiPriority === 'CRITICAL') {
    score += 10;
    reasons.push('AI critical-priority signal (+10)');
  }

  return {
    priority: priorityMap(score),
    priorityScore: score,
    priorityReason: reasons.join('; '),
  };
}