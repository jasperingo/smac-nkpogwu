import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/utils/session';
import { ProgramDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramsWithScheduledDatetimesAndSpotlightedCoordinators } from '@/services/program-service';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function ProgramsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; }>; }>) {
  const session = await getSession();

  const { page } = await searchParams;

  const programs = await findProgramsWithScheduledDatetimesAndSpotlightedCoordinators(resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      <GenericUnorderedList 
        items={programs.data}
        renderItem={(program) => (
          <li key={program.id} className="mb-4 md:mb-0">
            <Link href={`/program/${program.id}`} className="block border">
              <Image
                width="100" 
                height="64"
                alt={`${program.id} image`}
                src={program.imageUrl ?? ProgramDefaultImage} 
                className="block w-full h-40 border border-gray-400 object-cover" 
              />

              <div className="p-2">
                <div className="font-bold">{ program.name }</div>
                
                { program.theme && <div>Theme: { program.theme }</div> }

                { program.topic && <div>Topic: { program.topic }</div> }

                { 
                  program.startDatetime && program.endDatetime && (
                    <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">
                      { program.startDatetime.toLocaleString() } - { program.endDatetime.toLocaleString() }
                    </div> 
                  )
                }

                { 
                  program.startDatetime && program.endDatetime && (
                    program.endDatetime.getTime() < Date.now() 
                      ? <div className="w-fit px-2 py-1 bg-gray-600 text-white">Ended</div> 
                      : program.startDatetime.getTime() > Date.now()
                        ? <div className="w-fit px-2 py-1 bg-blue-600 text-white">Upcoming</div> 
                        : <div className="w-fit px-2 py-1 bg-green-600 text-white">On going</div> 
                  )
                }

                { 
                  program.coordinators && (
                    <>
                      <div className="font-semibold">Coordinators:</div> 

                      <ul>
                        {
                          program.coordinators.split('|').map((coordinator, index) => {
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
