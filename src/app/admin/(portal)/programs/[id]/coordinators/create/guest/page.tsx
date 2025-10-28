import z from 'zod';
import { notFound, redirect } from 'next/navigation';
import { findProgramScheduleById,} from '@/services/program-schedule-service';
import { createProgramActivity, programActivityExistByName } from '@/services/program-activity-service';

export default async function AdminCreateGuestProgramCoordinatorPage({ searchParams }: Readonly<{ searchParams: Promise<{ sid?: string; }>; }>) {
  const scheduleId = Number((await searchParams).sid);

  if (isNaN(scheduleId)) {
    notFound();
  }

  const schedule = await findProgramScheduleById(scheduleId);

  if (schedule === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">

      Create guest coordinator for schedule: { scheduleId }

    </section>
  );
}
