const displayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

export function getYesterdayDateString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDateInputString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getDatetimeInputString(datetime: Date) {
  return datetime.toISOString().slice(0, 16);
}

export function getDisplayDatetime(datetime: Date) {
  return displayFormatter.format(datetime);
}
