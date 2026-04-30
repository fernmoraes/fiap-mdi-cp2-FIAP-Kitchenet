import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { solicitarPermissaoNotificacoes } from "./notifications";

function RootNavigator() {
  const { carregando, usuario } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!carregando) {
      if (usuario) {
        router.replace("/(tabs)/perfil");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [carregando]);

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F23064" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  useEffect(() => {
    solicitarPermissaoNotificacoes();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <RootNavigator />
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
