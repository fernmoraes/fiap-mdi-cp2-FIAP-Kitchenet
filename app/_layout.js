import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { verificarSessao } from './auth';

export default function RootLayout() {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    verificarSessao().then(user => {
      if (user) {
        router.replace('/(app)/perfil');
      } else {
        router.replace('/(auth)/');
      }
      setVerificando(false);
    });
  }, []);

  if (verificando) {
    return (
      <View style={{ flex: 1, backgroundColor: '#262626', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F23064" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
