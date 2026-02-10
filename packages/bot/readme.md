# torch-liquidation-bot v2.0.4 (Read-Only)

Read-only lending market scanner for [Torch Market](https://torch.market) on Solana. No wallet required. Only an RPC endpoint is needed.

> **v2.0.0 Breaking Change:** All wallet-dependent code (bot mode, watch mode, transaction signing) was removed. The source tree contains only read-only code. No wallet, no keypair, no signing.

## Install

```bash
npm install torch-liquidation-bot
```

## Quick Start

```bash
# show lending info for all migrated tokens
RPC_URL=<rpc> npx torch-liquidation-bot

# show lending info for a specific token
MINT=<mint> RPC_URL=<rpc> npx torch-liquidation-bot
```

## What It Does

Every migrated token on Torch has a built-in lending market. This skill discovers those markets and displays their parameters — interest rates, LTV thresholds, treasury balances, and active loan counts.

That's it. No wallet loaded. No transactions built. No state changes.

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RPC_URL` | yes | -- | Solana RPC endpoint. If your provider embeds an API key in the URL, use a read-only key or a public endpoint. |
| `MINT` | no | -- | Token mint address (omit to show all tokens) |
| `LOG_LEVEL` | no | `info` | `debug`, `info`, `warn`, `error` |

No `WALLET`, no `MODE`, no bot-specific config.

## Programmatic Usage

```typescript
import { loadReadOnlyConfig } from 'torch-liquidation-bot/config'
import { Connection } from '@solana/web3.js'
import { getTokens, getLendingInfo } from 'torchsdk'

const config = loadReadOnlyConfig()
const connection = new Connection(config.rpcUrl, 'confirmed')

const { tokens } = await getTokens(connection, {
  status: 'migrated',
  sort: 'volume',
  limit: 50,
})

for (const t of tokens) {
  const lending = await getLendingInfo(connection, t.mint)
  console.log(`${t.symbol}: ${lending.active_loans} active loans`)
}
```

## Architecture

```
src/
├── types.ts    — ReadOnlyConfig interface
├── config.ts   — loadReadOnlyConfig()
├── utils.ts    — sol() + bpsToPercent() helpers
└── index.ts    — read-only entry point
```

## Lending Parameters

| Parameter | Value |
|-----------|-------|
| Max LTV | 50% |
| Liquidation threshold | 65% LTV |
| Interest rate | 2% per epoch (~7 days) |
| Liquidation bonus | 10% of collateral |
| Min borrow | 0.1 SOL |

## Testing

Requires [Surfpool](https://github.com/nicholasgasior/surfpool) running a mainnet fork:

```bash
surfpool start --network mainnet --no-tui
pnpm test    # read-only test
```

## Security

- No wallet loaded, no keypair decoded, no private key in memory
- No transaction building, no signing, no state changes
- Outbound connections: Solana RPC only
- Minimal dependencies: `@solana/web3.js` + `torchsdk`
- No post-install hooks, no remote code fetching
- RPC_URL is used only for read-only RPC calls — never logged, transmitted externally, or stored

## Links

- [torchsdk](https://github.com/mrsirg97-rgb/torchsdk) -- the SDK this skill reads from
- [Torch Market](https://torch.market) -- the protocol
- [ClawHub](https://clawhub.ai/mrsirg97-rgb/torchliquidationbot) -- skill registry

## License

MIT
