import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { supabase } from "../lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function Layout() {
  useEffect(() => {
    async function register() {
      if (!Device.isDevice) return;
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("user_push_tokens")
          .upsert(
            { user_id: user.id, expo_push_token: token },
            { onConflict: "user_id,expo_push_token" },
          );
      }
    }
    register();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: "MediTrack" }} />
      <Stack.Screen name="add" options={{ title: "Add Prescription" }} />
      <Stack.Screen name="reminders" options={{ title: "Reminders" }} />
      <Stack.Screen name="inventory" options={{ title: "Inventory" }} />
      <Stack.Screen name="reports" options={{ title: "Reports" }} />
      <Stack.Screen name="emergency" options={{ title: "Emergency Card" }} />
    </Stack>
  );
}
