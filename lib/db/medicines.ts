import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '@/lib/dynamodb';
import { randomUUID } from 'crypto';

export interface MedicineRecord {
  pharmacyId: string;
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lastUpdated: string;
}

export async function listMedicines(pharmacyId: string): Promise<MedicineRecord[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.MEDICINES,
      KeyConditionExpression: 'pharmacyId = :pid',
      ExpressionAttributeValues: { ':pid': pharmacyId },
    })
  );
  return (result.Items as MedicineRecord[]) ?? [];
}

export async function createMedicine(
  pharmacyId: string,
  data: Pick<MedicineRecord, 'name' | 'category' | 'quantity' | 'price'>
): Promise<MedicineRecord> {
  const item: MedicineRecord = {
    pharmacyId,
    id: randomUUID(),
    name: data.name,
    category: data.category,
    quantity: data.quantity,
    price: data.price,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  await docClient.send(new PutCommand({ TableName: TABLES.MEDICINES, Item: item }));
  return item;
}

export async function updateMedicine(
  pharmacyId: string,
  medicineId: string,
  fields: Partial<Pick<MedicineRecord, 'name' | 'category' | 'quantity' | 'price'>>
): Promise<MedicineRecord | null> {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return null;

  const today = new Date().toISOString().split('T')[0];
  const updateParts = [...entries.map(([k], i) => `#f${i} = :v${i}`), 'lastUpdated = :lu'];
  const names = Object.fromEntries(entries.map(([k], i) => [`#f${i}`, k]));
  const values = {
    ...Object.fromEntries(entries.map(([, v], i) => [`:v${i}`, v])),
    ':lu': today,
  };

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLES.MEDICINES,
      Key: { pharmacyId, id: medicineId },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    })
  );
  return (result.Attributes as MedicineRecord) ?? null;
}

export async function deleteMedicine(
  pharmacyId: string,
  medicineId: string
): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLES.MEDICINES,
      Key: { pharmacyId, id: medicineId },
    })
  );
}
