import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  userDateOfBirthValidation, 
  userEmailAddressValidation, 
  userFirstNameValidation, 
  userGenderValidation, 
  userLastNameValidation, 
  userMembershipValidation, 
  userOtherNameValidation, 
  userPasswordValidation, 
  userPhoneNumberValidation 
} from '@/validations/user-validation';
import { createUser } from '@/services/user-service';
import AdminCreateUserForm, { FormState, initialState } from './form';

const validationSchema = z.object({
  firstName: userFirstNameValidation,
  lastName: userLastNameValidation,
  otherName: userOtherNameValidation,
  gender: userGenderValidation,
  emailAddress: userEmailAddressValidation,
  phoneNumber: userPhoneNumberValidation,
  password: userPasswordValidation,
  dateOfBirth: userDateOfBirthValidation,
  membershipNumber: userMembershipValidation,
});

export async function userCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const otherName = formData.get('otherName') as string;
  const gender = formData.get('gender') as string;
  const emailAddress = formData.get('emailAddress') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const password = formData.get('password') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const membershipNumber = formData.get('membershipNumber') as string;

  const formStateValues: FormState['values'] = { 
    firstName, 
    lastName,
    otherName,
    gender,
    emailAddress,
    phoneNumber,
    password,
    dateOfBirth,
    membershipNumber,
  };

  const validatedResult = await validationSchema.safeParseAsync({
    firstName, 
    lastName,
    otherName,
    gender,
    emailAddress,
    phoneNumber,
    password,
    membershipNumber,
    dateOfBirth: dateOfBirth.length === 0 ? '' : new Date(dateOfBirth),
  });
  
  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          firstName: errors.fieldErrors.firstName?.[0] ?? null,
          lastName: errors.fieldErrors.lastName?.[0] ?? null,
          otherName: errors.fieldErrors.otherName?.[0] ?? null,
          gender: errors.fieldErrors.gender?.[0] ?? null,
          emailAddress: errors.fieldErrors.emailAddress?.[0] ?? null,
          phoneNumber: errors.fieldErrors.phoneNumber?.[0] ?? null,
          password: errors.fieldErrors.password?.[0] ?? null,
          dateOfBirth: errors.fieldErrors.dateOfBirth?.[0] ?? null,
          membershipNumber: errors.fieldErrors.membershipNumber?.[0] ?? null,
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
      otherName: otherName.length === 0 ? null : otherName,
      emailAddress: emailAddress.length === 0 ? null : emailAddress.toLowerCase(),
      phoneNumber: phoneNumber.length === 0 ? null : phoneNumber,
      password: password.length === 0 ? null : password,
      dateOfBirth: dateOfBirth.length === 0 ? null : new Date(dateOfBirth),
      membershipNumber: membershipNumber.length === 0 ? null : membershipNumber,
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

  redirect(`/admin/users/${userId}`);
}

export default async function AdminCreateUserPage() {

  return (
    <section className="bg-foreground p-4">
      <AdminCreateUserForm action={userCreate} />
    </section>
  );
}
