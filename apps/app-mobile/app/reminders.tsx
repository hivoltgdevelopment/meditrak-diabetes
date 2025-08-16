import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import * as Notifications from "expo-notifications";
import { supabase } from "../src/api/supabase";
import { Button } from "../src/ui/components/Button";
import { toast } from "../src/ui/components/Toast";
import { spacing, type } from "../src/ui/theme";

export default function Reminders() {
  const [inSeconds, setInSeconds] = useState("10");
  const [title, setTitle] = useState("MediTrack");
  const [body, setBody] = useState("Time to take your medication");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const schedule = async () => {
    try {
      setSaving(true);
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) throw new Error("Please sign in");
      const secs = Number(inSeconds) || 10;
      const fireAt = new Date(Date.now() + secs * 1000).toISOString();

      const { error } = await supabase.from("reminders").insert({
        user_id: u.user.id, title, body, fire_at: fireAt
      });
      if (error) throw error;

      await Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: { seconds: secs } });
      toast.success(`Reminder in ${secs}s`);
    } catch (e:any) {
      toast.error(e.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ padding: spacing(4), gap: spacing(3) }}>
      <Text style={{ fontSize: type.h2, fontWeight: "700" }}>Reminders</Text>
      <Text>Title</Text>
      <TextInput style={input} value={title} onChangeText={setTitle} />
      <Text>Message</Text>
      <TextInput style={input} value={body} onChangeText={setBody} />
      <Text>Seconds from now</Text>
      <TextInput style={input} value={inSeconds} onChangeText={setInSeconds} keyboardType="numeric" />
      <Button title={saving ? "Scheduling..." : "Schedule reminder"} onPress={schedule} loading={saving} />
    </View>
  );
}
const input = { borderWidth: 1, borderRadius: 12, padding: 10, borderColor: "#E5E7EB" } as const;
