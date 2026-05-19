## Goal

Populate the three wallet sheets (Available, Pending, Locked) with realistic example data so users can see what they look like with content, matching the existing "seed demo nests" pattern.

## Where data comes from today

In `src/contexts/AppContext.tsx`:
- **Available** = `walletBalance` (bank deposit) + `walletEntries` where `isLocked === false`
- **Locked** = `walletEntries` where `isLocked === true`
- **Pending** = derived in `WalletTab.tsx` from `groups` with `status === 'active'`, `!isComplete`, `!myTurn`

All three start empty (zeroed-out initial state — per project memory).

## Changes

### 1. `src/contexts/AppContext.tsx`
Add a new action `seedDemoWallet()` exposed on the context:

- Set `walletBalance` to a sample bank deposit (e.g. `$250`).
- Append 2 unlocked `WalletEntry` items (completed nests, available to withdraw), e.g.:
  - "Summer Savings Circle" — $1,200, received 12 days ago
  - "Family Vacation Fund" — $800, received 3 days ago
- Append 2 locked `WalletEntry` items (payout received but nest still running), e.g.:
  - "Office Lunch Pool" — $450, received 5 days ago
  - "Holiday Gift Squad" — $600, received 1 day ago
- Append 2 active `Group` records where `myTurn === false` so they show up as **Pending** payouts:
  - "Rent Split Crew" — total $2,400, position #4, payout in ~3 weeks, 6 members
  - "Wedding Fund" — total $1,500, position #2, payout in ~10 days, 5 members
- Use unique ids (timestamp-based) and guard against double-seeding by id prefix or a flag, mirroring `seedDemoCompletedNests`.
- Fire a toast confirming "Demo wallet data added".

Add `seedDemoWallet: () => void` to `AppContextType` and include it in the provider value.

### 2. Trigger UI
Add a small "Load demo data" button inside `WalletTab.tsx`, visible only when the wallet is fully empty (`totalBalance === 0 && pendingPayouts.length === 0 && lockedEntries.length === 0`). Placed under the hero card as a subtle ghost button. Clicking it calls `seedDemoWallet()`.

This keeps the zeroed-out default (memory rule) while giving users a one-tap way to see populated sheets.

## Out of scope

- No changes to the three sheet components themselves — they already render correctly when data is present.
- No changes to withdraw/deposit logic.
- No backend; this is mock data only.

## Technical notes

- `Group` shape required fields (status, isComplete, myTurn, totalAmount, position, members, name, id, myPayoutDate) are read in `WalletTab` and must be set so the existing filter passes.
- `WalletEntry` requires `userId: currentUserId` for the getters to include it.
- Dates as ISO strings so `new Date(...).toLocaleDateString` works in the sheets.
