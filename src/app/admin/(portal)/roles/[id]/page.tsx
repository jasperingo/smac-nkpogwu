import z from 'zod';
import AdminUpdateRoleForm, { FormState } from './form';
import { findRoleAndGroupById, roleExistByName, roleExistByNameAndGroupId, updateRole } from '@/services/role-service';
import { roleContactableValidation, roleDescriptionValidation, roleNameValidation, rolePriorityValidation } from '@/validations/roles-validation';

const validationSchema = z.object({
  groupId: z.number().nullish(),
  name: roleNameValidation.optional(),
  priority: rolePriorityValidation.optional(),
  contactable: roleContactableValidation.optional(),
  description: roleDescriptionValidation.optional(),
})
.refine(async (dto) => dto.name === undefined || !(await (dto.groupId ? roleExistByNameAndGroupId(dto.name, dto.groupId) : roleExistByName(dto.name))), { 
  path: ['name'],
  error: 'Role with name already exists', 
});

export async function roleUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId'));
  const roleId = Number(formData.get('roleId'));
  const name = formData.get('name') as string;
  const priority = formData.get('priority') as string;
  const contactable = formData.get('contactable') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, priority, contactable, description };
  
  const priorityNumber = Number(priority);

  const contactableBoolean = contactable === 'true';

  const validatedResult = await validationSchema.safeParseAsync({
    groupId,
    name: name !== state.values.name || state.errors.fields.name !== null ? name : undefined, 
    priority: priority !== state.values.priority || state.errors.fields.priority !== null ? priorityNumber : undefined,
    contactable: contactable !== state.values.contactable || state.errors.fields.contactable !== null ? contactableBoolean : undefined,
    description: description !== state.values.description || state.errors.fields.description !== null ? description : undefined,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
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

  try {
    const role = await updateRole(roleId, {
      name: name !== state.values.name ? name : undefined, 
      priority: priority !== state.values.priority ? priorityNumber : undefined,
      contactable: contactable !== state.values.contactable ? contactableBoolean : undefined,
      description: description !== state.values.description ? (description.length === 0 ? null : description) : undefined,
    });
 
    if (role === null) {
      throw new Error('Update role return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          name: null, 
          priority: null, 
          description: null, 
          contactable: null,
        },
      },
      values: {
        name: role.name,
        priority: role.priority.toString(),
        description: role.description ?? '', 
        contactable: role.contactable.toString(), 
      },
    };
  } catch (error) {
    console.error('Error updating role: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: { 
          name: null, 
          priority: null, 
          description: null, 
          contactable: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function AdminRolePage({ params }: Readonly<{ params: Promise<{ id: string }>; }>) {
  const id = Number((await params).id);
  
  if (isNaN(id)) {
    return null;
  }
  
  const role = await findRoleAndGroupById(id);

  if (role === null) {
    return null;
  }

  const { roles, groups } = role;

  return (
    <section className="bg-foreground p-4">

      <AdminUpdateRoleForm role={roles} group={groups} action={roleUpdate} />

    </section>
  );
}
