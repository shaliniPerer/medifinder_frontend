import { redirect } from 'next/navigation';

// Backwards-compatible route: redirect to unified portal login
export default function PharmacistLoginPage() {
  redirect('/portal/login');
}
