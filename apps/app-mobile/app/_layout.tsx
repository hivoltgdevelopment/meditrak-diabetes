
import { Stack } from 'expo-router';
export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: 'MediTrack' }} />
      <Stack.Screen name="add" options={{ title: 'Add Prescription' }} />
      <Stack.Screen name="reminders" options={{ title: 'Reminders' }} />
      <Stack.Screen name="inventory" options={{ title: 'Inventory' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
      <Stack.Screen name="emergency" options={{ title: 'Emergency Card' }} />
    </Stack>
  );
}
