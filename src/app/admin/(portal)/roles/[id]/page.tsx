

export default async function AdminRolePage({ params }: Readonly<{ params: Promise<{ id: string }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">

        { id }

    </section>
  );
}
