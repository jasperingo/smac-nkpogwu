import z from 'zod';
import { 
  userDateOfBirthValidation, 
  userEmailAddressValidation, 
  userFirstNameValidation, 
  userGenderValidation, 
  userLastNameValidation, 
  userMembershipNumberValidation, 
  userMembershipStartDateValidation, 
  userOtherNameValidation, 
  userPhoneNumberValidation, 
  userTitleValidation
} from '@/validations/user-validation';
import { getDateInputString } from '@/utils/datetime';
import UpdateUserForm, { type FormState } from './form';
import { findUserById, updateUser } from '@/services/user-service';

const validationSchema = z.object({
  title: userTitleValidation.optional(),
  firstName: userFirstNameValidation.optional(),
  lastName: userLastNameValidation.optional(),
  otherName: userOtherNameValidation.optional(),
  gender: userGenderValidation.optional(),
  emailAddress: userEmailAddressValidation.optional(),
  phoneNumber: userPhoneNumberValidation.optional(),
  dateOfBirth: userDateOfBirthValidation.optional(),
  membershipNumber: userMembershipNumberValidation.optional(),
  membershipStartDatetime: userMembershipStartDateValidation.optional(),
})
.refine((dto) => dto.membershipNumber === undefined || dto.membershipNumber.length > 0 || dto.membershipStartDatetime === '', { 
  path: ['membershipStartDatetime'],
  error: 'Membership start date should only be provided when membership number is provided', 
});

export async function userUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId'));
  const title = formData.get('title') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const otherName = formData.get('otherName') as string;
  const gender = formData.get('gender') as string;
  const emailAddress = formData.get('emailAddress') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const membershipNumber = formData.get('membershipNumber') as string;
  const membershipStartDatetime = formData.get('membershipStartDatetime') as string;

  const formStateValues: FormState['values'] = {
    title,
    firstName, 
    lastName,
    otherName,
    gender,
    emailAddress,
    phoneNumber,
    dateOfBirth,
    membershipNumber,
    membershipStartDatetime,
  };

  const dateOfBirthDate = new Date(dateOfBirth);
  const membershipStartDatetimeDate = new Date(membershipStartDatetime);

  const validateMembershipNumber = membershipNumber !== state.values.membershipNumber || state.errors.fields.membershipNumber !== null;
  const validateMembershipStartDatetime = membershipStartDatetime !== state.values.membershipStartDatetime || state.errors.fields.membershipStartDatetime !== null;

  const validatedResult = await validationSchema.safeParseAsync({
    title: title !== state.values.title || state.errors.fields.title !== null ? title : undefined,
    firstName: firstName !== state.values.firstName || state.errors.fields.firstName !== null ? firstName : undefined, 
    lastName: lastName !== state.values.lastName || state.errors.fields.lastName !== null ? lastName : undefined,
    otherName: otherName !== state.values.otherName || state.errors.fields.otherName !== null ? otherName : undefined,
    gender: gender !== state.values.gender || state.errors.fields.gender !== null ? gender : undefined,
    emailAddress: emailAddress !== state.values.emailAddress || state.errors.fields.emailAddress !== null ? emailAddress : undefined,
    phoneNumber: phoneNumber !== state.values.phoneNumber || state.errors.fields.phoneNumber !== null ? phoneNumber : undefined,
    membershipNumber: validateMembershipNumber || validateMembershipStartDatetime ? membershipNumber : undefined,
    dateOfBirth: dateOfBirth !== state.values.dateOfBirth || state.errors.fields.dateOfBirth !== null ? (dateOfBirth.length === 0 ? '' : dateOfBirthDate) : undefined,
    membershipStartDatetime: validateMembershipStartDatetime || validateMembershipNumber ? (membershipStartDatetime.length === 0 ? '' : membershipStartDatetimeDate) : undefined,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          title: errors.fieldErrors.title?.[0] ?? null,
          firstName: errors.fieldErrors.firstName?.[0] ?? null,
          lastName: errors.fieldErrors.lastName?.[0] ?? null,
          otherName: errors.fieldErrors.otherName?.[0] ?? null,
          gender: errors.fieldErrors.gender?.[0] ?? null,
          emailAddress: errors.fieldErrors.emailAddress?.[0] ?? null,
          phoneNumber: errors.fieldErrors.phoneNumber?.[0] ?? null,
          dateOfBirth: errors.fieldErrors.dateOfBirth?.[0] ?? null,
          membershipNumber: errors.fieldErrors.membershipNumber?.[0] ?? null,
          membershipStartDatetime: errors.fieldErrors.membershipStartDatetime?.[0] ?? null,
        }, 
      },
    };
  }

  try {
    const user = await updateUser(userId, {
      firstName: firstName !== state.values.firstName ? firstName : undefined, 
      lastName: lastName !== state.values.lastName ? lastName : undefined,
      title: title !== state.values.title ? (title.length === 0 ? null : title) : undefined,
      otherName: otherName !== state.values.otherName ? (otherName.length === 0 ? null : otherName) : undefined,
      gender: gender !== state.values.gender ? (gender as any) : undefined,
      emailAddress: emailAddress !== state.values.emailAddress ? (emailAddress.length === 0 ? null : emailAddress.toLowerCase()) : undefined,
      phoneNumber: phoneNumber !== state.values.phoneNumber ? (phoneNumber.length === 0 ? null : phoneNumber) : undefined,
      membershipNumber: membershipNumber !== state.values.membershipNumber ? (membershipNumber.length === 0 ? null : membershipNumber) : undefined,
      dateOfBirth: dateOfBirth !== state.values.dateOfBirth ? (dateOfBirth.length === 0 ? null : dateOfBirthDate) : undefined,
      membershipStartDatetime: membershipStartDatetime !== state.values.membershipStartDatetime ? (membershipStartDatetime.length === 0 ? null : membershipStartDatetimeDate) : undefined,
    });
 
    if (user === null) {
      throw new Error('Update user details return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          title: null, 
          firstName: null, 
          lastName: null, 
          otherName: null, 
          gender: null, 
          emailAddress: null, 
          phoneNumber: null,
          dateOfBirth: null,
          membershipNumber: null,
          membershipStartDatetime: null,
        },
      },
      values: {
        title: user.title ?? '',
        firstName: user.firstName,
        lastName: user.lastName, 
        otherName: user.otherName ?? '', 
        gender: user.gender,
        emailAddress: user.emailAddress ?? '', 
        phoneNumber: user.phoneNumber ?? '', 
        dateOfBirth: user.dateOfBirth ? getDateInputString(user.dateOfBirth) : '',
        membershipNumber: user.membershipNumber ?? '',
        membershipStartDatetime: user.membershipStartDatetime ? getDateInputString(user.membershipStartDatetime) : '',
      },
    };
  } catch (error) {
    console.error('Error updating user details: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: {
          title: null, 
          firstName: null, 
          lastName: null, 
          otherName: null, 
          gender: null, 
          emailAddress: null, 
          phoneNumber: null, 
          dateOfBirth: null,
          membershipNumber: null,
          membershipStartDatetime: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function UserUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }
  
  const user = await findUserById(id);

  if (user === null) {
    return null;
  }

  return (
    <section className="bg-foreground p-4">
      
      <UpdateUserForm user={user} action={userUpdate} />

    </section>
  );
}
