/**
 * Calculate a human-readable age string from a date of birth.
 * Returns age in weeks if less than 12 weeks, otherwise in months.
 */
export function getAge(dateOfBirth: Date): string {
  const now = Date.now();
  const dob = dateOfBirth.getTime();
  const diffMs = now - dob;

  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));

  if (weeks < 1) {
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    return days <= 1 ? "1 day" : `${days} days`;
  }

  if (weeks < 12) {
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }

  const months = Math.floor(weeks / 4.33);
  if (months < 12) {
    return months === 1 ? "1 month" : `${months} months`;
  }

  const years = Math.floor(months / 12);
  return years === 1 ? "1 year" : `${years} years`;
}
