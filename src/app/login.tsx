import { useAuth } from "@/lib/auth-context";
import { Link } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput
} from "react-native";

function fehlerText(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-Mail oder Passwort ist falsch.";
    case "auth/invalid-email":
      return "Bitte gib eine gültige E-Mail-Adresse ein.";
    case "auth/too-many-requests":
      return "Zu viele Versuche. Bitte warte kurz und versuche es erneut.";
    case "auth/network-request-failed":
      return "Keine Verbindung. Bitte prüfe dein Internet.";
    default:
      return "Anmeldung fehlgeschlagen. Bitte versuche es erneut.";
  }
}

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
      // Weiterleitung passiert automatisch durch _layout.tsx
    } catch (e: any) {
      setError(fehlerText(e?.code ?? ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>TobaccoMap</Text>
      <Text style={styles.subtitle}>Melde dich an</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Anmelden</Text>
        )}
      </Pressable>

      <Link href="/register" style={styles.link}>
        Noch kein Account? Jetzt registrieren
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  error: { color: "#f87171", marginBottom: 12, textAlign: "center" },
  button: {
    backgroundColor: "#475569",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#94a3b8", textAlign: "center", marginTop: 20 },
});
