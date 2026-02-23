import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export const ensureClientExists = async (user: User) => {
  if (!user?.uid) return;

  console.log("👤 ensureClientExists for:", user.uid);

  const ref = doc(db, "clients", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.log("🆕 Creating client document");

    await setDoc(ref, {
      active: true,
      uid: user.uid,
      email: user.email,
      role: "client",
      fullName: "Unknown",
      notes: "Add anything you'd like the clinic to know about you or your pet…",
      clinicId: null,
      photoURL: 'none',
      phone: "none",
      address: "none",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } else {
    console.log("✅ Client already exists");
  }
};
