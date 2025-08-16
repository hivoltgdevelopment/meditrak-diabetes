import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { supabase } from "../src/api/supabase";
import { Button } from "../src/ui/components/Button";
import { Card } from "../src/ui/components/Card";
import { toast } from "../src/ui/components/Toast";
import { spacing, type } from "../src/ui/theme";

export default function Providers() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("provider_contacts")
      .select("id,name,email,phone")
      .order("name");
    if (!error) setList(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) return toast.error("Please sign in");
    if (!name.trim()) return toast.error("Name is required");
    const { error } = await supabase
      .from("provider_contacts")
      .insert({ user_id: u.user.id, name: name.trim(), email: email.trim() || null, phone: phone.trim() || null });
    if (error) return toast.error(error.message);
    setName("");
    setEmail("");
    setPhone("");
    load();
  };

  return (
    <View style={{ padding: spacing(4), gap: spacing(3), flex: 1 }}>
      <Text style={{ fontSize: type.h2, fontWeight: "700" }}>Providers</Text>
      <TextInput style={input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Button title="Add" onPress={add} />
      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: spacing(2) }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            {item.email ? <Text>{item.email}</Text> : null}
            {item.phone ? <Text>{item.phone}</Text> : null}
          </Card>
        )}
      />
    </View>
  );
}

const input = { borderWidth: 1, borderRadius: 12, padding: 12, borderColor: "#E5E7EB" } as const;
