import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  userDateOfBirthValidation, 
  userEmailAddressValidation, 
  userFirstNameValidation, 
  userGenderValidation, 
  userIsAdministratorValidation, 
  userLastNameValidation, 
  userMembershipNumberValidation, 
  userMembershipStartDateValidation, 
  userOtherNameValidation, 
  userPasswordValidation, 
  userPhoneNumberValidation, 
  userTitleValidation
} from '@/validations/user-validation';
import { createUser } from '@/services/user-service';
import AdminCreateUserForm, { type FormState } from './form';

const validationSchema = z.object({
  title: userTitleValidation,
  firstName: userFirstNameValidation,
  lastName: userLastNameValidation,
  otherName: userOtherNameValidation,
  gender: userGenderValidation,
  isAdministrator: userIsAdministratorValidation,
  emailAddress: userEmailAddressValidation,
  phoneNumber: userPhoneNumberValidation,
  password: userPasswordValidation,
  dateOfBirth: userDateOfBirthValidation,
  membershipNumber: userMembershipNumberValidation,
  membershipStartDatetime: userMembershipStartDateValidation,
})
.refine((dto) => dto.membershipNumber.length > 0 || dto.membershipStartDatetime === '', { 
  path: ['membershipStartDatetime'],
  error: 'Membership start date should only be provided when membership number is provided', 
});

export async function userCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const title = formData.get('title') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const otherName = formData.get('otherName') as string;
  const gender = formData.get('gender') as string;
  const isAdministrator = formData.get('isAdministrator') as string;
  const emailAddress = formData.get('emailAddress') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const password = formData.get('password') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const membershipNumber = formData.get('membershipNumber') as string;
  const membershipStartDatetime = formData.get('membershipStartDatetime') as string;

  const formStateValues: FormState['values'] = { 
    title,
    firstName, 
    lastName,
    otherName,
    gender,
    isAdministrator,
    emailAddress,
    phoneNumber,
    password,
    dateOfBirth,
    membershipNumber,
    membershipStartDatetime,
  };
  
  const isAdministratorBoolean = isAdministrator === 'true';
  const dateOfBirthDate = new Date(dateOfBirth);
  const membershipStartDatetimeDate = new Date(membershipStartDatetime);

  const validatedResult = await validationSchema.safeParseAsync({
    title,
    firstName, 
    lastName,
    otherName,
    gender,
    emailAddress,
    phoneNumber,
    password,
    membershipNumber,
    isAdministrator: isAdministratorBoolean,
    dateOfBirth: dateOfBirth.length === 0 ? '' : dateOfBirthDate,
    membershipStartDatetime: membershipStartDatetime.length === 0 ? '' : membershipStartDatetimeDate,
  });
  
  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          title: errors.fieldErrors.title?.[0] ?? null,
          firstName: errors.fieldErrors.firstName?.[0] ?? null,
          lastName: errors.fieldErrors.lastName?.[0] ?? null,
          otherName: errors.fieldErrors.otherName?.[0] ?? null,
          gender: errors.fieldErrors.gender?.[0] ?? null,
          isAdministrator: errors.fieldErrors.isAdministrator?.[0] ?? null,
          emailAddress: errors.fieldErrors.emailAddress?.[0] ?? null,
          phoneNumber: errors.fieldErrors.phoneNumber?.[0] ?? null,
          password: errors.fieldErrors.password?.[0] ?? null,
          dateOfBirth: errors.fieldErrors.dateOfBirth?.[0] ?? null,
          membershipNumber: errors.fieldErrors.membershipNumber?.[0] ?? null,
          membershipStartDatetime: errors.fieldErrors.membershipStartDatetime?.[0] ?? null,
        }, 
      },
    };
  }

  let userId: number;

  try {
    userId = await createUser({
      firstName, 
      lastName,
      gender: gender as any,
      isAdministrator: isAdministratorBoolean,
      title: title.length === 0 ? null : title,
      otherName: otherName.length === 0 ? null : otherName,
      emailAddress: emailAddress.length === 0 ? null : emailAddress.toLowerCase(),
      phoneNumber: phoneNumber.length === 0 ? null : phoneNumber,
      password: password.length === 0 ? null : password,
      dateOfBirth: dateOfBirth.length === 0 ? null : dateOfBirthDate,
      membershipNumber: membershipNumber.length === 0 ? null : membershipNumber,
      membershipStartDatetime: membershipStartDatetime.length === 0 ? null : membershipStartDatetimeDate,
    });
  } catch (error) {
    console.error('Error creating user: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: { 
          title: null, 
          firstName: null, 
          lastName: null, 
          otherName: null, 
          gender: null, 
          isAdministrator: null, 
          emailAddress: null, 
          phoneNumber: null, 
          password: null,
          dateOfBirth: null,
          membershipNumber: null,
          membershipStartDatetime: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }

  redirect(`/admin/users/${userId}`);
}

export default async function AdminCreateUserPage() {

  return (
    <section className="bg-foreground p-4">
      <AdminCreateUserForm action={userCreate} />
    </section>
  );
}
