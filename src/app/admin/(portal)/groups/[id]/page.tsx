import z from 'zod';
import { 
  groupDescriptionValidation, 
  groupNameValidation, 
  groupPrivacyValidation, 
  groupSpotlightedValidation 
} from '@/validations/groups-validation';
import AdminUpdateGroupForm, { type FormState } from './form';
import SimpleDescriptionList from '@/components/simple-description-list';
import { countGroupMembersByGroupId } from '@/services/group-member-service';
import { countGroupsByParentId, findGroupAndParentById, updateGroup } from '@/services/group-service';

const validationSchema = z.object({
  name: groupNameValidation.optional(),
  privacy: groupPrivacyValidation.optional(),
  spotlighted: groupSpotlightedValidation.optional(),
  description: groupDescriptionValidation.optional(),
});

async function groupUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId'));
  const name = formData.get('name') as string;
  const privacy = formData.get('privacy') as string;
  const spotlighted = formData.get('spotlighted') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, privacy, spotlighted, description };
  
  const spotlightedBoolean = spotlighted === 'true';

  const validatedResult = await validationSchema.safeParseAsync({
    name: name !== state.values.name || state.errors.fields.name !== null ? name : undefined, 
    privacy: privacy !== state.values.privacy || state.errors.fields.privacy !== null ? privacy : undefined,
    spotlighted: spotlighted !== state.values.spotlighted || state.errors.fields.spotlighted !== null ? spotlightedBoolean : undefined,
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
          privacy: errors.fieldErrors.privacy?.[0] ?? null,
          spotlighted: errors.fieldErrors.spotlighted?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }


  try {
    const group = await updateGroup(groupId, {
      name: name !== state.values.name ? name : undefined, 
      privacy: privacy !== state.values.privacy ? (privacy as any) : undefined,
      spotlighted: spotlighted !== state.values.spotlighted ? spotlightedBoolean : undefined,
      description: description !== state.values.description ? (description.length === 0 ? null : description) : undefined,
    });
 
    if (group === null) {
      throw new Error('Update group return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          name: null, 
          privacy: null, 
          description: null, 
          spotlighted: null,
        },
      },
      values: {
        name: group.name,
        privacy: group.privacy, 
        description: group.description ?? '', 
        spotlighted: group.spotlighted.toString(), 
      },
    };
  } catch (error) {
    console.error('Error updating group: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: { 
          name: null, 
          privacy: null, 
          description: null, 
          spotlighted: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function AdminGroupPage({ params }: Readonly<{ params: Promise<{ id: string }>; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }

  const group = await findGroupAndParentById(id);

  if (group === null) {
    return null;
  }

  const { groups, parent } = group;

  const [membersCount, subGroupsCount] = await Promise.all([ countGroupMembersByGroupId(groups.id), countGroupsByParentId(groups.id) ]);

  return (
    <section className="bg-foreground p-4">
      <div className="bg-gray-200 px-2 pt-2 pb-1 mb-4">
        
        <SimpleDescriptionList
          itemsSpacing="md"
          items={[
            { 
              term: 'Number of members', 
              displayRow: true,
              details: membersCount, 
            },
            { 
              term: 'Number of sub groups', 
              displayRow: true, 
              details: subGroupsCount, 
            },
          ]} 
        />
      
      </div>

      <AdminUpdateGroupForm group={groups} parent={parent} action={groupUpdate} />

    </section>
  );
}
