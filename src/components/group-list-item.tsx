import Link from 'next/link';
import RoundedImage from './rounded-image';
import { GroupDefaultImage, GroupEntity } from '@/models/entity';

export default function GroupListItem({ group }: { group: { groups: GroupEntity; parent?: GroupEntity | null; } }) {
  return (
    <li className="mb-4 md:mb-0">
      <Link href={`/groups/${group.groups.id}`} className="border p-2 flex gap-2 items-center">
        <RoundedImage alt={`${group.groups.id} image`} src={group.groups.imageUrl ?? GroupDefaultImage} />

        <div className="flex-grow">
          <div className="font-bold">{ group.groups.name }</div>
          
          { group.parent && <div>{ group.parent.name }</div> }

          <div className="text-sm text-gray-600">{ group.groups.description }</div>
        </div>
      </Link>
    </li>
  );
}
