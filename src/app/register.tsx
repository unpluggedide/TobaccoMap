import { useAuth } from "@/lib/auth-context";
import { Link } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from "react-native";

function fehlerText(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Diese E-Mail-Adresse wird bereits verwendet.";
    case "auth/invalid-email":
      return "Bitte gib eine gültige E-Mail-Adresse ein.";
    case "auth/weak-password":
      return "Das Passwort ist zu schwach (mindestens 6 Zeichen).";
    case "auth/network-request-failed":
      return "Keine Verbindung. Bitte prüfe dein Internet.";
    default:
      return "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
  }
}

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    const name = username.trim();
    if (name.length < 3 || name.length > 20) {
      setError("Der Benutzername muss 3 bis 20 Zeichen lang sein.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await signUp(name, email, password);
      // Weiterleitung passiert automatisch durch _layout.tsx
    } catch (e: any) {
      setError(fehlerText(e?.code ?? ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>TobaccoMap</Text>
        <Text style={styles.subtitle}>Account erstellen</Text>

        <TextInput
          style={styles.input}
          placeholder="Benutzername (wird in der Rangliste angezeigt)"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          maxLength={20}
          value={username}
          onChangeText={setUsername}
        />
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
          placeholder="Passwort (mindestens 6 Zeichen)"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={styles.button}
          onPress={handleRegister}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrieren</Text>
          )}
        </Pressable>

        <Link href="/login" style={styles.link}>
          Schon einen Account? Zur Anmeldung
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#0f172a" },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
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
