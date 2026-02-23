import type { ICalendarEventBase } from 'react-native-big-calendar';


export type BigCalendarEvent = ICalendarEventBase & {
status?: 'available' | 'booked';
};

export function generateWeekSlots(date: Date): BigCalendarEvent[] {
  const events: BigCalendarEvent[] = [];

  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);

  for (let d = 0; d < 7; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);

    if (day < new Date()) continue;

    for (let hour = 9; hour < 19; hour++) {
      for (const minute of [0, 30]) {
        events.push({
          start: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute),
          end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute + 30),
          title: '',
        });
      }
    }
  }

  return events;
}