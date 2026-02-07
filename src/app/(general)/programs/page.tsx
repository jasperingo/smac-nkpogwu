import { Metadata } from 'next';
import { getSession } from '@/utils/session';
import { ProgramScheduleStates } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import { findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators } from '@/services/program-service';
import FilterForm from '@/components/filter-form';
import PaginationList from '@/components/pagination-list';
import ProgramListItem from '@/components/program-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Programs' + PAGE_METADATA_TITLE_SUFFIX,
  description: 'List of church programs',
};

export default async function ProgramsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; scheduleState?: string; }>; }>) {
  const session = await getSession();

  const { page, scheduleState } = await searchParams;

  const scheduleStateValue = ProgramScheduleStates.find((s) => s === scheduleState) ?? ProgramScheduleStates[0];

  const programs = await findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
    { 
      publicOnly: session === null,
      scheduleState: scheduleStateValue,
    }, 
    resolvePaginationParams(page)
  );

  return (
    <section className="bg-foreground p-4">

      <FilterForm 
        action="/programs"
        fields={[
          {
            id: 'scheduleState',
            name: 'scheduleState',
            type: 'select',
            value: scheduleStateValue,
            options: ProgramScheduleStates.map((s) => ({ value: s, text: s.substring(0, 1).toUpperCase() + s.substring(1) })),
          }
        ]}
      />

      <GenericUnorderedList 
        items={programs.data}
        renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
      />
     
      <PaginationList path="/programs" pagination={programs} />
    </section>
  );
}
