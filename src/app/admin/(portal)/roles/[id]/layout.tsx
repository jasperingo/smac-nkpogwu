import { notFound } from 'next/navigation';
import { findRoleAndGroupById } from '@/services/role-service';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

export default async function AdminRoleLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const role = await findRoleAndGroupById(id);

  if (role === null) {
    notFound();
  }

  return (
    <>
      <ItemPageTopDetails id={role.roles.id} title={`${ role.roles.name }${ role.groups ? ` (${role.groups.name})` : '' }`} />

      <TabList 
        path={`/admin/roles/${id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Assignees',
            href: '/assignees',
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
