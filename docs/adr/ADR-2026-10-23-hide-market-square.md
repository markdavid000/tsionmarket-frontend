# ADR: Hide Market Square and the Kash card's Buy button

- **Status:** Accepted 2026-10-23 by the maintainer of this fork
- **Date:** 2026-10-23
- **Scope:** Frontend only. Every place the app shows Market Square or lets a
  user act on it, Shine's automatic posting to it, the two Market Square
  environment variables, and the Buy button on the Kash card. No backend
  change. Nothing is deleted.

## Context

Market Square is the ecosystem's social surface. It is a separate deployment
served at `/square` on this origin (see `lib/square-zone.ts` and the rewrite
in `next.config.ts`), and this app reaches it in three ways:

1. **Ways in:** links and cards that take the user to the square.
2. **Ways to post:** buttons that share an activity or a trade to the square,
   panels that broadcast a game to it, and Shine, which posts confirmed trades
   to it automatically.
3. **In-app sections:** the feed, the promos between the service briefs and
   the compose button on the dashboard. These are already off through
   `IN_APP_SQUARE_SHOWN = false` in `lib/market-square.ts`.

The frontend lead asked for the square to be invisible in this deployment,
with the code commented out rather than deleted so it can be restored. The
same request covers the Buy button on the Kash card in the portfolio.

The existing switch is not enough on its own. With
`NEXT_PUBLIC_MARKET_SQUARE_URL` unset, `lib/market-square.ts` falls back to the
production square, so every way in stays visible. Several surfaces read no
switch at all: the phone tab bar's Square seat, the share buttons, the game
broadcast panels and Shine.

## Decision

Comment out each render site and each entry point. Every commented block
starts with the line

```
Market Square hidden: see docs/adr/ADR-2026-10-23-hide-market-square.md.
```

or, for the Kash button, `Kash Buy hidden: see ...`, so a search for
`Market Square hidden` or `Kash Buy hidden` finds every place to restore.

| Surface                              | Where it was commented out                                                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sidebar "Square" row                 | `components/layout/sidebar.tsx`                                                                                                                                 |
| Phone tab bar "Square" seat          | `components/layout/curved-tab-bar.tsx`                                                                                                                          |
| Go Live control                      | `components/layout/sidebar.tsx`                                                                                                                                 |
| Shine settings and their menu rows   | `components/layout/sidebar.tsx`, `dashboard-shell.tsx`, `account-popover.tsx`, `modals/account-modal.tsx`, `modals/app-modals.tsx`                              |
| Shine automatic posting              | `app/(session)/providers.tsx` no longer mounts the Shine runtime                                                                                                |
| "Join the Conversation" square cards | `features/discovery/components/conversation-row.tsx`. The chess room card stays, and the row heading links to `/casino/chess`                                   |
| Portfolio Market Square banner       | `features/portfolio/components/portfolio-view.tsx`, phone carousel and desktop rail                                                                             |
| Share to Market Square               | `features/activity/components/activity-detail-sheet.tsx`, `activity-row.tsx`, `pnl-cards.tsx`, `features/trade/components/buy-sheet.tsx`                        |
| Broadcast to Market Square           | `features/casino/components/chess-app/play-section.tsx`, `draughts/checkers-play.tsx`, `arkball/arkball-section.tsx`, `last-standing/last-standing-section.tsx` |
| Kash card Buy button                 | `features/portfolio/components/kash-card.tsx`, `kash-card-mobile.tsx`, and the `onBuy` props passed to them                                                     |
| Environment variables                | `NEXT_PUBLIC_MARKET_SQUARE_URL` and `NEXT_PUBLIC_MARKET_SQUARE_LIVE` commented out in `.env.example`. The local `.env` is not in git and is edited by hand      |

The components behind these sites are left whole: `features/square`,
`components/share`, `components/broadcast`, `components/shine`, the
`ShineRuntimeProvider`, the broadcast hooks, `lib/market-square.ts`,
`lib/square*`, the `app/api/market-square` and `app/api/square` proxies, and
the locale strings. Their own unit tests still run against them.

### What stays, and why

- **Profile pictures.** `SquareAvatar` draws the user's Square profile picture
  in the account chrome. It is an avatar, not a way into the square.
- **The Kash promo banner.** It still opens the Kash Buy screen. Only the
  card's Buy button was asked for.
- **Legal text.** The Terms and Privacy pages still describe Market Square.
  Changing legal wording is a content decision, not a UI one.
- **The `/square` rewrite** in `next.config.ts`. Nothing in the app links to it
  now, and leaving it means a restore needs no config change.

### Behaviour that follows

- **Phone tab bar.** It has four tabs on a dome drawn for five seats. The
  active tab takes the centre, two sit to its left, one to its right, and the
  far right seat stays empty. Spacing four tabs evenly would be a redesign of
  the dome, which is left to the designer.
- **Desktop promo rail.** It shows ArkStore, Ark ID, stake and Kash. The
  second stake banner only stood in for the square's slot, so it is not shown.
- **Kash card.** It shows Send (where enabled) and Convert. The mobile card's
  grid drops a column to match.
- **Shine.** With no runtime installed, `reportShine` records
  `SHINE_NOT_CONFIGURED` and posts nothing. The browser console logs one
  warning, the first time a trade reports, that the runtime is not installed.
  This is expected.
- **Last Man Standing rail.** It loses its broadcast card. A live round shows
  action and invite; a finished round shows claim (when something is owed)
  and invite.

```
Before                                        After
──────                                        ─────
sidebar, tab bar, dashboard, portfolio ─► /square        (no way in)
activity, buy sheet ─share─► Market Square               (no share button)
chess, checkers, arkball, last man ─go live─► Square     (no broadcast panel)
confirmed trade ─reportShine─► Shine ─post─► Square      reportShine ─► not configured, no post
```

## Consequences

- No user of this deployment sees Market Square or can post to it.
- Restoring the square means uncommenting every `Market Square hidden` block,
  the two variables in `.env.example`, and the tests marked the same way. The
  Kash button is the `Kash Buy hidden` blocks.
- Commented code does not typecheck or get tested while it is commented out,
  so it can fall behind the code around it. Restoring it after a long time may
  take more than uncommenting.
- Tests that asserted these surfaces render now assert they are absent. Tests
  that only exercised a hidden surface are commented out with the same marker.
- This fork diverges further from the organisation repository in the roughly 30 files
  touched.

## Alternatives considered

- **Set `NEXT_PUBLIC_MARKET_SQUARE_URL` to an empty string.** This hides the
  sidebar row, the dashboard cards and the portfolio banner without touching
  code, but not the tab bar seat, the share buttons, the broadcast panels or
  Shine, none of which read it. Rejected because it leaves most of the square
  visible.
- **Delete the code.** Cleaner, but the lead asked for it to be commented out
  so it can come back.
- **A new code constant guarding each site.** Keeps everything type-checked,
  but it is not what was asked for, and it would spread a new switch across
  ten features.
