import Link from 'next/link';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramAndUserAndGroupById } from '@/services/program-service';
import { findProgramSchedulesByProgramId } from '@/services/program-schedule-service';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import SimpleDescriptionList from '@/components/simple-description-list';

export default async function ProgramPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  const program = (await findProgramAndUserAndGroupById(id))!;

  const schedules = await findProgramSchedulesByProgramId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      
      <SimpleDescriptionList
        itemsSpacing="md"
        items={[
          { term: 'Theme', details: program.programs.theme ?? '(Not set)', displayRow: true },
          { term: 'Topic', details: program.programs.topic ?? '(Not set)', displayRow: true },
          { 
            term: 'Group', 
            displayRow: false,
            remove: program.groups === null,
            details: (<Link href={`/groups/${program.groups?.id}`} className="inline-block px-4 py-0.5 border">{ program.groups?.name }</Link>),
          },
          { 
            term: 'User', 
            displayRow: false,
            remove: program.users === null,
            details: (
              <Link 
                href={`/usesrs/${program.users?.id}`}
                className="inline-block px-4 py-0.5 border"
              >
                { program.users?.title ?? '' } { program.users?.firstName } { program.users?.lastName }
              </Link>
            ),
          },
          { 
            term: 'Description',
            displayRow: false,
            details: program.programs.description ? (<p className="whitespace-pre-wrap">{ program.programs.description }</p>) : '(Not set)', 
          },
        ]} 
      />

      <GenericUnorderedList 
        items={schedules.data}
        emptyText="No schedules available"
        renderItem={(schedule) => (
          <li key={schedule.id} className="mb-4 md:mb-0">
            <div className="border p-2">
              <SimpleDescriptionList
                items={[
                  { term: 'Start date', details: schedule.startDatetime.toLocaleString(), displayRow: true },
                  { term: 'End date', details: schedule.endDatetime.toLocaleString(), displayRow: true },
                  { term: 'Topic', details: schedule.topic ?? '(Not set)', displayRow: true },
                  { 
                    term: 'Description',
                    displayRow: false,
                    details: schedule.description ? (<p className="whitespace-pre-wrap">{ schedule.description }</p>) : '(Not set)', 
                  },
                ]} 
              />

              {
                schedule.link && (schedule.link.includes('youtube') || schedule.link.includes('youtu.be')) && (
                  <iframe 
                    width="420" 
                    height="315" 
                    className="mt-4 w-full" 
                    src={schedule.link.includes('v=') 
                      ? `https://www.youtube.com/embed/${schedule.link.substring(schedule.link.lastIndexOf('=') + 1)}` 
                      : `https://www.youtube.com/embed/${schedule.link.substring(schedule.link.lastIndexOf('/') + 1)}`}
                  ></iframe>
                )
              }
            </div>
          </li>
        )}
      />

      <PaginationList path={`/programs/${id}`} pagination={schedules} />

    </section>
  );
}
