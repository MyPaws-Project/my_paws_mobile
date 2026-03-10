import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

export type Appointment = {
  id: string;
  startTime: any;
  clinicId: string;
  petId: string;
  clientId: string;
  reason: string;
};

export async function getAppointments(clientId: string) {
  const snapshot = await getDocs(collection(db, "appointments"));

  const appointments: Appointment[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (data.clientId === clientId) {
      appointments.push({
        id: doc.id,
        ...data,
      } as Appointment);
    }
  });

  appointments.sort(
    (a, b) =>
      new Date(a.startTime.seconds * 1000).getTime() -
      new Date(b.startTime.seconds * 1000).getTime()
  );

  return appointments;
}