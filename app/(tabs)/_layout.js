import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AppLayout() {
  const { colors } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: { backgroundColor: colors.card },
      headerStyle: { backgroundColor: colors.card },
      headerTintColor: colors.primary,
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pedir"
        options={{
          title: 'Pedir',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="retirada"
        options={{
          title: 'Retirada',
          tabBarIcon: ({ color }) => <Ionicons name="bag-check-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
