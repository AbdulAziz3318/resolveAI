const dayNames = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
];

function minutesFromTime(value) {
  const [hours, minutes] = value
    .split(':')
    .map(Number);

  return hours * 60 + minutes;
}

export function isShiftActive(
  shift,
  currentDate = new Date(),
) {
  if (!shift || !shift.isActive) {
    return false;
  }

  const currentDay = dayNames[currentDate.getDay()];

  if (!shift.workingDays.includes(currentDay)) {
    return false;
  }

  const currentMinutes =
    currentDate.getHours() * 60 +
    currentDate.getMinutes();

  const start = minutesFromTime(shift.startTime);
  const end = minutesFromTime(shift.endTime);

  if (start < end) {
    return (
      currentMinutes >= start &&
      currentMinutes < end
    );
  }

  return (
    currentMinutes >= start ||
    currentMinutes < end
  );
}