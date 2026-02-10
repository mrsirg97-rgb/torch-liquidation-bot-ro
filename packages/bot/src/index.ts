#!/usr/bin/env node
/**
 * torch-lending-monitor — read-only lending market scanner.
 *
 * displays lending parameters for tokens on Torch Market.
 * no wallet required. no signing. no state changes.
 *
 * usage:
 *   # show all migrated tokens with lending
 *   RPC_URL=<rpc> npx tsx src/index.ts
 *
 *   # show lending info for one token
 *   MINT=<mint> RPC_URL=<rpc> npx tsx src/index.ts
 */

import { Connection } from '@solana/web3.js'
import { getToken, getTokens, getLendingInfo, type LendingInfo } from 'torchsdk'
import { loadReadOnlyConfig } from './config'
import { sol, bpsToPercent } from './utils'

// ---------------------------------------------------------------------------
// read-only info display
// ---------------------------------------------------------------------------

async function showLendingInfo(connection: Connection, mint: string) {
  const token = await getToken(connection, mint)
  const lending: LendingInfo = await getLendingInfo(connection, mint)

  console.log(`\n=== lending info: ${token.name} (${token.symbol}) ===`)
  console.log(`status:                ${token.status}`)
  console.log(`token price:           ${sol(token.price_sol)} SOL`)
  console.log(`interest rate:         ${bpsToPercent(lending.interest_rate_bps)}`)
  console.log(`max LTV:               ${bpsToPercent(lending.max_ltv_bps)}`)
  console.log(`liquidation threshold: ${bpsToPercent(lending.liquidation_threshold_bps)}`)
  console.log(`liquidation bonus:     ${bpsToPercent(lending.liquidation_bonus_bps)}`)
  console.log(`treasury SOL avail:    ${sol(lending.treasury_sol_available)} SOL`)
  console.log(`total SOL lent:        ${lending.total_sol_lent ? sol(lending.total_sol_lent) : sol(0)} SOL`)
  console.log(`active loans:          ${lending.active_loans}`)
}

async function showAllLending(connection: Connection) {
  console.log('=== torch lending monitor ===\n')
  console.log('no MINT specified — showing all migrated tokens with lending\n')

  const { tokens } = await getTokens(connection, {
    status: 'migrated',
    sort: 'volume',
    limit: 10,
  })

  for (const t of tokens) {
    try {
      const lending = await getLendingInfo(connection, t.mint)
      console.log(
        `${t.symbol.padEnd(10)} | ` +
          `rate: ${bpsToPercent(lending.interest_rate_bps).padEnd(7)} | ` +
          `loans: ${String(lending.active_loans).padEnd(4)} | ` +
          `avail: ${sol(lending.treasury_sol_available)} SOL`,
      )
    } catch {
      // token may not have lending enabled yet
    }
  }
}

// ---------------------------------------------------------------------------
// main — read-only only
// ---------------------------------------------------------------------------

async function main() {
  const config = loadReadOnlyConfig()
  const connection = new Connection(config.rpcUrl, 'confirmed')
  const MINT = process.env.MINT

  if (MINT) {
    await showLendingInfo(connection, MINT)
  } else {
    await showAllLending(connection)
  }
}

main()
