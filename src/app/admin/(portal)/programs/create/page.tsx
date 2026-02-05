import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  programDescriptionValidation, 
  programNameValidation, 
  programThemeValidation, 
  programTopicValidation 
} from '@/validations/programs-validation';
import { findUserById } from '@/services/user-service';
import { findGroupById } from '@/services/group-service';
import { createProgram } from '@/services/program-service';
import AdminCreateProgramForm, { type FormState } from './form';
import SimpleDescriptionList from '@/components/simple-description-list';

const validationSchema = z.object({
  name: programNameValidation,
  theme: programThemeValidation,
  topic: programTopicValidation,
  description: programDescriptionValidation,
});

async function programCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId')); // TODO: In v2 check that ID exists
  const groupId = Number(formData.get('groupId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const theme = formData.get('theme') as string;
  const topic = formData.get('topic') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, theme, topic, description };

  const validatedResult = await validationSchema.safeParseAsync({
    name, 
    theme,
    topic,
    description,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          name: errors.fieldErrors.name?.[0] ?? null,
          theme: errors.fieldErrors.theme?.[0] ?? null,
          topic: errors.fieldErrors.topic?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }

  let programId: number;

  try {
    programId = await createProgram({
      name, 
      theme: theme.length === 0 ? null : theme,
      topic: topic.length === 0 ? null : topic,
      description: description.length === 0 ? null : description,
      userId: isNaN(userId) || userId < 1 ? null : userId,
      groupId: isNaN(groupId) || groupId < 1 ? null : groupId,
    });
  } catch (error) {
    console.error('Error creating program: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null, 
          theme: null, 
          topic: null,
          description: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/programs/${programId}`);
}

export default async function AdminCreateProgramPage({ searchParams }: { searchParams: Promise<{ groupId?: string; userId?: string; }> }) {
  const queryParams = await searchParams;

  const userId = Number(queryParams.userId);

  const groupId = Number(queryParams.groupId);

  const user = isNaN(userId) ? null : (await findUserById(userId));

  const group = isNaN(groupId) ? null : (await findGroupById(groupId));

  if (user && group) {
    return (
      <section className="bg-foreground p-4">
        <div className="font-bold text-red-600 mb-4 text-xl">Cannot create program for both user and group</div>

        <div className="mb-4 p-2 border">
          <SimpleDescriptionList
            caption="User"
            items={[
              { term: 'ID', details: user.id, displayRow: true },
              { term: 'First name', details: user.firstName, displayRow: true },
              { term: 'Last name', details: user.lastName, displayRow: true },
              { term: 'Email', details: user.emailAddress ?? '(Not set)', displayRow: true },
              { term: 'Phone', details: user.phoneNumber ?? '(Not set)', displayRow: true },
              { term: 'Membership', details: user.membershipNumber ?? '(Not set)', displayRow: true },
            ]} 
          />
        </div>

        <div className="p-2 border">
          <SimpleDescriptionList
            caption="Group"
            items={[
              { term: 'ID', details: group.id, displayRow: true },
              { term: 'Name', details: group.name, displayRow: true },
            ]} 
          />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-foreground p-4">

      <AdminCreateProgramForm user={user} group={group} action={programCreate} />

    </section>
  );
}
