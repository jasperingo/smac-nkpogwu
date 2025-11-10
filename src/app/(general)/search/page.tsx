import { getSession } from '@/utils/session';

export default async function SearchPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string; page?: string; }>; }>) {
  const session = await getSession();

  const { page, search } = await searchParams;

  return (
    <section className="bg-foreground p-4">

      Not implemented with search query: { search }
    </section>
  );
}
