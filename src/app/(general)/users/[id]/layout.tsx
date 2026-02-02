import { cache } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserLock } from 'lucide-react';
import { getSession } from '@/utils/session';
import { UserDefaultImage } from '@/models/entity';
import { findUserById } from '@/services/user-service';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

const cachedFindUserById = cache(findUserById);

export async function generateMetadata( { params }: Readonly<{ params: Promise<{ id: string }>; }>): Promise<Metadata> {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return {};
  }

  const user = await cachedFindUserById(id);

  if (user === null) {
    return {};
  }

  const userFullName = `${user.title ?? ''} ${user.firstName} ${user.lastName} ${user.otherName ?? ''}`;

  return {
    title: userFullName + PAGE_METADATA_TITLE_SUFFIX,
    description: 'User profile details for ' + userFullName,
  }
}

export default async function UserLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const session = await getSession();

  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const user = await cachedFindUserById(id);

  if (user === null) {
    notFound();
  }

  return (
    <>
      <ItemPageTopDetails 
        imageUrl={user.imageUrl ?? UserDefaultImage} 
        title={`${user.title ?? ''} ${user.firstName} ${user.lastName} ${user.otherName ?? ''}`} 
      >
        {
          session?.userId === id && user.isAdministrator && (
            <Link 
              href="/admin" 
              className="flex gap-2 items-center w-fit mx-auto mt-2 bg-primary text-on-primary px-4 py-2 hover:bg-primary-variant"
            >
              <UserLock />
              <span>Admin portal</span>
            </Link>
          )
        }
      </ItemPageTopDetails>

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
          { 
            text: 'Change password',
            href: '/update-password',
            remove: session?.userId !== id,
          },
        ]} 
      />

      { children }
    </>
  );
}
