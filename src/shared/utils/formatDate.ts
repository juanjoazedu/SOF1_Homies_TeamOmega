export type IsoDate = `${number}-${number}-${number}`;

const calendarFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

const instantFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (value: IsoDate | Date): string => (
  typeof value === 'string'
    ? calendarFormatter.format(new Date(value))
    : instantFormatter.format(value)
);

export const formatMonthYear = (value: IsoDate | Date): string => (
  monthYearFormatter.format(
    typeof value === 'string' ? new Date(value) : value,
  )
);