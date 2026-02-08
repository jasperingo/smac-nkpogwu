import Link from 'next/link';
import ProgramStateDiv from './program-state-div';
import { getDisplayDatetime } from '@/utils/datetime';
import { GroupEntity, ProgramDefaultImage, ProgramEntity, UserEntity } from '@/models/entity';

export default function ProgramListItem(
  { 
    program 
  }: { 
    program: {
      programs: ProgramEntity & {
        coordinators?: string;
        startDatetime?: Date;
        endDatetime?: Date;
      };
      users?: UserEntity | null;
      groups?: GroupEntity | null;
    } 
  }
) {
  return (
    <li className="mb-4 md:mb-0">
      <Link href={`/programs/${program.programs.id}`} className="block border">
        <img
          width="100" 
          height="64"
          alt={`${program.programs.id} image`}
          src={program.programs.imageUrl ?? ProgramDefaultImage} 
          className="block w-full h-40 border border-gray-400 object-cover" 
        />

        <div className="p-2">
          <div className="font-bold text-lg">{ program.programs.name }</div>
          
          { program.programs.theme && <div className="mb-1">Theme: { program.programs.theme }</div> }

          { program.programs.topic && <div className="mb-1">Topic: { program.programs.topic }</div> }

          { 
            program.programs.startDatetime && (
              <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">From: { getDisplayDatetime(program.programs.startDatetime) }</div> 
            )
          }
          
          { 
            program.programs.endDatetime && (
              <div className="w-fit mb-1 bg-gray-200 px-2 py-0.5">To: { getDisplayDatetime(program.programs.endDatetime) }</div> 
            )
          }

          <ProgramStateDiv startDatetime={program.programs.startDatetime} endDatetime={program.programs.endDatetime} />

          { 
            (program.users || program.groups) && (
              <div className="text-sm text-gray-600 font-bold">Organizer: { 
                program.users ? `${program.users.title ?? ''} ${program.users.firstName} ${program.users.lastName}` : program.groups ? program.groups.name : '' 
              }</div> 
            )
          }

          { 
            program.programs.coordinators && (
              <ul>
                {
                  program.programs.coordinators.split('|').map((coordinator, index) => {
                    const parts = coordinator.split('=');

                    return <li key={index}>{ parts[0] } - { parts[1] }</li>
                  }) 
                }
              </ul>
            )
          }
        </div>
      </Link>
    </li>
  );
}
