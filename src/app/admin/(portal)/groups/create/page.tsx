import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  groupDescriptionValidation, 
  groupNameValidation, 
  groupPrivacyValidation, 
  groupSpotlightedValidation 
} from '@/validations/groups-validation';
import AdminCreateGroupForm, { type FormState } from './form';
import { createGroup, findGroupById } from '@/services/group-service';

const validationSchema = z.object({
  name: groupNameValidation,
  privacy: groupPrivacyValidation,
  spotlighted: groupSpotlightedValidation,
  description: groupDescriptionValidation,
});

async function groupCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const parentId = Number(formData.get('parentId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const privacy = formData.get('privacy') as string;
  const spotlighted = formData.get('spotlighted') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, privacy, spotlighted, description };

  const spotlightedBoolean = spotlighted === 'true';

  const validatedResult = await validationSchema.safeParseAsync({
    name, 
    privacy,
    description,
    spotlighted: spotlightedBoolean,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          name: errors.fieldErrors.name?.[0] ?? null,
          privacy: errors.fieldErrors.privacy?.[0] ?? null,
          spotlighted: errors.fieldErrors.spotlighted?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }

  let groupId: number;

  try {
    groupId = await createGroup({
      name, 
      privacy: privacy as any,
      spotlighted: spotlightedBoolean,
      parentId: isNaN(parentId) || parentId < 1 ? null : parentId,
      description: description.length === 0 ? null : description,
    });
  } catch (error) {
    console.error('Error creating group: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null, 
          privacy: null, 
          description: null, 
          spotlighted: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/groups/${groupId}`);
}

export default async function AdminCreateGroupPage({ searchParams }: { searchParams: Promise<{ parentId?: string; }> }) {
  const parentId = Number((await searchParams).parentId);

  const group = isNaN(parentId) ? null : (await findGroupById(parentId));

  return (
    <section className="bg-foreground p-4">

      <AdminCreateGroupForm group={group} action={groupCreate} />

    </section>
  );
}
