import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  groupDescriptionValidation, 
  groupNameValidation, 
  groupPrivacyValidation, 
  groupSpotlightedValidation 
} from '@/validations/groups-validation';
import { createGroup } from '@/services/group-service';
import AdminCreateGroupForm, { FormState, initialState } from './form';

const validationSchema = z.object({
  name: groupNameValidation,
  privacy: groupPrivacyValidation,
  spotlighted: groupSpotlightedValidation,
  description: groupDescriptionValidation,
});

export async function groupCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const name = formData.get('name') as string;
  const privacy = formData.get('privacy') as string;
  const spotlighted = formData.get('spotlighted') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, privacy, spotlighted, description };

  const validatedResult = await validationSchema.safeParseAsync({
    name, 
    privacy,
    description,
    spotlighted: spotlighted === 'true',
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
      spotlighted: spotlighted === 'true',
      description: description.length === 0 ? null : description,
    });
  } catch (error) {
    return { 
      values: formStateValues,
      errors: { 
        fields: initialState.errors.fields,
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/groups/${groupId}`);
}

export default async function AdminCreateGroupPage() {

  return (
    <section className="bg-foreground p-4">

      <AdminCreateGroupForm action={groupCreate} />

    </section>
  );
}
