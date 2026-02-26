export interface PharmacistRecord {
  id: string;
  name: string;
  email: string;
  pharmacy: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Module-level store for mock data (dev only; resets on server restart)
export const mockPharmacistStore: PharmacistRecord[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@healthplus.com',
    pharmacy: 'Health Plus Pharmacy',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@careplus.com',
    pharmacy: 'Care Pharmacy',
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@medicare.com',
    pharmacy: 'MediCare Store',
    status: 'inactive',
    createdAt: '2024-02-10',
  },
];
