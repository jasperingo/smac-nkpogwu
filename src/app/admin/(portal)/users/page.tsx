import Link from 'next/link';
import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const users = await findUsers({ ...resolvePaginationParams(page), search: search?.length === 0 ? undefined : search });

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'users/create', text: 'Add user' } ]} />

      <SearchForm value={search} action="/admin/users" placeholder="Search by ID, Name, Email, Phone or Membership" />

      <GenericTable
        headings={[ 'ID', 'Name', 'Email', 'Phone', 'Membership', 'Action' ]}
        items={users.data}
        renderItem={(user) => (
          <tr key={user.id}>
            <td className="p-2 border">{ user.id }</td>
            <td className="p-2 border">{ user.firstName } { user.lastName }</td>
            <td className="p-2 border">{ user.emailAddress ?? '(not set)' }</td>
            <td className="p-2 border">{ user.phoneNumber ?? '(not set)' }</td>
            <td className="p-2 border">{ user.membershipNumber ?? '(not set)' }</td>
            <td className="p-2 border">
              <Link 
                href={`/admin/users/${user.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Profile</Link>
            </td>
          </tr>
        )}
      />

      <PaginationList path="/admin/users" pagination={users} params={new Map([['search', search]])} />

    </section>
  );
}
