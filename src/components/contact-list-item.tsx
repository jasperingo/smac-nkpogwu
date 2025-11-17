import RoundedImage from './rounded-image';
import SimpleDescriptionList from './simple-description-list';
import { GroupEntity, GroupMemberEntity, RoleAssigneeEntity, RoleEntity, UserDefaultImage, UserEntity } from '@/models/entity';

export default function ContactListItem(
  { 
    contact 
  }: { 
    contact: {
      roleAssignees: RoleAssigneeEntity;
      roles: RoleEntity | null;
      groupMembers: GroupMemberEntity | null;
      groups: GroupEntity | null;
      users: UserEntity | null;
    };
  }
) {
  return (
    <li className="mb-4 md:mb-0">
      <div className="border p-2 flex gap-2 items-start">
        <RoundedImage
          alt={`${contact.roleAssignees.id} image`}
          src={contact.users?.imageUrl ?? UserDefaultImage} 
        />

        <div>
          <SimpleDescriptionList
            items={[
              { 
                term: 'Role', 
                details: `${contact.groups ? `${contact.groups.name} - ` : ''}${contact.roles?.name}`, 
                displayRow: true
              },
              { 
                term: 'Name', 
                details: `${contact.users?.title ?? ''} ${contact.users?.firstName} ${contact.users?.lastName}`, 
                displayRow: true 
              },
              { 
                term: 'Email', 
                displayRow: true,
                details: contact.users?.emailAddress 
                  ? <a href={`mailto:${contact.users?.emailAddress}`} target="_blank" className="text-blue-600">{ contact.users?.emailAddress }</a> 
                  : '(Not set)', 
              },
              { 
                term: 'Phone', 
                displayRow: true,
                details: contact.users?.phoneNumber 
                  ? <a href={`tel:${contact.users?.phoneNumber}`} target="_blank" className="text-blue-600">{ contact.users?.phoneNumber }</a>
                  : '(Not set)', 
              },
            ]} 
          />
        </div>
      </div>
    </li>
  );
}
