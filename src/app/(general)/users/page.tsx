import { Metadata } from 'next';
import { UserEntityStatus } from '@/models/entity';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import UserListItem from '@/components/user-list-item';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export const metadata: Metadata = {
  title: 'Users' + PAGE_METADATA_TITLE_SUFFIX,
  description: 'List of registered users in the church',
};

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ page?: string; }> }) {
  const { page } = await searchParams;

  const users = await findUsers({ status: UserEntityStatus[1] }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={users.data}
        renderItem={(user) => <UserListItem key={user.id} user={user} />}
      />

      <PaginationList path="/users" pagination={users} />

    </section>
  );
}
