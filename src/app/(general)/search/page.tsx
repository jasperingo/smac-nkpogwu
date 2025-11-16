import { getSession } from '@/utils/session';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators } from '@/services/program-service';
import PaginationList from '@/components/pagination-list';
import ProgramListItem from '@/components/program-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function SearchPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string; page?: string; }>; }>) {
  const session = await getSession();

  const { page, search } = await searchParams;

  const programs = await findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
    { 
      search,
      publicOnly: session === null,
    }, 
    resolvePaginationParams(page)
  );

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={programs.data}
        renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
      />
    
      <PaginationList path="/search" pagination={programs} params={new Map([['search', search]])} />
    </section>
  );
}
