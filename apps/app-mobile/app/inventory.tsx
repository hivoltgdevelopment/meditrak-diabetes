
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';

type Inv = { id:string; lot_number:string|null; expiration_date:string|null; quantity:number; prescriptions: { name:string } };

export default function Inventory() {
  const [items, setItems] = useState<Inv[]>([]);
  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from('inventory').select('id,lot_number,expiration_date,quantity,prescriptions(name)');
      setItems(data as any || []);
    })();
  },[]);
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize:24, fontWeight:'600' }}>Inventory</Text>
      <FlatList
        data={items}
        keyExtractor={(i)=>i.id}
        renderItem={({item})=>(
          <View style={{ padding:12, borderWidth:1, borderRadius:10, marginVertical:6 }}>
            <Text style={{ fontWeight:'600' }}>{item.prescriptions?.name || '—'}</Text>
            <Text>Lot: {item.lot_number || '—'}</Text>
            <Text>Expires: {item.expiration_date || '—'}</Text>
            <Text>Qty: {item.quantity}</Text>
          </View>
        )}
      />
    </View>
  );
}
