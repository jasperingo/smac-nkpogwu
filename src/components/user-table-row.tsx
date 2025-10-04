import Link from 'next/link';
import { UserEntity } from '@/models/entity';

export const userTableHeadings = [ 'ID', 'Name', 'Email', 'Phone', 'Membership', 'Action' ] as const;

export default function UserTableRow({ user }: { user: UserEntity }) {
  return (
     <tr>
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
  );
}
