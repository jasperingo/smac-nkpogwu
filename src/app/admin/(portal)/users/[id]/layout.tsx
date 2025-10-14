import { notFound } from 'next/navigation';
import TabList from '@/components/tab-list';
import { findUserById } from '@/services/user-service';
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
      <ItemPageTopDetails id={user.id} title={`${user.firstName} ${user.lastName}`} imageUrl='/user.png' />

      <TabList 
        path={`/admin/users/${user.id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Groups',
            href: '/groups',
          },
        ]} 
      />

      { children }
    </>
  );
}
