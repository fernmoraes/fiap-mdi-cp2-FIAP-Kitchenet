import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import { solicitarPermissaoNotificacoes } from "./notifications";

function RootNavigator() {
  const { carregando, usuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando) {
      if (usuario) {
        router.replace("/(app)/perfil");
      } else {
        router.replace("/(auth)/");
      }
    }
  }, [carregando]);

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#262626",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
    <AuthProvider>
      <AppDataProvider>
        <RootNavigator />
      </AppDataProvider>
    </AuthProvider>
  );
}
