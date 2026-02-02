export default function ProgramStateDiv({ startDatetime, endDatetime }: { startDatetime?: Date; endDatetime?: Date; }) {
  let text = '';
  let bgColor = '';

  if (startDatetime && endDatetime) {
    if (endDatetime.getTime() < Date.now()) {
      text = 'Ended';
      bgColor = 'bg-gray-600';
    } else if (startDatetime.getTime() > Date.now()) {
      text = 'Upcoming';
      bgColor = 'bg-blue-600';
    } else {
      text = 'Ongoing';
      bgColor = 'bg-green-600';
    }
  } else {
    text = 'Unscheduled';
    bgColor = 'bg-orange-600';
  }

  return <div className={`w-fit px-2 py-1 text-sm text-white ${bgColor}`}>{ text }</div>;
}
