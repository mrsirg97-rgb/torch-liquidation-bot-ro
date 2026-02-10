/**
 * utils.ts — shared helpers.
 */

import { LAMPORTS_PER_SOL } from 'torchsdk'

export function sol(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4)
}

export function bpsToPercent(bps: number): string {
  return (bps / 100).toFixed(2) + '%'
}
