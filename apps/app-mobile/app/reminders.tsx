
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';

type Row = { id: string; name: string; days_remaining: number | null };

export default function Reminders() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = async () => {
    const { data, error } = await supabase.from('v_prescription_days_remaining').select('id,name,days_remaining');
    if (error) Alert.alert('Error', error.message);
    else setRows(data as Row[]);
  };

  useEffect(() => { load(); }, []);

  const sendRefill = async (id: string) => {
    // Call Edge Function
    try {
      const url = `${supabase.functions.url('/send-refill-email')}`; // this is a helper in supabase-js v2
      const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prescription_id: id, pharmacy_email: 'pharmacy@example.com' }) });
      const js = await resp.json();
      if (!js.ok) throw new Error(js.error || 'Failed');
      Alert.alert('Refill requested');
    } catch (e:any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Reminders</Text>
      <FlatList
        data={rows}
        keyExtractor={(i)=>i.id}
        renderItem={({item}) => (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>Days remaining: {item.days_remaining ?? '—'}</Text>
            {item.days_remaining !== null && item.days_remaining <= 5 && (
              <TouchableOpacity style={{ marginTop: 8, padding: 12, backgroundColor: '#dc2626', borderRadius: 8 }} onPress={()=>sendRefill(item.id)}>
                <Text style={{ textAlign:'center', color: 'white', fontWeight: '700'}}>Request Refill</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}
