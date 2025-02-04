import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    phoneNumber: z
      .string()
      .refine(isPossiblePhoneNumber, { message: 'Invalid phone number' }),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    acceptTerms: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match', // 👈 Add a custom error messag
    path: ['confirmPassword'],
  });

export type TRegisterSchema = z.infer<typeof registerSchema>;
