import dayjs from 'dayjs';

/**
 * Return a human-readable duration string between two date strings.
 * Uses ceiling logic so partial months count (e.g. Jun 1 – Aug 1 = 3 mos).
 * Returns null when either date is missing.
 */
export function formatDuration(
  startDate?: string,
  endDate?: string,
): string | null {
  if (!startDate || !endDate) return null;

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const totalMonths = end.diff(start, 'month') + 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) return `${years} yr ${months} mos`;
  if (years > 0) return `${years} yr`;
  return `${months} mos`;
}

/**
 * Format a date range for resume items (jobs, degrees).
 * - No endDate → "MMM YYYY – Present"
 * - Same year → "MMM – MMM YYYY"
 * - Different years → "MMM YYYY – MMM YYYY"
 * - No startDate → falls back to year number
 */
export function formatDateRange(
  startDate?: string,
  endDate?: string,
  year?: number,
): string {
  if (!startDate) {
    return String(year ?? '');
  }

  const start = dayjs(startDate);

  if (!endDate) {
    return `${start.format('MMM YYYY')} – Present`;
  }

  const end = dayjs(endDate);

  if (start.year() === end.year()) {
    return `${start.format('MMM')} – ${end.format('MMM YYYY')}`;
  }

  return `${start.format('MMM YYYY')} – ${end.format('MMM YYYY')}`;
}
