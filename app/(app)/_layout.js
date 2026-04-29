import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#F23064',
      tabBarStyle: { backgroundColor: '#262626' },
      headerStyle: { backgroundColor: '#262626' },
      headerTintColor: '#F23064',
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
