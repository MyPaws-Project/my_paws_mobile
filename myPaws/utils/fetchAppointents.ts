import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import type { CalendarEvents } from "./generateSlots";

export const getAppointments = async () => {
  const snapshot = await getDocs(collection(db, "appointments"));

  const appointments: Record<string, CalendarEvents> = {};

  snapshot.forEach((doc) => {
    appointments[doc.id] = doc.data() as CalendarEvents;
  });

  return appointments;
};