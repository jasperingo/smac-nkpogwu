import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  createProgramSchedule, 
  programScheduleExistByEndDatetime, 
  programScheduleExistByStartDatetime,
  programScheduleExistBetweenStartDatetimeAndEndDatetime,
} from '@/services/program-schedule-service';
import AdminCreateProgramScheduleForm, { FormState } from './form';

const validationSchema = z.object({
  programId: z.number(),
  startDatetime: z.date(),
  endDatetime: z.date(),
  topic: z.union([z.literal(''), z.string().nonempty()]),
  description: z.union([z.literal(''), z.string().nonempty()]),
})
.refine((dto) => dto.endDatetime.getTime() > dto.startDatetime.getTime(), { error: 'End date should be after start date', path: ['endDatetime'] })
.refine(async (dto) => !(await programScheduleExistByEndDatetime(dto.programId, dto.endDatetime)), { 
  path: ['endDatetime'],
  error: 'A schedule with this end date already exists', 
})
.refine(async (dto) => !(await programScheduleExistByStartDatetime(dto.programId, dto.startDatetime)), { 
  path: ['startDatetime'],
  error: 'A schedule with this start date already exists', 
})
.refine(async (dto) => !(await programScheduleExistBetweenStartDatetimeAndEndDatetime(dto.programId, dto.startDatetime, dto.endDatetime)), { 
  path: ['startDatetime'],
  error: 'This schedule overlaps the start date and end date of another schedule', 
});

async function programScheduleCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const startDatetime = formData.get('startDatetime') as string;
  const endDatetime = formData.get('endDatetime') as string;
  const topic = formData.get('topic') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { endDatetime, startDatetime, topic, description };

  const startDatetimeDate = new Date(startDatetime);
  const endDatetimeDate = new Date(endDatetime);
  
  const validatedResult = await validationSchema.safeParseAsync({
    programId,
    topic,
    description,
    endDatetime: endDatetimeDate,
    startDatetime: startDatetimeDate, 
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          startDatetime: errors.fieldErrors.startDatetime?.[0] ?? null,
          endDatetime: errors.fieldErrors.endDatetime?.[0] ?? null,
          topic: errors.fieldErrors.topic?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }
  
  try {
    await createProgramSchedule({
      programId, 
      endDatetime: endDatetimeDate,
      startDatetime: startDatetimeDate,
      topic: topic.length === 0 ? null : topic,
      description: description.length === 0 ? null : description,
    });
  } catch (error) {
    console.error('Error creating program schedule: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          startDatetime: null, 
          endDatetime: null, 
          topic: null,
          description: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/programs/${programId}/schedules`);
}

export default async function AdminCreateProgramSchedulePage({ params }: Readonly<{ params: Promise<{ id: string }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">

      <AdminCreateProgramScheduleForm programId={id} action={programScheduleCreate} />

    </section>
  );
}
