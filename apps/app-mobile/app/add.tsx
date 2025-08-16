import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../src/api/supabase";
import { Button } from "../src/ui/components/Button";
import { toast } from "../src/ui/components/Toast";
import { spacing, type } from "../src/ui/theme";

export default function Add() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [category] = useState<"medication" | "supply">("medication");
  const [qty, setQty] = useState("0");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setSaving(false); return toast.error("Please sign in"); }

    const { error } = await supabase.from("prescriptions").insert({
      user_id: u.user.id,
      name: name.trim(),
      dosage: dosage.trim() || null,
      frequency: frequency.trim() || null,
      category,
      remaining_quantity: Number(qty) || 0,
    });

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.replace("/");
  };

  return (
    <View style={{ padding: spacing(4), gap: spacing(3) }}>
      <Text style={{ fontSize: type.h2, fontWeight: "700" }}>Add prescription</Text>
      <Text>Name</Text>
      <TextInput style={input} value={name} onChangeText={setName} placeholder="Metformin 500 mg" />
      <Text>Dosage</Text>
      <TextInput style={input} value={dosage} onChangeText={setDosage} placeholder="500 mg" />
      <Text>Frequency</Text>
      <TextInput style={input} value={frequency} onChangeText={setFrequency} placeholder="2×/day" />
      <Text>Starting quantity</Text>
      <TextInput style={input} value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="30" />
      <Button title={saving ? "Saving..." : "Save"} onPress={save} loading={saving} />
    </View>
  );
}
const input = { borderWidth: 1, borderRadius: 12, padding: 12, borderColor: "#E5E7EB" } as const;
