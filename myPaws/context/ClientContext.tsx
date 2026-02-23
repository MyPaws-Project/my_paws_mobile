import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import { useAuth } from "./AuthContext";

export type Client = {
  uid: string;
  email: string | null;
  fullName: string;
  phone: string;
  notes: string;
  clinicId: string | null;
  role: "client";
  active: boolean;
  photoURL: string;
  address: string;
};

type ClientContextType = {
  client: Client | null;
  setClient: React.Dispatch<React.SetStateAction<Client | null>>;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (loading || !user) {
      setClient(null);
      return;
    }

    const loadClient = async () => {
      try {
        console.log("📥 Loading client:", user.uid);

        const ref = doc(db, "clients", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.warn("⚠️ Client document does not exist");
          setClient(null);
          return;
        }

        setClient(snap.data() as Client);
        console.log("✅ Client loaded");
      } catch (err) {
        console.error("❌ Failed to load client", err);
        setClient(null);
      }
    };

    loadClient();
  }, [user, loading]);

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export const useClient = () => {
  const ctx = useContext(ClientContext);
  if (ctx === undefined) {
    throw new Error("useClient must be used inside ClientProvider");
  }
  return ctx;
};
