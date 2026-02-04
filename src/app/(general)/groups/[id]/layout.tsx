import { cache } from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import { findGroupById } from '@/services/group-service';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import { GroupDefaultImage, GroupEntityPrivacy } from '@/models/entity';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

const cachedFindGroupById = cache(findGroupById);

export async function generateMetadata( { params }: Readonly<{ params: Promise<{ id: string }>; }>): Promise<Metadata> {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return {};
  }

  const group = await cachedFindGroupById(id);

  if (group === null) {
    return {};
  }

  return {
    title: group.name + PAGE_METADATA_TITLE_SUFFIX,
    description: 'Group details for ' + group.name,
  }
}

export default async function GroupLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const session = await getSession();

  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const group = await cachedFindGroupById(id);

  if (group === null) {
    notFound();
  }

  if (group.privacy === GroupEntityPrivacy[1] && session === null) {
    redirect('/sign-in');
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
            text: 'Programs',
            href: '/programs',
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
