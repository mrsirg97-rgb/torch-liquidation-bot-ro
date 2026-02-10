/**
 * types.ts — interfaces for the read-only lending scanner.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface ReadOnlyConfig {
  rpcUrl: string
  logLevel: LogLevel
}
