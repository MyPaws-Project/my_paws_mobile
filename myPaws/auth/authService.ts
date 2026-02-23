import { signInWithEmailAndPassword, User, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { ensureClientExists } from "./clientService";

export const handleLogin = async (
  email: string,
  password: string
): Promise<User> => {
  if (!email || !password) {
    throw new Error("Missing credentials");
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    console.log("👤 ensureClientExists for:", cred.user.uid);
    await ensureClientExists(cred.user);

    return cred.user;
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    throw err;
  }
};

export const handleLogout = async (): Promise<void> => {
  await signOut(auth);
};

