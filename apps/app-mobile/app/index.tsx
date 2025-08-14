
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

type Rx = { id: string; name: string; category: string; remaining_quantity: number; frequency: string | null };

export default function Home() {
  const [items, setItems] = useState<Rx[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (!data.session) router.replace('/auth'); });
    const load = async () => {
      const { data, error } = await supabase.from('prescriptions').select('id,name,category,remaining_quantity,frequency').limit(50);
      if (!error && data) setItems(data as Rx[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator /></View>;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Prescriptions</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>{item.category} • Remaining: {item.remaining_quantity}</Text>
            <Text>{item.frequency || ''}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Link href="/add" asChild>
          <TouchableOpacity style={{ flex:1, padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Add Rx</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/reminders" asChild>
          <TouchableOpacity style={{ flex:1, padding: 16, backgroundColor: '#111827', borderRadius: 12 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Reminders</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <Link href="/inventory" asChild>
          <TouchableOpacity style={{ flex:1, padding: 16, backgroundColor: '#0f766e', borderRadius: 12 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Inventory</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/reports" asChild>
          <TouchableOpacity style={{ flex:1, padding: 16, backgroundColor: '#6b21a8', borderRadius: 12 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Reports</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Link href="/emergency" asChild>
        <TouchableOpacity style={{ marginTop: 8, padding: 16, backgroundColor: '#b91c1c', borderRadius: 12 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: '700' }}>Emergency Card</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
