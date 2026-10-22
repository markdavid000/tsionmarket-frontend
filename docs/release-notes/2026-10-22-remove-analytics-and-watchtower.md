---
date: 2026-10-22
feature: Mixpanel, Microsoft Clarity and Watchtower are removed, and no cron job is configured
scope: chore
scenario-impact: none
---

# Remove analytics, session replay and error reporting

Decision: `docs/adr/ADR-2026-10-22-remove-analytics-and-watchtower.md`.

- **No cron.** The hourly `/api/heartbeat` cron is gone from `vercel.json`, so
  the app deploys on Vercel Hobby.
- **No Watchtower.** `@sentry/nextjs`, `instrumentation.ts`,
  `instrumentation-client.ts`, the source map upload in `next.config.ts`, the
  `/api/monitoring` tunnel and upstream failure reporting in `lib/api.ts` are
  removed. The error screens are unchanged; they no longer report.
- **No Mixpanel.** Every event, profile and identity call, the event catalogue
  and its helpers, the `/api/relay` proxy and its `proxy.ts` exemption are
  removed.
- **No Clarity.** The SDK and the masking attributes on the KYC and bank
  screens are removed.
- **Kept.** The deposit balance refresh now mounts as `DepositBalanceWatch`,
  and its two helpers move from `lib/analytics/` to `lib/deposits/`.
- **Privacy policy.** The analytics section and the vendor entries are
  removed and the date is updated to 22 October 2026.
- **Environment.** `NEXT_PUBLIC_MIXPANEL_TOKEN`,
  `NEXT_PUBLIC_CLARITY_PROJECT_ID`, `NEXT_PUBLIC_WATCHTOWER_DSN`,
  `WATCHTOWER_ORG`, `WATCHTOWER_PROJECT` and `WATCHTOWER_AUTH_TOKEN` are no
  longer read. `CRON_SECRET` is no longer read. Remove them from the Vercel
  project settings.

No user-facing flow changes, so no scenario is affected.
