export type IsoDate = `${number}-${number}-${number}`;

const calendarFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

const instantFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDate = (value: IsoDate | Date): string => (
  typeof value === 'string'
    ? calendarFormatter.format(new Date(value))
    : instantFormatter.format(value)
);