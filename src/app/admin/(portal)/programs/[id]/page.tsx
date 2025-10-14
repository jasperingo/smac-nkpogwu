
export default async function AdminProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">
      
     { id }

    </section>
  );
}
