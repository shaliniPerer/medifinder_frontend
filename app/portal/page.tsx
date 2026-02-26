import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';

export default async function PortalPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/portal/login');
  }

  const user = decodeAuthPayload(token);

  if (!user) {
    redirect('/portal/login');
  }

  if (user.role === 'SUPER_ADMIN') {
    redirect('/portal/admin/dashboard');
  }

  redirect('/portal/pharmacist/dashboard');
}
