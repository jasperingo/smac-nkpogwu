import type { Metadata } from 'next';
import Link from 'next/link';
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
    return (
      <div className="my-4 p-4 bg-foreground text-center">
        <p className="mb-4 font-bold text-xl">User is not an administrator</p>

        <Link href="/" className="py-2 px-4 text-on-primary bg-primary border border-primary hover:bg-primary-variant">Main website</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Breadcrumbs excludeRoot />
      
      {children}
    </div>
  );
}
