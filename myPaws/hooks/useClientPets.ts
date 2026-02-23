import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

export type Pet = {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  age?: number;
  photoURL?: string;
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
        const snap = await getDocs(petsRef);

        setPets(
          snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Pet, "id">),
          }))
        );
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
