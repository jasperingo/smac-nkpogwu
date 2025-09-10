import z from 'zod';
import { redirect } from 'next/navigation';
import { UserEntity } from '@/models/entity';
import { userConstraints } from '@/models/constraints';
import AdminCreateUserForm, { FormState } from './form';
import { createUser, userExistByEmailAddress, userExistByPhoneNumber } from '@/services/user-service';

const validationSchema = z.object({
  firstName: z.string().nonempty('This field is required'),
  lastName: z.string().nonempty('This field is required'),
  otherName: z.union([z.literal(''), z.string()]),
  emailAddress: z.union([
    z.literal(''), 
    z.email('Invalid email address')
      .refine(async (email) => !(await userExistByEmailAddress(email)), 'User with email address already exists')
  ]),
  phoneNumber: z.union([
    z.literal(''), 
    z.string()
      .length(userConstraints.phoneNumberLength, 'Invalid phone number')
      .startsWith(userConstraints.phoneNumberPrefix, 'Invalid phone number')
      .refine(async (phone) => !(await userExistByPhoneNumber(phone)), 'User with phone number already exists')
  ]),
  password: z.union([
    z.literal(''), 
    z.string('Invalid password provided')
      .min(userConstraints.passwordMin, { error: (issue) => `Password should be more than ${(issue.minimum as number) - 1} characters`, })
      .max(userConstraints.passwordMax, { error: (issue) => `Password should be less than ${(issue.maximum as number) + 1} characters`, })
  ]),
  dateOfBirth: z.union([
    z.literal(''), 
    z.date('Invalid date of birth').refine((date) => date.getTime() <= Date.now(), 'Date of birth cannot be in the future')
  ]),
  membershipNumber: z.union([z.literal(''), z.string()]),
});

export async function userCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const otherName = formData.get('otherName') as string;
  const emailAddress = formData.get('emailAddress') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const password = formData.get('password') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const membershipNumber = formData.get('membershipNumber') as string;

  // for (const [k, v] of formData.entries()) {
  //   console.log('Key: ', k, ' & Value: ', v);
  // }

  const validatedResult = await validationSchema.safeParseAsync({
    firstName, 
    lastName,
    otherName,
    emailAddress,
    phoneNumber,
    password,
    membershipNumber,
    dateOfBirth: dateOfBirth.length === 0 ? '' : new Date(dateOfBirth),
  });
  
  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      errors: { 
        message: null, 
        fields: {
          firstName: errors.fieldErrors.firstName?.[0] ?? null,
          lastName: errors.fieldErrors.lastName?.[0] ?? null,
          otherName: errors.fieldErrors.otherName?.[0] ?? null,
          emailAddress: errors.fieldErrors.emailAddress?.[0] ?? null,
          phoneNumber: errors.fieldErrors.phoneNumber?.[0] ?? null,
          password: errors.fieldErrors.password?.[0] ?? null,
          dateOfBirth: errors.fieldErrors.dateOfBirth?.[0] ?? null,
          membershipNumber: errors.fieldErrors.membershipNumber?.[0] ?? null,
        }, 
      },
      values: { 
        firstName, 
        lastName,
        otherName,
        emailAddress,
        phoneNumber,
        password,
        dateOfBirth,
        membershipNumber,
      },
    };
  }

  let user: UserEntity | null;

  try {
    user = await createUser({
      firstName, 
      lastName,
      gender: 'MALE',
      otherName: otherName.length === 0 ? null : otherName,
      emailAddress: emailAddress.length === 0 ? null : emailAddress.toLowerCase(),
      phoneNumber: phoneNumber.length === 0 ? null : phoneNumber,
      password: password.length === 0 ? null : password,
      dateOfBirth: dateOfBirth.length === 0 ? null : new Date(dateOfBirth),
      membershipNumber: membershipNumber.length === 0 ? null : membershipNumber,
    });

    if (user === null) {
      throw new Error('Error create user: return value is null');
    }
  } catch (error) {
    return { 
      values: { 
        firstName, 
        lastName,
        otherName,
        emailAddress,
        phoneNumber,
        password,
        dateOfBirth,
        membershipNumber,
      },
      errors: { 
        message: error instanceof Error ? error.message : error as string, 
        fields: { 
          firstName: null, 
          lastName: null, 
          otherName: null, 
          emailAddress: null, 
          phoneNumber: null, 
          password: null,
          dateOfBirth: null,
          membershipNumber: null,
        } 
      }
    };
  }

  redirect(`/admin/users/${user.id}`);
}

export default async function AdminCreateUserPage() {

  return (
    <section className="bg-foreground p-4">
      <AdminCreateUserForm action={userCreate} />
    </section>
  );
}
