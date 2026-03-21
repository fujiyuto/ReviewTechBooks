import type { UserRepository } from '../repositories/userRepository.js'
import { supabase } from './supabaseClient.js'

export class SupabaseUserRepository implements UserRepository {
  async create(data: {
    authId: string
    username: string
    biography?: string
  }): Promise<void> {
    const { error } = await supabase.from('users').insert({
      auth_id: data.authId,
      username: data.username,
      biography: data.biography ?? null,
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}
