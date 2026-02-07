import { Metadata } from 'next';
import SearchTabs from './tabs';
import { getSession } from '@/utils/session';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search' + PAGE_METADATA_TITLE_SUFFIX,
  description: 'Search results for programs, groups, contacts, and users',
};

export default async function SearchLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();

  return (
    <>
      <SearchTabs loggedIn={session !== null} />

      { children }
    </>
  );
}
