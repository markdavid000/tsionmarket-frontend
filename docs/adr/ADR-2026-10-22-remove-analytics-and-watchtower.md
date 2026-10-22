# ADR: Remove Mixpanel, Microsoft Clarity and Watchtower

- **Status:** Accepted 2026-10-22 by the maintainer of this fork
- **Date:** 2026-10-22
- **Scope:** Frontend only. Analytics, session replay, error reporting, the
  Vercel cron, their packages, environment variables, tests and docs. No
  backend change. No change to what a user sees or can do.

## Context

This fork is deployed on a Vercel Hobby account so the app can be tested
outside the organisation. The deploy was refused because of the cron in
`vercel.json`: an hourly call to `/api/heartbeat`, which existed only so
Watchtower (a self-hosted, Sentry-protocol error tracker) could alert when the
gateway stopped answering. Hobby only allows cron jobs that run at most once a
day.

The frontend lead asked for the three third-party telemetry integrations to be
removed rather than switched off:

| Integration | What it was                                  | Where it lived                                                                                                                                                                            |
| ----------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mixpanel    | Product analytics: named events and profiles | `lib/analytics/*`, about 120 `track(...)` call sites across `features/` and `components/`, the `/api/relay` proxy and its `proxy.ts` exemption, `components/providers/analytics-*`        |
| Clarity     | Session replay and heatmaps                  | `lib/analytics/clarity.ts`, the `data-clarity-mask` spreads on the KYC and bank screens                                                                                                   |
| Watchtower  | Error, performance and uptime reporting      | `@sentry/nextjs` in `instrumentation.ts`, `instrumentation-client.ts`, `next.config.ts`, `app/error.tsx`, `app/global-error.tsx`, `lib/api.ts`, `/api/monitoring`, `/api/heartbeat`, cron |

All three were already inert when their environment variables were unset, so
the cron was the only hard blocker. Removing the code as well means no dormant
SDKs ship in the bundle and the privacy policy can say plainly that nothing is
recorded.

## Decision

Remove all three integrations completely:

1. Delete the cron from `vercel.json` and the `/api/heartbeat`,
   `/api/monitoring` and `/api/relay` route handlers.
2. Delete `instrumentation.ts` and `instrumentation-client.ts` (they held
   nothing else) and unwrap `withSentryConfig` from `next.config.ts`.
3. Remove every `track`, profile and identity call, the event catalogue and
   schema, and every helper whose only purpose was building an event payload
   (failure reason vocabularies, trade amount and game payout figures, insert
   ids, the bank ramp watch stores, the deposit and settlement analytics
   hooks).
4. Remove `mixpanel-browser`, `@microsoft/clarity` and `@sentry/nextjs` from
   `package.json` and the lockfile, and their variables from `.env.example`.
5. Rewrite the privacy policy so it no longer describes analytics or session
   recording, and lock that with a test.
6. Delete the ADRs, plans and release notes that described these
   integrations. Dated mentions inside other features' historical records are
   left as written.

### What stays, and why

Two modules lived under `lib/analytics/` but are product logic:

- `deposit-watch.ts` decides which inbound transfers are genuine deposits.
- `self-initiated.ts` remembers the transactions the app sent itself.

Together they drive `useDepositBalanceRefresh`, which re-reads the cache-first
balance when a deposit lands. They move to `lib/deposits/`, and the component
that mounted the refresh (formerly `DepositAnalytics`) becomes
`DepositBalanceWatch` with its tracking removed. The localStorage key
`wsws.analytics.self-initiated.v1` is kept unchanged so existing devices keep
their history.

Product types that happened to be declared in the event catalogue (`Game`,
`ChessMode`, `ChessEndReason`, `EarnListingType` and similar) move into the
feature that uses them.

The chess voice feature's own "clarity" display setting is unrelated and is
untouched.

```
Before                                   After
──────                                   ─────
browser ─track()─► /api/relay ─► Mixpanel
browser ─replay──► clarity.ms
browser ─errors──► /api/monitoring ─► Watchtower
server  ─errors──► Watchtower
Vercel cron ─hourly─► /api/heartbeat ─► gateway /health + Watchtower

activity feed ─► deposit-watch ─► balance refresh   activity feed ─► deposit-watch ─► balance refresh
```

## Consequences

- The fork deploys on Vercel Hobby. No cron is configured.
- Nobody is alerted when the gateway goes down or when a user hits a crash.
  Errors are still handled in the UI exactly as before; they are just not
  sent anywhere. Vercel's own runtime logs remain available.
- No product analytics or session replay. Funnels, retention and heatmaps are
  gone for any deployment of this fork.
- The bundle is smaller on every route.
- This fork diverges from the organisation repository across roughly 150
  files. Pulling upstream changes will conflict wherever a tracked flow was
  edited upstream, and any new `track(...)` call that arrives upstream has to
  be removed again on merge.

## Alternatives considered

- **Remove only the cron.** The smallest change that unblocks the deploy, and
  it keeps the fork close to upstream. Rejected because the lead asked for the
  integrations to be removed, not disabled.
- **Run the heartbeat daily.** Allowed on Hobby, but a daily uptime check is
  not useful, and it keeps Watchtower in the tree.
- **Upgrade to Vercel Pro.** Not available to the maintainer.
