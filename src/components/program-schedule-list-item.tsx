'use client'

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SimpleDescriptionList from './simple-description-list';
import { ProgramActivityEntity, ProgramCoordinatorEntity, ProgramScheduleEntity, UserEntity } from '@/models/entity';

export function ProgramScheduleListItemDrop({ title, color, children }: { title: string; color: 'red' | 'blue' | 'purple'; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2">
      <button 
        onClick={() => setOpen(!open)}
        className={`w-full p-2 font-bold text-left text-white border-2 flex gap-2 items-center 
          ${color === 'red' ? 'bg-red-600 border-red-600 hover:bg-red-400' 
            : (color === 'blue' ? 'bg-blue-600 border-blue-600 hover:bg-blue-400' : 'bg-purple-600 border-purple-600 hover:bg-purple-purple')}`}
      >
        <span className="flex-grow">{ title }</span>
        { open ? <ChevronDown /> : <ChevronRight />}
      </button>
      <div className={`border overflow-hidden transition-[height] ${!open ? 'h-0 p-0' : 'h-auto p-2'} 
        ${color === 'red' ? 'border-red-600' : (color === 'blue' ? 'border-blue-600' : 'border-purple-600')}`}>{ children }</div>
    </div>
  );
}

export default function ProgramScheduleListItem(
  { 
    schedule, 
    activities, 
    coordinators 
  }: { 
    schedule: ProgramScheduleEntity; 
    activities: ProgramActivityEntity[]; 
    coordinators: { programCoordinators: ProgramCoordinatorEntity; users: UserEntity | null; }[]; 
  }
) {
  return (
     <li className="mb-4 md:mb-0">
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
              <ProgramScheduleListItemDrop title="YouTube video" color="red">
                <iframe 
                  width="420" 
                  height="315" 
                  className="w-full" 
                  src={schedule.link.includes('v=') 
                    ? `https://www.youtube.com/embed/${schedule.link.substring(schedule.link.lastIndexOf('=') + 1)}` 
                    : `https://www.youtube.com/embed/${schedule.link.substring(schedule.link.lastIndexOf('/') + 1)}`}
                ></iframe>
              </ProgramScheduleListItemDrop>
            )
          }

          <ProgramScheduleListItemDrop title="Activities" color="blue">
            <ul>
              {
                activities.map((a, i) => (
                  <li key={a.id} className="mb-1">
                    <div className="flex gap-2 items-start">
                      <div className="font-bold">{ i + 1 }.</div>
                      <div className="flex-grow">
                        <div>{ a.name }</div>
                        { a.description && <div className="text-sm text-gray-600 whitespace-pre-wrap">{ a.description }</div> }
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </ProgramScheduleListItemDrop>

          <ProgramScheduleListItemDrop title="Coordinators" color="purple">
            <ul>
              {
                coordinators.map((c) => (
                  <li key={c.programCoordinators.id} className="mb-1">
                    {
                      c.users === null 
                        ? <div><span className="font-bold">{ c.programCoordinators.role }</span> - { c.programCoordinators.name }</div>
                        : (
                            <div>
                              <div><span className="font-bold">{ c.programCoordinators.role }</span> - { c.users.title ?? '' } { c.users.firstName } { c.users.lastName }</div>
                              <Link href={`/users/${c.users.id}`} className="text-primary text-sm">View profile</Link>
                            </div>
                          )
                    }
                  </li>
                ))
              }
            </ul>
          </ProgramScheduleListItemDrop>
        </div>
      </li>
  );
}
