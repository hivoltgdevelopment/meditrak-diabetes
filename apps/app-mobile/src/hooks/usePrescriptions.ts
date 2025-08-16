import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

export type Prescription = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  remaining_quantity: number | null;
  pharmacy_id: string | null;
  insurance_cost: number | null;
};

export function usePrescriptions() {
  const [data, setData] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prescriptions')
      .select('id,name,dosage,frequency,remaining_quantity,pharmacy_id,insurance_cost')
      .order('name');
    if (error) setError(error.message);
    else setData((data as Prescription[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
