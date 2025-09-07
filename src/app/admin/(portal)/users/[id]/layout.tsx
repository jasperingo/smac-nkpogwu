import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findUserById } from '@/services/user-service';

export default async function AdminUserLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const user = await findUserById(id);

  if (user === null) {
    notFound();
  }

  return (
    <>
      <div className="bg-foreground p-4 mb-4 md:flex md:gap-4 md:items-center md:justify-center">
        <Image 
          src={`/user.png`} 
          alt={`${user.firstName} profile image`} 
          width="64" 
          height="64" 
          className="block mx-auto mb-2 border border-gray-400 rounded-full md:m-0 md:w-24 md:h-24" 
        />

        <div className="text-center">
          <div className="mb-2 font-bold text-lg md:text-xl">{ user.firstName } { user.lastName }</div>

          <div className="w-fit mx-auto py-1 px-4 text-on-primary bg-primary-variant">ID: { user.id }</div>
        </div>
      </div>

      <ul className="mb-4 flex gap-2 items-center overflow-auto">
        <li>
          <Link 
            href={`/admin/users/${user.id}`} 
            className={`block py-1 px-2 font-bold bg-foreground hover:bg-gray-100 ${true ? 'border-b-4 border-primary' : ''}`}
          >Details</Link>
        </li>
        <li>
          <Link 
            href={`/admin/users/${user.id}/groups`} 
            className={`block py-1 px-2 font-bold bg-foreground hover:bg-gray-100`}
          >Groups</Link>
        </li>
      </ul>

      { children }
    </>
  );
}
