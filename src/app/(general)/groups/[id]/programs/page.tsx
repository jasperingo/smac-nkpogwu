import PaginationList from '@/components/pagination-list';
import ProgramListItem from '@/components/program-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramsWithScheduledDatetimesByGroupId } from '@/services/program-service';

export default async function GroupProgramsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  const programs = await findProgramsWithScheduledDatetimesByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      <GenericUnorderedList 
        items={programs.data}
        renderItem={(program) => <ProgramListItem key={program.id} program={{ programs: program }} />}
      />
     
      <PaginationList path={`/groups/${id}/programs`} pagination={programs} />
    </section>
  );
}
