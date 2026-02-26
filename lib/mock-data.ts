/** @deprecated Use lib/db/users.ts and lib/db/medicines.ts for DynamoDB-backed data. */
export interface PharmacistRecord {
  id: string;
  name: string;
  email: string;
  pharmacy: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
