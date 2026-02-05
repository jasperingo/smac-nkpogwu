import { Shapes, User } from 'lucide-react';
import Link from 'next/link';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramAndUserAndGroupById } from '@/services/program-service';
import { findProgramSchedulesByProgramId } from '@/services/program-schedule-service';
import { findAllProgramActivitiesByProgramScheduleIds } from '@/services/program-activity-service';
import { findProgramCoordinatorsAndUsersByProgramScheduleIds } from '@/services/program-coordinator-service';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import SimpleDescriptionList from '@/components/simple-description-list';
import ProgramScheduleListItem from '@/components/program-schedule-list-item';

export default async function ProgramPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }

  const { page } = await searchParams;

  const program = await findProgramAndUserAndGroupById(id);

  if (program === null) {
    return null;
  }

  const schedules = await findProgramSchedulesByProgramId(id, resolvePaginationParams(page, 100));

  const scheduleIds = schedules.data.map((s) => s.id);

  const activities = await findAllProgramActivitiesByProgramScheduleIds(scheduleIds);

  const coordinators = await findProgramCoordinatorsAndUsersByProgramScheduleIds(scheduleIds);

  return (
    <section className="bg-foreground p-4">
      
      <SimpleDescriptionList
        itemsSpacing="md"
        items={[
          { term: 'Theme', details: program.programs.theme ?? '(Not set)', displayRow: true, remove: program.programs.theme === null },
          { term: 'Topic', details: program.programs.topic ?? '(Not set)', displayRow: true, remove: program.programs.topic === null },
          { 
            term: 'Group', 
            displayRow: true,
            remove: program.groups === null,
            details: (
              <Link 
                href={`/groups/${program.groups?.id}`} 
                className="flex gap-2 items-center text-primary px-2 py-1 bg-gray-200 hover:bg-gray-400"
              >
                <Shapes />
                <div>{ program.groups?.name }</div>
              </Link>
            ),
          },
          { 
            term: 'User', 
            displayRow: true,
            remove: program.users === null,
            details: (
              <Link 
                href={`/usesrs/${program.users?.id}`}
                className="flex gap-2 items-center text-primary px-2 py-1 bg-gray-200 hover:bg-gray-400"
              >
                <User />
                <div>{ program.users?.title ?? '' } { program.users?.firstName } { program.users?.lastName }</div>
              </Link>
            ),
          },
          { 
            term: 'Description',
            displayRow: false,
            remove: program.programs.description === null,
            details: program.programs.description ? (<p className="whitespace-pre-wrap">{ program.programs.description }</p>) : '(Not set)', 
          },
        ]} 
      />

      <GenericUnorderedList 
        items={schedules.data}
        responsiveness="none"
        emptyText="No schedules available"
        renderItem={(schedule) => (
          <ProgramScheduleListItem
            key={schedule.id} 
            schedule={schedule} 
            activities={activities.filter((a) => a.programScheduleId === schedule.id)} 
            coordinators={coordinators.filter((c) => c.programCoordinators.programScheduleId === schedule.id)} 
          />
        )}
      />

      <PaginationList path={`/programs/${id}`} pagination={schedules} />

    </section>
  );
}
