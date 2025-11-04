import { notFound } from 'next/navigation';
import { UserDefaultImage } from '@/models/entity';
import { findUserById } from '@/services/user-service';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

export default async function AdminUserLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const user = await findUserById(id);

  if (user === null) {
    notFound();
  }

  return (
    <>
      <ItemPageTopDetails 
        id={user.id} 
        imageUrl={user.imageUrl ?? UserDefaultImage} 
        title={`${user.title ?? ''} ${user.firstName} ${user.lastName} ${user.otherName ?? ''}`} 
      />

      <TabList 
        path={`/admin/users/${user.id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Upload image',
            href: '/upload-image',
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
          { 
            text: 'Delete',
            href: '/delete',
          },
        ]} 
      />

      { children }
    </>
  );
}
