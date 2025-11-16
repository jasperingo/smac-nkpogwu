import { redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';
import UserListItem from '@/components/user-list-item';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function SearchUsersPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string; page?: string; }>; }>) {
  const session = await getSession();

  if (session === null) {
    redirect('/sign-in');
  }

  const { page, search } = await searchParams;

  const users = await findUsers({ search }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={users.data}
        renderItem={(user) => <UserListItem key={user.id} user={user} />}
      />
    
      <PaginationList path="/search/users" pagination={users} params={new Map([['search', search]])} />
    </section>
  );
}
