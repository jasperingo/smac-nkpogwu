import Link from 'next/link';
import Image from 'next/image';
import { Funnel } from 'lucide-react';
import { getSession } from '@/utils/session';
import { resolvePaginationParams } from '@/utils/pagination';
import { ProgramDefaultImage, ProgramScheduleStates } from '@/models/entity';
import { findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators } from '@/services/program-service';
import PaginationList from '@/components/pagination-list';
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
        renderItem={(program) => (
          <li key={program.programs.id} className="mb-4 md:mb-0">
            <Link href={`/programs/${program.programs.id}`} className="block border">
              <Image
                width="100" 
                height="64"
                alt={`${program.programs.id} image`}
                src={program.programs.imageUrl ?? ProgramDefaultImage} 
                className="block w-full h-40 border border-gray-400 object-cover" 
              />

              <div className="p-2">
                <div className="font-bold">{ program.programs.name }</div>
                
                { program.programs.theme && <div className="mb-1">Theme: { program.programs.theme }</div> }

                { program.programs.topic && <div className="mb-1">Topic: { program.programs.topic }</div> }

                { 
                  program.programs.startDatetime && (
                    <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">From: { program.programs.startDatetime.toLocaleString() }</div> 
                  )
                }
                
                { 
                  program.programs.endDatetime && (
                    <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">To: { program.programs.endDatetime.toLocaleString() }</div> 
                  )
                }

                { 
                  program.programs.startDatetime && program.programs.endDatetime ? (
                    program.programs.endDatetime.getTime() < Date.now() 
                      ? <div className="w-fit px-2 py-1 text-sm bg-gray-600 text-white">Ended</div> 
                      : program.programs.startDatetime.getTime() > Date.now()
                        ? <div className="w-fit px-2 py-1 text-sm bg-blue-600 text-white">Upcoming</div> 
                        : <div className="w-fit px-2 py-1 text-sm bg-green-600 text-white">On going</div> 
                  ) : <div className="w-fit px-2 py-1 text-sm bg-orange-600 text-white">Unscheduled</div> 
                }

                { 
                  (program.users || program.groups) && (
                    <div className="text-sm text-gray-600 font-bold">Organizer: { 
                      program.users ? `${program.users.title ?? ''} ${program.users.firstName} ${program.users.lastName}` : program.groups ? program.groups.name : '' 
                    }</div> 
                  )
                }

                { 
                  program.programs.coordinators && (
                    <>
                      <div className="font-semibold">Coordinators:</div> 

                      <ul>
                        {
                          program.programs.coordinators.split('|').map((coordinator, index) => {
                            const parts = coordinator.split('=');

                            return <li key={index}>{ parts[0] } - { parts[1] }</li>
                          }) 
                        }
                      </ul>
                    </>
                  )
                }
              </div>
            </Link>
          </li>
        )}
      />
     
      <PaginationList path="/programs" pagination={programs} />
    </section>
  );
}
