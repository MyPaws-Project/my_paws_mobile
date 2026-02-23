import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../auth/firebase";

export type ClinicOption = {
  id: string;
  name: string;
};

export function useClinics() {
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const q = query(
          collection(db, "publicUsers")
        );

        const snap = await getDocs(q);

        setClinics(
          snap.docs.map(doc => ({
            id: doc.id,
            name:
              doc.data().clinicName ??
              doc.data().fullName ??
              "Unnamed Clinic",
          }))
        );
      } catch (err) {
        console.error("Failed to load clinics", err);
      } finally {
        setLoading(false);
      }
    };

    loadClinics();
  }, []);

  return { clinics, loading };
}
