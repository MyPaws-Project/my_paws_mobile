import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../auth/firebase";

type AppointmentInput = {
  selectedDate: Date;
  time: string;
  petId: string;
  clientId: string;
  clinicId?: string;
  reason: string;
};

export async function scheduleAppointment({
  selectedDate,
  time,
  petId,
  clientId,
  clinicId,
  reason,
}: AppointmentInput) {
  
  const [hours, minutes] = time.split(":");

  const appointmentDate = new Date(selectedDate);
  appointmentDate.setHours(Number(hours));
  appointmentDate.setMinutes(Number(minutes));
  appointmentDate.setSeconds(0);
  appointmentDate.setMilliseconds(0);

  await addDoc(collection(db, "appointments"), {
    startTime: Timestamp.fromDate(appointmentDate),
    petId,
    clientId,
    clinicId,
    reason,
  });
}