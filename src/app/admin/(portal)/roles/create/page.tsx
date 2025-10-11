import z from 'zod';
import { redirect } from 'next/navigation';
import AdminCreateRoleForm, { type FormState } from './form';
import { createRole, roleExistByName, roleExistByNameAndGroupId } from '@/services/role-service';
import { roleContactableValidation, roleDescriptionValidation, roleNameValidation } from '@/validations/roles-validation';

const validationSchema = z.object({
  groupId: z.number().nullish(),
  name: roleNameValidation,
  contactable: roleContactableValidation,
  description: roleDescriptionValidation,
})
.refine(async (dto) => dto.groupId ? !(await roleExistByNameAndGroupId(dto.name, dto.groupId)) : !(await roleExistByName(dto.name)), 'Role with name already exists');

export async function roleCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const name = formData.get('name') as string;
  const contactable = formData.get('contactable') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, contactable, description };

  const validatedResult = await validationSchema.safeParseAsync({
    name, 
    description,
    contactable: contactable === 'true',
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          name: errors.fieldErrors.name?.[0] ?? errors.formErrors[0] ?? null,
          contactable: errors.fieldErrors.contactable?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }

  let roleId: number;

  try {
    roleId = await createRole({
      name, 
      contactable: contactable === 'true',
      groupId: null,
      description: description.length === 0 ? null : description,
    });
  } catch (error) {
    console.error('Error creating role: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null, 
          description: null, 
          contactable: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/roles/${roleId}`);
}

export default async function AdminCreateRolePage({ searchParams }: { searchParams: Promise<{ groupId?: string; }> }) {
  // const parentId = Number((await searchParams).parentId);

  // const group = isNaN(parentId) ? null : (await findGroupById(parentId));

  return (
    <section className="bg-foreground p-4">

      <AdminCreateRoleForm action={roleCreate} />

    </section>
  );
}
