import z from 'zod';
import { notFound } from 'next/navigation';
import { 
  findProgramScheduleById, 
  programScheduleExistByEndDatetime, 
  programScheduleExistByStartDatetime,
  programScheduleExistBetweenStartDatetimeAndEndDatetime,
  updateProgramSchedule,
} from '@/services/program-schedule-service';
import { getDatetimeInputString } from '@/utils/datetime';
import AdminUpdateProgramScheduleForm, { FormState } from './form';

const validationSchema = z.object({
  programId: z.number(),
  startDatetime: z.date().optional(),
  endDatetime: z.date().optional(),
  topic: z.union([z.literal(''), z.string().nonempty()]).optional(),
  description: z.union([z.literal(''), z.string().nonempty()]).optional(),
  link: z.union([z.literal(''), z.url()]).optional(),
})
.refine((dto) => dto.endDatetime && dto.startDatetime ? dto.endDatetime.getTime() > dto.startDatetime.getTime() : true, { 
  path: ['endDatetime'],
  error: 'End date should be after start date', 
})
.refine(async (dto) => dto.endDatetime ? !(await programScheduleExistByEndDatetime(dto.programId, dto.endDatetime)) : true, { 
  path: ['endDatetime'],
  error: 'A schedule with this end date already exists', 
})
.refine(async (dto) => dto.startDatetime ? !(await programScheduleExistByStartDatetime(dto.programId, dto.startDatetime)) : true, { 
  path: ['startDatetime'],
  error: 'A schedule with this start date already exists', 
})
.refine(async (dto) => dto.endDatetime && dto.startDatetime 
    ? !(await programScheduleExistBetweenStartDatetimeAndEndDatetime(dto.programId, dto.startDatetime, dto.endDatetime)) : true, {
  path: ['startDatetime'],
  error: 'This schedule overlaps the start date and end date of another schedule', 
}); // TODO: In v2 consider excluding current schedule from check

async function programScheduleUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const startDatetime = formData.get('startDatetime') as string;
  const endDatetime = formData.get('endDatetime') as string;
  const topic = formData.get('topic') as string;
  const description = formData.get('description') as string;
  const link = formData.get('link') as string;

  const formStateValues: FormState['values'] = { endDatetime, startDatetime, topic, description, link };

  const startDatetimeDate = new Date(startDatetime);
  const endDatetimeDate = new Date(endDatetime);

  const validateStartDatetime = startDatetime !== state.values.startDatetime || state.errors.fields.startDatetime !== null
  const validateEndDatetime = endDatetime !== state.values.endDatetime || state.errors.fields.endDatetime !== null;

  const validatedResult = await validationSchema.safeParseAsync({
    programId,
    link: link !== state.values.link || state.errors.fields.link !== null ? link : undefined,
    topic: topic !== state.values.topic || state.errors.fields.topic !== null ? topic : undefined,
    description: description !== state.values.description || state.errors.fields.description !== null ? description : undefined,
    endDatetime: validateEndDatetime || validateStartDatetime ? endDatetimeDate : undefined,
    startDatetime: validateStartDatetime || validateEndDatetime ? startDatetimeDate : undefined, 
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          startDatetime: errors.fieldErrors.startDatetime?.[0] ?? null,
          endDatetime: errors.fieldErrors.endDatetime?.[0] ?? null,
          topic: errors.fieldErrors.topic?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
          link: errors.fieldErrors.link?.[0] ?? null,
        }, 
      },
    };
  }

  try {
    const schedule = await updateProgramSchedule(programScheduleId, {
      startDatetime: startDatetime !== state.values.startDatetime ? startDatetimeDate : undefined, 
      endDatetime: endDatetime !== state.values.endDatetime ? endDatetimeDate : undefined,
      link: link !== state.values.link ? (link.length === 0 ? null : link) : undefined,
      topic: topic !== state.values.topic ? (topic.length === 0 ? null : topic) : undefined,
      description: description !== state.values.description ? (description.length === 0 ? null : description) : undefined,
    });
  
    if (schedule === null) {
      throw new Error('Update program schedule return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          startDatetime: null, 
          endDatetime: null, 
          topic: null,
          description: null, 
          link: null, 
        },
      },
      values: {
        startDatetime: getDatetimeInputString(schedule.startDatetime),
        endDatetime: getDatetimeInputString(schedule.endDatetime), 
        link: schedule.link ?? '', 
        topic: schedule.topic ?? '', 
        description: schedule.description ?? '', 
      },
    };
  } catch (error) {
    console.error('Error updating program schedule: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: { 
          startDatetime: null, 
          endDatetime: null, 
          topic: null,
          description: null, 
          link: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function AdminUpdateProgramSchedulePage({ params }: Readonly<{ params: Promise<{ sid: string; }>; }>) {
  const id = Number((await params).sid);

  if (isNaN(id)) {
    notFound();
  }

  const schedule = await findProgramScheduleById(id);

  if (schedule === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminUpdateProgramScheduleForm programSchedule={schedule} action={programScheduleUpdate} />

    </section>
  );
}
