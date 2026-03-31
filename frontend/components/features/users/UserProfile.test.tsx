import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserProfile } from '@/components/features/users/UserProfile'
import type { components } from '@/types/api'

type User = components['schemas']['User']

const baseUser: User = {
  id: 1,
  username: 'testuser',
  biography: 'こんにちわ',
  role: 'free',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('UserProfile', () => {
  it('ユーザー名が表示される', () => {
    render(<UserProfile user={baseUser} />)
    screen.getByText('testuser')
  })

  it('ユーザー名がない場合「名無しユーザー」が表示される', () => {
    render(<UserProfile user={{ ...baseUser, username: undefined }} />)
    screen.getByText('名無しユーザー')
  })

  it('自己紹介が表示される', () => {
    render(<UserProfile user={baseUser} />)
    screen.getByText('こんにちわ')
  })

  it('自己紹介がない場合は表示されない', () => {
    render(<UserProfile user={{ ...baseUser, biography: undefined }} />)
    expect(screen.queryByText('こんにちわ')).toBeNull()
  })

  it('フリーロールのバッジが表示される', () => {
    render(<UserProfile user={baseUser} />)
    screen.getByText('フリー')
  })

  it('プレミアムロールのバッジが表示される', () => {
    render(<UserProfile user={{ ...baseUser, role: 'premium' }} />)
    screen.getByText('プレミアム')
  })

  it('ロールがない場合バッジは表示されない', () => {
    render(<UserProfile user={{ ...baseUser, role: undefined }} />)
    expect(screen.queryByText('フリー')).toBeNull()
    expect(screen.queryByText('プレミアム')).toBeNull()
  })
})
