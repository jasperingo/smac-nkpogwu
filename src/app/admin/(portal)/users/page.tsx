import Link from 'next/link';
import { findUsers } from '@/services/user-service';

export default async function AdminUsersPage() {
  const users = await findUsers();

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


      <table className="table-auto my-4 w-full">
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
            users.map((user) => (
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

    </section>
  );
}
