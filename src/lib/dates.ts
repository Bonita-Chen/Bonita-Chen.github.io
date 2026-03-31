import dayjs from 'dayjs';

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
