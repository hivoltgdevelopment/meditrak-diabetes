import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { Link } from "expo-router";
import { usePrescriptions } from "../src/hooks/usePrescriptions";
import { registerPushToken } from "../src/api/notifications";
import { Card } from "../src/ui/components/Card";
import { colors, type, spacing } from "../src/ui/theme";
import { supabase } from "../src/api/supabase";

export default function HomeScreen() {
  const { data, loading, error, reload } = usePrescriptions();
  const [threshold, setThreshold] = useState(5);

  useEffect(() => {
    registerPushToken().catch(() => {});
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) return;
      const { data } = await supabase.from("user_settings").select("low_stock_threshold").eq("user_id", u.user.id).single();
      if (data?.low_stock_threshold) setThreshold(data.low_stock_threshold);
    })();
  }, []);

  return (
    <View style={{ padding: spacing(4), gap: spacing(3), flex: 1 }}>
      <Text style={{ fontSize: type.h1, fontWeight: "700" }}>Your prescriptions</Text>
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListEmptyComponent={!loading ? <Text>No prescriptions yet. Add one →</Text> : null}
        renderItem={({ item }) => {
          const low = (item.remaining_quantity ?? 0) <= threshold;
          return (
            <Card style={{ marginBottom: spacing(3) }}>
              <Text style={{ fontWeight: "600" }}>{item.name}</Text>
              {item.dosage ? <Text>{item.dosage}</Text> : null}
              {item.frequency ? <Text>{item.frequency}</Text> : null}
              <Text>Remaining: {item.remaining_quantity}</Text>
              {low && (
                <Text style={{ color: colors.warning, marginTop: spacing(1) }}>
                  Low stock (≤ {threshold})
                </Text>
              )}
            </Card>
          );
        }}
      />

      <View style={{ flexDirection: "row", gap: spacing(4) }}>
        <Link href="/add" style={{ color: colors.accent }}>+ Add</Link>
        <Link href="/inventory" style={{ color: colors.accent }}>Inventory</Link>
        <Link href="/reminders" style={{ color: colors.accent }}>Reminders</Link>
        {/* Dev helper: seed one item if empty */}
        {(!loading && data.length === 0) && (
          <Link
            href=""
            onPress={async () => {
              const { data: u } = await supabase.auth.getUser();
              if (!u?.user) return;
              await supabase.from("prescriptions").insert({
                user_id: u.user.id, name: "Metformin", category: "medication", remaining_quantity: 30
              });
              reload();
            }}
            style={{ color: colors.primary }}
          >
            Seed sample
          </Link>
        )}
      </View>
    </View>
  );
}
