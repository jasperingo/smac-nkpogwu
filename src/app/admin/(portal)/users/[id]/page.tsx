import z from 'zod';
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
import { getDateInputString } from '@/utils/datetime';
import AdminUpdateUserForm, { type FormState } from './form';
import { findUserById, updateUser } from '@/services/user-service';

const validationSchema = z.object({
  firstName: userFirstNameValidation.optional(),
  lastName: userLastNameValidation.optional(),
  otherName: userOtherNameValidation.optional(),
  gender: userGenderValidation.optional(),
  emailAddress: userEmailAddressValidation.optional(),
  phoneNumber: userPhoneNumberValidation.optional(),
  password: userPasswordValidation.optional(),
  dateOfBirth: userDateOfBirthValidation.optional(),
  membershipNumber: userMembershipValidation.optional(),
});

export async function userUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId'));
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
    firstName: firstName !== state.values.firstName || state.errors.fields.firstName !== null ? firstName : undefined, 
    lastName: lastName !== state.values.lastName || state.errors.fields.lastName !== null ? lastName : undefined,
    otherName: otherName !== state.values.otherName || state.errors.fields.otherName !== null ? otherName : undefined,
    gender: gender !== state.values.gender || state.errors.fields.gender !== null ? gender : undefined,
    emailAddress: emailAddress !== state.values.emailAddress || state.errors.fields.emailAddress !== null ? emailAddress : undefined,
    phoneNumber: phoneNumber !== state.values.phoneNumber || state.errors.fields.phoneNumber !== null ? phoneNumber : undefined,
    password: password !== '' || state.errors.fields.password !== null ? password : undefined,
    membershipNumber: membershipNumber !== state.values.membershipNumber || state.errors.fields.membershipNumber !== null ? membershipNumber : undefined,
    dateOfBirth: dateOfBirth !== state.values.dateOfBirth || state.errors.fields.dateOfBirth !== null ? (dateOfBirth.length === 0 ? '' : new Date(dateOfBirth)) : undefined,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
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

  try {
    const user = await updateUser(userId, {
      firstName: firstName !== state.values.firstName ? firstName : undefined, 
      lastName: lastName !== state.values.lastName ? lastName : undefined,
      otherName: otherName !== state.values.otherName ? (otherName.length === 0 ? null : otherName) : undefined,
      gender: gender !== state.values.gender ? (gender as any) : undefined,
      emailAddress: emailAddress !== state.values.emailAddress ? (emailAddress.length === 0 ? null : emailAddress.toLowerCase()) : undefined,
      phoneNumber: phoneNumber !== state.values.phoneNumber ? (phoneNumber.length === 0 ? null : phoneNumber) : undefined,
      password: password !== '' ? (password.length === 0 ? null : password) : undefined,
      membershipNumber: membershipNumber !== state.values.membershipNumber ? (membershipNumber.length === 0 ? null : membershipNumber) : undefined,
      dateOfBirth: dateOfBirth !== state.values.dateOfBirth ? (dateOfBirth.length === 0 ? null : new Date(dateOfBirth)) : undefined,
    });
 
    if (user === null) {
      throw new Error('Update user return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          firstName: null, 
          lastName: null, 
          otherName: null, 
          gender: null, 
          emailAddress: null, 
          phoneNumber: null, 
          password: null,
          dateOfBirth: null,
          membershipNumber: null,
        },
      },
      values: {
        firstName: user.firstName,
        lastName: user.lastName, 
        otherName: user.otherName ?? '', 
        gender: user.gender, 
        emailAddress: user.emailAddress ?? '', 
        phoneNumber: user.phoneNumber ?? '', 
        password: '',
        dateOfBirth: user.dateOfBirth ? getDateInputString(user.dateOfBirth) : '',
        membershipNumber: user.membershipNumber ?? '',
      },
    };
  } catch (error) {
    console.error('Error updating user: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: {
          firstName: null, 
          lastName: null, 
          otherName: null, 
          gender: null, 
          emailAddress: null, 
          phoneNumber: null, 
          password: null,
          dateOfBirth: null,
          membershipNumber: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  const user = (await findUserById(id))!;

  return (
    <section className="bg-foreground p-4">
      
      <AdminUpdateUserForm user={user} action={userUpdate} />

    </section>
  );
}
