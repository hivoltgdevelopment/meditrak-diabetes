
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '../lib/supabase';

export default function Reports() {
  const exportCsv = async () => {
    const { data, error } = await supabase.from('prescriptions').select('name,category,remaining_quantity,frequency');
    if (error) return Alert.alert('Error', error.message);
    const header = 'name,category,remaining,frequency\n';
    const rows = (data||[]).map(d => [d.name, d.category, d.remaining_quantity, d.frequency||''].join(','));
    const csv = header + rows.join('\n');
    const path = FileSystem.cacheDirectory + 'meditrack-prescriptions.csv';
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(path, { mimeType: 'text/csv' });
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Reports</Text>
      <TouchableOpacity style={{ padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }} onPress={exportCsv}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Export CSV</Text>
      </TouchableOpacity>
    </View>
  );
}
