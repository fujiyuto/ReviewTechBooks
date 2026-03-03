import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// vitest は非グローバルモードのため @testing-library/react の自動クリーンアップが
// 機能しない。明示的に afterEach で cleanup を登録する
afterEach(cleanup)
