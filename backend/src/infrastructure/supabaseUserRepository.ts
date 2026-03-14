import type { UserRepository } from '../repositories/userRepository.js'
import { supabase } from './supabaseClient.js'

export class SupabaseUserRepository implements UserRepository {
  async create(data: {
    authId: string
    username: string
    lastName?: string
    firstName?: string
  }): Promise<void> {
    const { error } = await supabase.from('users').insert({
      auth_id: data.authId,
      username: data.username,
      last_name: data.lastName ?? null,
      first_name: data.firstName ?? null,
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}
