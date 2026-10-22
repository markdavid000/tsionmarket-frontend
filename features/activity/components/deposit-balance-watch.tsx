"use client";
import { useAuthSession } from "@/hooks/use-auth-session";

import { BELL_POLL_MS, useActivity } from "@/features/activity/hooks/use-activity";
import { useDepositBalanceRefresh } from "@/features/activity/hooks/use-deposit-balance-refresh";

// Watches settled deposits and refreshes the balance, rendering nothing.
//
// A deposit lands while the app is closed, so the only evidence the client ever
// sees is a new inbound transfer in activity. The portfolio balance is
// cache-first and would otherwise miss that arrival until the next transaction,
// so this re-reads it once when one lands. It is mounted on its own because
// history has its own page and the dashboard no longer lists recent activity.
export function DepositBalanceWatch() {
  const { evmAddress } = useAuthSession();
  // Same query key as the notification bell. React Query drives a shared key
  // at its shortest observer interval, so asking at the default 60s here
  // silently cancelled the bell's five minute throttle for every dashboard.
  // This only needs to NOTICE an arrival, not watch for one.
  const { items } = useActivity({ pollMs: BELL_POLL_MS });
  const wallet = evmAddress ?? "";
  useDepositBalanceRefresh(items, wallet);
  return null;
}
