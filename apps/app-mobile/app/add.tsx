
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Add() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [category, setCategory] = useState<'medication' | 'supply'>('medication');
  const router = useRouter();

  const save = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      Alert.alert('Error', 'No session found');
      return;
    }
    const { error } = await supabase
      .from('prescriptions')
      .insert({ name, dosage, frequency, category, user_id: session.user.id });
    if (error) Alert.alert('Error', error.message);
    else {
      setName('');
      setDosage('');
      setFrequency('');
      setCategory('medication');
      router.replace('/');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Name</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={name} onChangeText={setName} />
      <Text>Dosage</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={dosage} onChangeText={setDosage} />
      <Text>Frequency</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={frequency} onChangeText={setFrequency} />
      <TouchableOpacity style={{ padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }} onPress={save}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
