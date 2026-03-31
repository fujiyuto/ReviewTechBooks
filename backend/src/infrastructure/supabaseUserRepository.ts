import type {
  UserRepository,
  UserDetail,
  UserReview,
} from '../repositories/userRepository.js'
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

  async findByUsername(username: string): Promise<UserDetail | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, biography, role, created_at, updated_at')
      .eq('username', username)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(error.message)
    }

    return {
      id: data.id,
      username: data.username,
      biography: data.biography,
      role: data.role,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async findReviewsByUsername(
    username: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: UserReview[]; total: number }> {
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('reviews')
      .select(
        `
        id,
        title,
        content,
        created_at,
        updated_at,
        books (
          id,
          title,
          thumbnail_url
        ),
        review_categories (
          categories (
            id,
            name,
            order
          )
        ),
        users!inner (
          username
        )
      `,
        { count: 'exact' },
      )
      .eq('users.username', username)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(error.message)
    }

    const reviews: UserReview[] = (data ?? []).map((row) => {
      const book = Array.isArray(row.books) ? row.books[0] : row.books
      const categories = (row.review_categories ?? []).flatMap((rc) => {
        const cat = Array.isArray(rc.categories)
          ? rc.categories[0]
          : rc.categories
        return cat
          ? [
              {
                id: cat.id as number,
                name: cat.name as string,
                order: cat.order as number,
              },
            ]
          : []
      })

      return {
        id: row.id,
        book: {
          id: book?.id ?? 0,
          title: book?.title ?? '',
          thumbnailUrl: book?.thumbnail_url ?? null,
        },
        title: row.title,
        content: row.content,
        categories,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    })

    return { reviews, total: count ?? 0 }
  }
}
