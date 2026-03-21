import z from 'zod'

export const userRegistrationSchema = z.object({
  authId: z.uuid(),
  username: z.string().min(1).max(20),
  biography: z.string(),
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
