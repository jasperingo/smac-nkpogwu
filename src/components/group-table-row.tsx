import Link from 'next/link';
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
        <Link 
          href={`/admin/groups/${group.id}`}
          className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
        >Profile</Link>
      </td>
    </tr>
  );
}
