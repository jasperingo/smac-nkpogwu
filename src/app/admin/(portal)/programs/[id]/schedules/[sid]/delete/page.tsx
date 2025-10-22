import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramSchedulesByProgramId } from '@/services/program-schedule-service';

export default async function AdminDeleteProgramSchedulePage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  return (
    <section className="bg-foreground p-4">
      
      
    </section>
  );
}
