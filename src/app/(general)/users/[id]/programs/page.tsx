import Link from 'next/link';
import Image from 'next/image';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { ProgramDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramsWithScheduledDatetimesByUserId } from '@/services/program-service';

export default async function UserProgramsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  const programs = await findProgramsWithScheduledDatetimesByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      <GenericUnorderedList 
        items={programs.data}
        renderItem={(program) => (
          <li key={program.id} className="mb-4 md:mb-0">
            <Link href={`/programs/${program.id}`} className="block border">
              <Image
                width="100" 
                height="64"
                alt={`${program.id} image`}
                src={program.imageUrl ?? ProgramDefaultImage} 
                className="block w-full h-40 border border-gray-400 object-cover" 
              />

              <div className="p-2">
                <div className="font-bold">{ program.name }</div>
                
                { program.theme && <div className="mb-1">Theme: { program.theme }</div> }

                { program.topic && <div className="mb-1">Topic: { program.topic }</div> }

                { 
                  program.startDatetime && (
                    <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">From: { program.startDatetime.toLocaleString() }</div> 
                  )
                }
                
                { 
                  program.endDatetime && (
                    <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">To: { program.endDatetime.toLocaleString() }</div> 
                  )
                }

                { 
                  program.startDatetime && program.endDatetime ? (
                    program.endDatetime.getTime() < Date.now() 
                      ? <div className="w-fit px-2 py-1 text-sm bg-gray-600 text-white">Ended</div> 
                      : program.startDatetime.getTime() > Date.now()
                        ? <div className="w-fit px-2 py-1 text-sm bg-blue-600 text-white">Upcoming</div> 
                        : <div className="w-fit px-2 py-1 text-sm bg-green-600 text-white">On going</div> 
                  ) : <div className="w-fit px-2 py-1 text-sm bg-orange-600 text-white">Unscheduled</div> 
                }

              </div>
            </Link>
          </li>
        )}
      />
     
      <PaginationList path="/users/programs" pagination={programs} />
    </section>
  );
}
