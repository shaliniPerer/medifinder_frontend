import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '@/lib/dynamodb';

export interface UserRecord {
  email: string;
  id: string;
  name: string;
  role: 'PHARMACIST' | 'SUPER_ADMIN';
  passwordHash: string;
  pharmacyName?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLES.USERS, Key: { email } })
  );
  return (result.Item as UserRecord) ?? null;
}

export async function createUser(user: UserRecord): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.USERS,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)',
    })
  );
}

export async function listPharmacists(): Promise<UserRecord[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLES.USERS,
      FilterExpression: '#role = :role',
      ExpressionAttributeNames: { '#role': 'role' },
      ExpressionAttributeValues: { ':role': 'PHARMACIST' },
    })
  );
  return (result.Items as UserRecord[]) ?? [];
}

export async function updateUserStatus(
  email: string,
  status: 'active' | 'inactive'
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: TABLES.USERS,
      Key: { email },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status },
    })
  );
}

export async function updateUser(
  email: string,
  fields: Partial<Pick<UserRecord, 'name' | 'pharmacyName' | 'status'>>
): Promise<UserRecord | null> {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return getUserByEmail(email);

  const updateParts = entries.map(([k], i) => `#f${i} = :v${i}`);
  const names = Object.fromEntries(entries.map(([k], i) => [`#f${i}`, k]));
  const values = Object.fromEntries(entries.map(([, v], i) => [`:v${i}`, v]));

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLES.USERS,
      Key: { email },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    })
  );
  return (result.Attributes as UserRecord) ?? null;
}

export async function deleteUser(email: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: TABLES.USERS, Key: { email } })
  );
}
