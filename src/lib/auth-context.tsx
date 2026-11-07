import {
    User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { auth, db } from "./firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase meldet, sobald klar ist, ob jemand eingeloggt ist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const signUp = async (username: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    await updateProfile(cred.user, { displayName: username.trim() });
    // Nutzerprofil für Punkte und Rangliste anlegen
    await setDoc(doc(db, "users", cred.user.uid), {
      username: username.trim(),
      points: 0,
      locationsCreated: 0,
      verificationsCount: 0,
      ratingsCount: 0,
      createdAt: serverTimestamp(),
    });
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth muss innerhalb von AuthProvider benutzt werden");
  return ctx;
}
