import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

export type CalendarEvents = {
  startTime: any; // Firestore Timestamp
  clinicId: string;
  petId: string;
  clientId: string;
  reason: string;
};

function generateSlots(start = 12, end = 17) {
  const slots: string[] = [];

  for (let h = start; h <= end; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }

  return slots;
}

function extractTime(startTime: any) {
  const date = startTime?.toDate ? startTime.toDate() : new Date(startTime);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function isSameDay(startTime: any, selectedDate: Date) {
  const date = startTime?.toDate ? startTime.toDate() : new Date(startTime);

  return (
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear()
  );
}

async function getAppointments() {
  const snapshot = await getDocs(collection(db, "appointments"));

  const data: Record<string, CalendarEvents> = {};

  snapshot.forEach((doc) => {
    data[doc.id] = doc.data() as CalendarEvents;
  });

  return data;
}

export async function getAvailableSlots(selectedDate: Date) {
  const appointments = await getAppointments();

  const bookedTimes = new Set(
    Object.values(appointments)
      .filter((item) => isSameDay(item.startTime, selectedDate))
      .map((item) => extractTime(item.startTime))
  );

  const slots = generateSlots();

  return slots
    .filter((time) => !bookedTimes.has(time))
    .map((time, index) => ({
      id: index,
      time,
    }));
}