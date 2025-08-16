
export type UUID = string;

export type PrescriptionCategory = 'medication' | 'supply';

export interface Prescription {
  id: UUID;
  user_id: UUID;
  name: string;
  category: PrescriptionCategory;
  dosage?: string;
  frequency?: string;
  pharmacy_id?: UUID;
  refill_quantity?: number;
  remaining_quantity?: number;
  insurance_cost?: number;
}

export interface ProviderContact {
  id: UUID;
  user_id: UUID;
  name: string;
  email?: string;
  phone?: string;
}

export interface PharmacyContact {
  id: UUID;
  user_id: UUID;
  name: string;
  email?: string;
  address?: string;
}

export const daysRemaining = (remaining: number, perDay: number) => {
  if (!perDay) return Infinity;
  return Math.floor(remaining / perDay);
};
