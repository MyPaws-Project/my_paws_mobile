import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../auth/firebase";

export type Vaccine = {
  key: string;
  name: string;
  doses: string[]; // dates stored as strings
};

export type MedicalHistory = {
  attending_veterinarian: string;
  createdAt: Timestamp;
  notes?: string;
  reason?: string;
  time_date: string;
  treatment?: string;
  type: string;
  updatedAt: Timestamp;
}

export type Photos = {
  createdAt: Timestamp;
  description: string;
  publicId: string;
  title: string;
  url: string;
}

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  photoUrl?: string;
  allergies: string;
  medication: string;
  gender: string;
  weight: string;
  vaccines?: Vaccine[]; // type above
  illnesses: string;
  notes?: string;
  photos?: Photos[]; // type above
  medicalHistory?: MedicalHistory[] // type above
};

export function useClientPets(clientId?: string) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setPets([]);
      setLoading(false);
      return;
    }

    const loadPets = async () => {
      try {
        setLoading(true);

        const petsRef = collection(db, "clients", clientId, "pets");
        const petsSnap = await getDocs(petsRef);

        const petsWithSubcollections = await Promise.all(
          petsSnap.docs.map(async (doc) => {
            const petId = doc.id;
            const petData = doc.data() as Omit<Pet, "id">;

            // 🔥 Photos subcollection
            const photosRef = collection(
              db,
              "clients",
              clientId,
              "pets",
              petId,
              "photos"
            );

            const photosSnap = await getDocs(photosRef);
            const photos = photosSnap.docs.map(p => ({
              id: p.id,
              ...p.data(),
            }));

            // 🔥 Medical History subcollection
            const medicalRef = collection(
              db,
              "clients",
              clientId,
              "pets",
              petId,
              "medicalHistory"
            );

            const medicalSnap = await getDocs(medicalRef);
            const medicalHistory = medicalSnap.docs.map(m => ({
              id: m.id,
              ...m.data(),
            }));

            return {
              id: petId,
              ...petData,
              photos,
              medicalHistory,
            };
          })
        );

        setPets(petsWithSubcollections);
      } catch (err) {
        console.error("Failed to load pets", err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [clientId]);

  return { pets, loading };
}
