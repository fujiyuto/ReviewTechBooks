import z from "zod"

export const userRegistrationSchema = z.object({
  authId: z.string().uuid(),
  username: z.string().min(1).max(20),
  lastName: z.string().max(50).optional(),
  firstName: z.string().max(50).optional(),
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
