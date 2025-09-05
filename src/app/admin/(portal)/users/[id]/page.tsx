import Link from 'next/link';

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params

  return (
    <section className="bg-foreground p-4">

      User: { id }

    </section>
  );
}
