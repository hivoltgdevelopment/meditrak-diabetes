import { supabase } from './supabase';

export interface EmergencyInfo {
  medications: { name: string; dosage: string }[];
  contacts: { name: string; phone: string }[];
}

const DEFAULT_INFO: EmergencyInfo = {
  medications: [{ name: 'Insulin', dosage: '10 units' }],
  contacts: [{ name: 'Dr. Smith', phone: '555-123-4567' }],
};

export async function saveEmergencyInfo(info: EmergencyInfo) {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return;
  await supabase.from('users').update({ emergency_contact: info }).eq('id', session.user.id);
}

export async function getEmergencyInfo(): Promise<EmergencyInfo> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return DEFAULT_INFO;
  const { data: user } = await supabase
    .from('users')
    .select('emergency_contact')
    .eq('id', session.user.id)
    .single();
  if (user?.emergency_contact) {
    return user.emergency_contact as EmergencyInfo;
  }
  await saveEmergencyInfo(DEFAULT_INFO);
  return DEFAULT_INFO;
}
