import { notFound } from 'next/navigation';
import { getSession } from '@/utils/session';
import { GroupDefaultImage } from '@/models/entity';
import { findGroupById } from '@/services/group-service';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

export default async function GroupLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const session = await getSession();

  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const group = await findGroupById(id);

  if (group === null) {
    notFound();
  }

  return (
    <>
      <ItemPageTopDetails title={group.name} imageUrl={group.imageUrl ?? GroupDefaultImage} />
      
      <TabList 
        path={`/groups/${group.id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Members',
            href: '/members',
            remove: session === null,
          },
          { 
            text: 'Sub groups',
            href: '/sub-groups',
          },
          { 
            text: 'Programs',
            href: '/programs',
          },
          {
            text: 'Roles',
            href: '/roles',
          },
          {
            text: 'Role assignees',
            href: '/role-assignees',
          },
        ]} 
      />

      { children }
    </>
  );
}
