import {DateTime} from "luxon";

export const getTicketTitle = (
  start: string | undefined,
  end: string | undefined,
  locale: string,
): string => {
  if (!start || !end) {
    return '-'
  }

  const startDate = DateTime.fromISO(start, { zone: 'utc' }).startOf('day')
  const endDate = DateTime.fromISO(end, { zone: 'utc' }).startOf('day')

  if (!startDate.isValid || !endDate.isValid || endDate < startDate) {
    return '-'
  }

  if ((startDate.toISODate() === endDate.toISODate())) {
    return startDate.setLocale(locale).toLocaleString({
      weekday: 'long',
    })
  }

  const dayCount = Math.floor(endDate.diff(startDate, 'days').days) + 1
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'day',
    unitDisplay: 'long',
  }).format(dayCount)
}
