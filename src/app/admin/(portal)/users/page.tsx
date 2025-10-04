import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';
import UserTableRow, { userTableHeadings } from '@/components/user-table-row';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const users = await findUsers({ ...resolvePaginationParams(page), search: search?.length === 0 ? undefined : search });

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'users/create', text: 'Add user' } ]} />

      <SearchForm value={search} action="/admin/users" placeholder="Search by ID, Name, Email, Phone or Membership" />

      <GenericTable
        headings={userTableHeadings}
        items={users.data}
        renderItem={(user) => <UserTableRow key={user.id} user={user} />}
      />

      <PaginationList path="/admin/users" pagination={users} params={new Map([['search', search]])} />

    </section>
  );
}
