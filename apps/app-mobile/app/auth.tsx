
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function Auth() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) router.replace('/');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const send = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'meditrack://auth' } });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email', 'Magic link sent.');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>MediTrack</Text>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} value={email} onChangeText={setEmail} />
      <TouchableOpacity style={{ padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }} onPress={send}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Send Magic Link</Text>
      </TouchableOpacity>
    </View>
  );
}
