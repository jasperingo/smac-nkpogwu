import Link from 'next/link';
import RoundedImage from './rounded-image';
import { UserDefaultImage, UserEntity } from '@/models/entity';

export default function UserListItem({ user }: { user: UserEntity }) {
  return (
    <li className="mb-4 md:mb-0">
      <Link href={`/users/${user.id}`} className="border p-2 flex gap-2 items-center">
        <RoundedImage alt={`${user.id} image`} src={user.imageUrl ?? UserDefaultImage} />

        <div>
          <div className="font-bold">{ user.title ?? '' } { user.firstName } { user.lastName } { user.otherName ?? '' }</div>
          
          <div>{ user.gender.substring(0, 1) + user.gender.substring(1).toLowerCase() }</div>
        </div>
      </Link>
    </li>
  );
}
