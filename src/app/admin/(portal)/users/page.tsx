import { Search } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const users = await findUsers({ ...resolvePaginationParams(page), search: search?.length === 0 ? undefined : search });

  const pageLinks: ReactElement[] = [];

  for (let i = 1; i <= users.totalPages; i++) {
    pageLinks.push((
      <li key={i}>
        <Link 
          href={`/admin/users?page=${i}${search ? `&search=${search}` : ''}`} 
          className={`block px-2 py-1 border border-primary hover:bg-primary-variant ${i === users.currentPage && 'bg-primary text-on-primary'}`}
        >{ i }</Link>
      </li>
    ));
  }

  return (
    <section className="bg-foreground p-4">

      <ul className="flex gap-2 items-center flex-wrap justify-end">
        <li>
          <Link
            href="users/create"
            active-class="text-color-secondary"
            className="block p-2 border border-primary bg-primary text-on-primary hover:bg-primary-variant"
          >Add user</Link>
        </li>
      </ul>

      <form action="/admin/users" className="my-4">
        <input 
          type="search" 
          name="search" 
          defaultValue={search}
          placeholder="Search by ID, Name, Email, Phone or Membership" 
          className="inline-block w-full p-2 pr-12 outline-0 border border-primary" 
        />

        <button type="submit" className="-ml-16 px-4 py-1 align-middle text-center text-primary bg-foreground hover:bg-gray-300">
          <Search />
          <span className="sr-only">Submit search form</span>
        </button>
      </form>

      <div className="my-4 w-full overflow-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="p-2 border border-primary bg-primary text-on-primary">ID</th>
              <th className="p-2 border border-primary bg-primary text-on-primary">Name</th>
              <th className="p-2 border border-primary bg-primary text-on-primary">Email</th>
              <th className="p-2 border border-primary bg-primary text-on-primary">Phone</th>
              <th className="p-2 border border-primary bg-primary text-on-primary">Membership</th>
              <th className="p-2 border border-primary bg-primary text-on-primary">Action</th>
            </tr>
          </thead>

          <tbody>
            {
              users.data.map((user) => (
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
              ))
            }
          </tbody>

        </table>
      </div>

      <ul className="flex gap-2 items-center flex-wrap">
        <li>
          { 
            users.currentPage > 1 
            ? (
                <Link 
                  href={`/admin/users?page=${users.currentPage - 1}${search ? `&search=${search}` : ''}`} 
                  className="block px-2 py-1 border border-primary hover:bg-primary-variant"
                >Previous</Link>
              )
            : (
                <span className="block px-2 py-1 border border-primary bg-gray-400">Previous</span>
              )
          }
        </li>

        { pageLinks }

        <li>
          { 
            users.currentPage < users.totalPages
            ? (
                <Link 
                  href={`/admin/users?page=${users.currentPage + 1}${search ? `&search=${search}` : ''}`} 
                  className="block px-2 py-1 border border-primary hover:bg-primary-variant"
                >Next</Link>
              )
            : (
                <span className="block px-2 py-1 border border-primary bg-gray-400">Next</span>
              )
          }
        </li> 
      </ul>

    </section>
  );
}
