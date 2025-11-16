import { Funnel } from 'lucide-react';
import { getSession } from '@/utils/session';
import { resolvePaginationParams } from '@/utils/pagination';
import { ProgramScheduleStates } from '@/models/entity';
import { findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators } from '@/services/program-service';
import PaginationList from '@/components/pagination-list';
import ProgramListItem from '@/components/program-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';

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
      <form action="/programs" className="my-4">
        <select 
          name="scheduleState"
          defaultValue={scheduleStateValue}
          className="inline-block w-full p-2 pr-12 outline-0 border border-primary"
        >
          {
            ProgramScheduleStates.map((option) => <option key={option} value={option}>{ option.substring(0, 1).toUpperCase() + option.substring(1) }</option>)
          }
        </select>

        <button type="submit" className="-ml-16 px-4 py-1 align-middle text-center text-primary bg-foreground hover:bg-gray-300">
          <Funnel />
          <span className="sr-only">Submit filter form</span>
        </button>
      </form>

      <GenericUnorderedList 
        items={programs.data}
        renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
      />
     
      <PaginationList path="/programs" pagination={programs} />
    </section>
  );
}
