import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import Breadcrumbs from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Admin Portal - ST Matthew\'s Anglican Church',
};

export default async function AdminPortalLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();

  if (session === null) {
    redirect('/admin');
  }
  
  if (!session.userIsAdmin) {
    redirect('/');
  }

  return (
    <div className="p-4">
      <Breadcrumbs excludeRoot />
      
      { children }
    </div>
  );
}
