export type Role = 'PHARMACIST' | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export const AUTH_COOKIE_NAME = 'medifinder_auth';

export function encodeAuthPayload(user: AuthUser): string {
  return btoa(JSON.stringify(user));
}

export function decodeAuthPayload(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.id && payload.email && payload.role) {
      return payload as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
}
