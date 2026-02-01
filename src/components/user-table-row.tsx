import ActionLink from './action-link';
import { UserEntity } from '@/models/entity';

export const userTableHeadings = [ 'ID', 'Status', 'Name', 'Email', 'Phone', 'Membership', 'Action' ] as const;

export default function UserTableRow({ user }: { user: UserEntity }) {
  return (
     <tr>
       <td className="p-2 border">{ user.id }</td>
        <td className="p-2 border">{ user.status }</td>
        <td className="p-2 border">{ user.title } { user.firstName } { user.lastName }</td>
        <td className="p-2 border">{ user.emailAddress ?? '(not set)' }</td>
        <td className="p-2 border">{ user.phoneNumber ?? '(not set)' }</td>
        <td className="p-2 border">{ user.membershipNumber ?? '(not set)' }</td>
        <td className="p-2 border">
          <ActionLink href={`/admin/users/${user.id}`}>Profile</ActionLink>
        </td>
    </tr>
  );
}
