import ActionLink from './action-link';
import { GroupEntity } from '@/models/entity';

export const groupTableHeadings = [ 'ID', 'Name', 'Privacy', 'Spotlight', 'Action' ] as const;

export default function GroupTableRow({ group }: { group: GroupEntity }) {
  return (
     <tr>
      <td className="p-2 border">{ group.id }</td>
      <td className="p-2 border">{ group.name }</td>
      <td className="p-2 border">{ group.privacy }</td>
      <td className="p-2 border">{ group.spotlighted ? 'Yes' : 'No' }</td>
      <td className="p-2 border">
        <ActionLink href={`/admin/groups/${group.id}`}>Details</ActionLink>
      </td>
    </tr>
  );
}
