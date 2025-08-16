import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';

export async function registerPushToken() {
  const { status } = await Notifications.getPermissionsAsync();
  let final = status;
  if (final !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    final = req.status;
  }
  if (final !== 'granted') return null;

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId,
  });
  const token = tokenData.data;
  const { data: u } = await supabase.auth.getUser();
  if (u?.user && token) {
    await supabase
      .from('user_push_tokens')
      .upsert({ user_id: u.user.id, expo_push_token: token }, { onConflict: 'user_id,expo_push_token' });
  }
  return token;
}
