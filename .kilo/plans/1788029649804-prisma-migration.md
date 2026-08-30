# Prisma Migration Plan

## Context

- **Version**: Prisma 7.10.0, PostgreSQL, Bun runtime
- **Schema**: `backend/prisma/schema.prisma`
- **Existing migrations**: `20260829080911_init` (User table), `20260829083639_add_auth_fields` (renamed User → users)
- **Missing**: Migrations for `Market`, `Outcome`, `Order`, `Trade`, `Position` models
- **Client output**: `backend/src/generated/prisma`

## What needs to be migrated

The schema has 5 models with no migrations:

| Model | Notes |
|-------|-------|
| `Market` | prediction markets, 4 indexes, relation to User, Outcome |
| `Outcome` | binary outcomes per market, probability Decimal(5,4), cascading deletes |
| `Order` | limit orders with side/status, composite index on (marketId, outcomeId, status) |
| `Trade` | matched fills between orders, 4 indexes |
| `Position` | net shares per user/outcome, unique constraint on (userId, outcomeId), Decimal(14,6) |

Plus enums: `Role`, `Category`, `MarketStatus`, `OrderSide`, `OrderStatus`

## Steps

1. **Check current database state** — connect to PostgreSQL and verify which tables exist:
   ```bash
   cd backend
   bun prisma migrate status
   ```
   Or connect directly: `psql $DATABASE_URL -c "\dt"`

2. **If tables already exist** — use `prisma db pull` to reset the schema from database, then `prisma generate`.

3. **If tables do NOT exist** — create new migration:
   ```bash
   cd backend
   bun prisma migrate dev --name add_markets_outcomes_orders_trades_positions
   ```

4. **After migration** — regenerate client:
   ```bash
   bun prisma generate
   ```

5. **Verify** — run `prisma migrate status` to confirm all migrations applied.

## Validation

- `prisma migrate status` shows no pending migrations
- `prisma generate` succeeds without errors
- Application starts without Prisma connection errors

## Open Question

If the tables already exist in the database with a different schema (e.g., created via `db push` or manual SQL), `migrate dev` will conflict. In that case, use `prisma db pull` to reset the schema state to migrations, or `prisma migrate resolve` to mark the state as accepted.
