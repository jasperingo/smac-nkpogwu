import type { Metadata } from 'next';
import GeneralLayoutHeader from './header';
import { getSession } from '@/utils/session';
import { findUserById } from '@/services/user-service';

export const metadata: Metadata = {
  title: 'ST Matthew\'s Anglican Church Nkpogwu',
};

export default async function GeneralLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  
  const user = await (session === null || session.userId === undefined ? null : findUserById(session.userId));

  return (
    <>
      <GeneralLayoutHeader user={user} />
      
      <main className="mt-[10.5rem] pb-24">
        { children }
      </main>
    </>
  );
}
