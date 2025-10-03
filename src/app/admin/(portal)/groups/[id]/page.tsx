import MenuList from "@/components/menu-list";

export default async function AdminGroupPage({ params }: Readonly<{ params: Promise<{ id: string }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">

      Group { id }

    </section>
  );
}
