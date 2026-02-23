import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

export type UserWithCoords = {
  id: string;
  clinicName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  clinicAddress: string;
};

export async function fetchUsersWithCoords(): Promise<UserWithCoords[]> {
  const snapshot = await getDocs(collection(db, "publicUsers"));

  const users = await Promise.all(
    snapshot.docs.map(async userDoc => {
      const data = userDoc.data();

      return {
        id: userDoc.id,
        clinicName: data.clinicName ?? "Unknown",
        coordinates: data.coordinates,
        clinicAddress: data.clinicAddress
      };
    }
    )
  );

  return users.filter(Boolean) as UserWithCoords[];
}