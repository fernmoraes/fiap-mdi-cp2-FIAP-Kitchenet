import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AuthLayout() {
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
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <Ionicons name="id-card-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
