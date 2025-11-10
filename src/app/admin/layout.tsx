import type { Metadata } from 'next';
import AdminLayoutHeader from './header';
import { getSession } from '@/utils/session';
import { findUserById } from '@/services/user-service';

export const metadata: Metadata = {
  title: 'Admin Portal - ST Matthew\'s Anglican Church Nkpogwu',
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();

  const user = await (session === null || session.userId === undefined ? null : findUserById(session.userId));

  return (
    <>
      <AdminLayoutHeader user={user} />
      
      <main className={user !== null ? 'mt-[4.3rem] pb-24 lg:ml-72' : ''}>
        { children }
      </main>
    </>
  );
}
