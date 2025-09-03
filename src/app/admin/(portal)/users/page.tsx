import Link from 'next/link';

export default async function AdminUsersPage() {

  return (
    <section className="bg-foreground p-4">

      <ul className="flex gap-2 items-center flex-wrap">
        <li>
          <Link
            href="users/create"
            active-class="text-color-secondary"
            className="block p-2 border border-primary font-bold bg-primary text-on-primary hover:bg-primary-variant"
          >Add user</Link>
        </li>
      </ul>

    </section>
  );
}
