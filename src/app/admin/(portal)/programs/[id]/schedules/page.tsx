import Link from 'next/link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminProgramSchedulesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  return (
    <section className="bg-foreground p-4">
      Schedules for program: { id }
    </section>
  );
}
