
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import QRCode from 'qrcode';
import { getEmergencyInfo } from '../lib/emergency';

export default function Emergency() {
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    (async () => {
      const info = await getEmergencyInfo();
      const payload = JSON.stringify(info);
      const dataUrl = await QRCode.toDataURL(payload);
      setUri(dataUrl);
    })();
  }, []);

  return (
    <View style={{ padding: 16, alignItems:'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Emergency Card</Text>
      {uri ? <Image source={{ uri }} style={{ width: 200, height: 200 }} /> : null}
      <Text style={{ marginTop: 12, textAlign:'center' }}>Scan to access your emergency regimen (stored in app).</Text>
    </View>
  );
}
