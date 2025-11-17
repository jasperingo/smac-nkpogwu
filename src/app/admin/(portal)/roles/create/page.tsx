import z from 'zod';
import { redirect } from 'next/navigation';
import { findGroupById } from '@/services/group-service';
import AdminCreateRoleForm, { type FormState } from './form';
import { createRole, roleExistByName, roleExistByNameAndGroupId } from '@/services/role-service';
import { roleContactableValidation, roleDescriptionValidation, roleNameValidation, rolePriorityValidation } from '@/validations/roles-validation';

const validationSchema = z.object({
  groupId: z.number().nullish(),
  name: roleNameValidation,
  priority: rolePriorityValidation,
  contactable: roleContactableValidation,
  description: roleDescriptionValidation,
})
.refine(async (dto) => !(await (dto.groupId ? roleExistByNameAndGroupId(dto.name, dto.groupId) : roleExistByName(dto.name))), { 
  path: ['name'],
  error: 'Role with name already exists', 
});

export async function roleCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const priority = formData.get('priority') as string;
  const contactable = formData.get('contactable') as string;
  const description = formData.get('description') as string;
  
  const formStateValues: FormState['values'] = { name, priority, contactable, description };

  const priorityNumber = Number(priority);
  
  const contactableBoolean = contactable === 'true';

  const validatedResult = await validationSchema.safeParseAsync({
    name, 
    groupId,
    description,
    priority: priorityNumber,
    contactable: contactableBoolean,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          name: errors.fieldErrors.name?.[0] ?? null,
          priority: errors.fieldErrors.priority?.[0] ?? null,
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
      priority: priorityNumber,
      contactable: contactableBoolean,
      groupId: isNaN(groupId) || groupId < 1 ? null : groupId,
      description: description.length === 0 ? null : description,
    });
  } catch (error) {
    console.error('Error creating role: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null, 
          priority: null, 
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
  const groupId = Number((await searchParams).groupId);

  const group = isNaN(groupId) ? null : (await findGroupById(groupId));

  return (
    <section className="bg-foreground p-4">

      <AdminCreateRoleForm group={group} action={roleCreate} />

    </section>
  );
}
