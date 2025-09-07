import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findUserById } from '@/services/user-service';

export default async function AdminUserGroupsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  const user = (await findUserById(id))!;

  return (
    <section className="bg-foreground p-4">

      Groups


    </section>
  );
}
