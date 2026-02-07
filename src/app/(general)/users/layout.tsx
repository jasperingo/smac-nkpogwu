import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';

export const dynamic = 'force-dynamic';

export default async function UsersLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
     
  if (session === null) {
    redirect('/sign-in');
  }

  return children;
}
