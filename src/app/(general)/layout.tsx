import GeneralLayoutHeader from './header';
import { getSession } from '@/utils/session';
import { findUserById } from '@/services/user-service';
import Breadcrumbs from '@/components/breadcrumbs';

export default async function GeneralLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  
  const user = await (session === null || session.userId === undefined ? null : findUserById(session.userId));

  return (
    <>
      <GeneralLayoutHeader user={user} />
      
      <main className="mt-32 lg:mt-[10.5rem] pb-24">
        
        <div className="container mx-auto p-2">

          <Breadcrumbs />
          
          { children }

        </div>

      </main>
    </>
  );
}
