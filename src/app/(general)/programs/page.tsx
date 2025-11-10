import { getSession } from '@/utils/session';

export default async function ProgramsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; }>; }>) {
  const session = await getSession();

  const { page } = await searchParams;

  return (
    <section className="bg-foreground p-4">

      Not implemented
    </section>
  );
}
