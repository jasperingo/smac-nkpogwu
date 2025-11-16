'use client'

import { redirect, useSearchParams } from 'next/navigation';
import TabList from '@/components/tab-list';

export default function SearchTabs({ loggedIn }: { loggedIn: boolean; }) {
  const searchParams = useSearchParams();

  const search = searchParams.get('search');

  if (search === null || search.length === 0) {
    redirect('/');
  }

  return (
    <TabList 
      path="/search"
      items={[
        { 
          text: 'Programs',
          href: `?search=${search}`,
        },
        { 
          text: 'Users',
          href: `/users?search=${search}`,
          remove: !loggedIn,
        },
        { 
          text: 'Groups',
          href: `/groups?search=${search}`,
        },
        {
          text: 'Contacts',
          href: `/contacts?search=${search}`,
        },
      ]} 
    />
  );
}
