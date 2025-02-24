import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be atleast 8 characters'),
  remember: z.boolean().default(false),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
