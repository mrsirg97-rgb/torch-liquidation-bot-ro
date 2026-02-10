/**
 * config.ts — loads environment variables into a typed ReadOnlyConfig.
 *
 * no wallet loaded, no keypair decoded, no signing possible.
 */

import type { ReadOnlyConfig, LogLevel } from './types'

const LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error']

export function loadReadOnlyConfig(): ReadOnlyConfig {
  const rpcUrl = process.env.RPC_URL
  if (!rpcUrl) throw new Error('RPC_URL env var is required')

  const logLevel = (process.env.LOG_LEVEL ?? 'info') as LogLevel
  if (!LOG_LEVELS.includes(logLevel)) {
    throw new Error(`LOG_LEVEL must be one of: ${LOG_LEVELS.join(', ')}`)
  }

  return { rpcUrl, logLevel }
}
