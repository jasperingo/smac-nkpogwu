
export function getYesterdayDateString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDateInputString(date: Date) {
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  // const day = String(date.getDate()).padStart(2, '0');

  // return `${year}-${month}-${day}`;

  return date.toISOString().slice(0, 10);
}

export function getDatetimeInputString(datetime: Date) {
  return datetime.toISOString().slice(0, 16);
}
