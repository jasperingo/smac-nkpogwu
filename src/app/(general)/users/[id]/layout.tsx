import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import { UserDefaultImage } from '@/models/entity';
import { findUserById } from '@/services/user-service';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

export default async function UserLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const session = await getSession();
     
  if (session === null) {
    redirect('/sign-in');
  }

  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const user = await findUserById(id);

  if (user === null) {
    notFound();
  }

  return (
    <div className="container mx-auto p-2">
      <ItemPageTopDetails 
        imageUrl={user.imageUrl ?? UserDefaultImage} 
        title={`${user.title ?? ''} ${user.firstName} ${user.lastName} ${user.otherName ?? ''}`} 
      />

      <TabList 
        path={`/users/${user.id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Roles',
            href: '/roles',
          },
          { 
            text: 'Groups',
            href: '/groups',
          },
          { 
            text: 'Programs',
            href: '/programs',
          },
          { 
            text: 'Program coordinations',
            href: '/program-coordinations',
          },
        ]} 
      />

      { children }
    </div>
  );
}
