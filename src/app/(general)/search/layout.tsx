import { getSession } from '@/utils/session';
import SearchTabs from './tabs';

export default async function SearchLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();

  return (
    <>
      <SearchTabs loggedIn={session !== null} />

      { children }
    </>
  );
}
