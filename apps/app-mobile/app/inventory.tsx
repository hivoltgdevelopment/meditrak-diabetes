import React, { useState } from "react";
import { View, Text, FlatList, TextInput } from "react-native";
import { supabase } from "../src/api/supabase";
import { usePrescriptions } from "../src/hooks/usePrescriptions";
import { Button } from "../src/ui/components/Button";
import { Card } from "../src/ui/components/Card";
import { toast } from "../src/ui/components/Toast";
import { spacing, type, colors } from "../src/ui/theme";

export default function Inventory() {
  const { data, reload } = usePrescriptions();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const threshold = 5;

  const apply = async (id: string) => {
    const newQty = Number(edits[id] ?? "");
    if (Number.isNaN(newQty)) return toast.error("Enter a valid number");
    setBusyId(id);
    const { error } = await supabase.from("prescriptions").update({ remaining_quantity: newQty }).eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Quantity updated");
    setEdits((e) => ({ ...e, [id]: "" }));
    await reload();

    if (newQty <= threshold) {
      const { data: u } = await supabase.auth.getUser();
      if (u?.user) {
        await supabase.functions.invoke("send-low-stock-push", { body: { user_id: u.user.id } });
      }
    }
  };

  return (
    <View style={{ padding: spacing(4), gap: spacing(3), flex: 1 }}>
      <Text style={{ fontSize: type.h2, fontWeight: "700" }}>Inventory</Text>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: spacing(3) }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            <Text>Current: {item.remaining_quantity}</Text>
            <View style={{ flexDirection: "row", gap: spacing(2), marginTop: spacing(2) }}>
              <TextInput
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, minWidth: 100 }}
                placeholder="New qty"
                keyboardType="numeric"
                value={edits[item.id] ?? ""}
                onChangeText={(t) => setEdits((e) => ({ ...e, [item.id]: t }))}
              />
              <Button title={busyId === item.id ? "Saving..." : "Apply"} onPress={() => apply(item.id)} />
            </View>
          </Card>
        )}
      />
    </View>
  );
}
