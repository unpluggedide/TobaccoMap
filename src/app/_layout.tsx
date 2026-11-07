import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();

  // Kurz warten, bis Firebase weiß, ob jemand eingeloggt ist
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
