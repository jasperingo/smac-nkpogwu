import type { Metadata } from 'next';
import AdminLayoutHeader from './header';
import { getSession } from '@/utils/session';

export const metadata: Metadata = {
  title: 'Admin Portal - ST Matthew\'s Anglican Church',
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();

  return (
    <>
      <AdminLayoutHeader session={session} />
      
      <main className={session ? 'mt-[4.3rem] pb-24 lg:ml-72' : ''}>
        {children}
      </main>
    </>
  );
}
