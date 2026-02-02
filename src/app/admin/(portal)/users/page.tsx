import MenuList from '@/components/menu-list';
import FilterForm from '@/components/filter-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import UserTableRow, { userTableHeadings } from '@/components/user-table-row';
import { UserEntityStatus } from '@/models/entity';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; status?: string }> }) {
  const { page, search, status } = await searchParams;

  const users = await findUsers(
    { 
      search: search?.length === 0 ? undefined : search,
      status: UserEntityStatus.find((s) => s === status),
    }, 
    resolvePaginationParams(page)
  );

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'users/create', text: 'Add user' } ]} />

      <FilterForm 
        action="/admin/users"
        fields={[
          {
            id: 'search',
            name: 'search',
            type: 'input',
            input: 'search',
            value: search,
            placeholder: 'Search by ID, Name, Email, Phone or Membership',
          },
          {
            id: 'status',
            name: 'status',
            type: 'select',
            value: status,
            placeholder: 'Filter by Status',
            options: UserEntityStatus.map((s) => ({ value: s })),
          }
        ]}
      />

      <GenericTable
        headings={userTableHeadings}
        items={users.data}
        renderItem={(user) => <UserTableRow key={user.id} user={user} />}
      />

      <PaginationList path="/admin/users" pagination={users} params={new Map([['search', search]])} />

    </section>
  );
}
