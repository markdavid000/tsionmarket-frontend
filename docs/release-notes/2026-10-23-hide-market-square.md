---
date: 2026-10-23
feature: Market Square is hidden everywhere in the app, and the Kash card has no Buy button
scope: chore
scenario-impact: none
---

# Hide Market Square and the Kash card's Buy button

Decision: `docs/adr/ADR-2026-10-23-hide-market-square.md`.

Everything below is commented out, not deleted. Search for
`Market Square hidden` and `Kash Buy hidden` to find each block.

- **No way in.** The sidebar's Square row, the phone tab bar's Square seat, the
  square cards in "Join the Conversation" and the portfolio's Market Square
  banner are hidden. The conversation row keeps its chess room card and its
  heading now links to `/casino/chess`.
- **No posting.** The "Share to Market Square" buttons in activity and after a
  buy, the "Broadcast to Market Square" panels in chess, checkers, Arkball and
  Last Man Standing, and the Go Live control are hidden.
- **No Shine.** The Shine settings and their menu rows are hidden, and the
  Shine runtime is no longer mounted, so nothing posts to the square
  automatically.
- **Kash card.** The Buy button is hidden on desktop and mobile. The Kash
  promo banner still opens Buy.
- **Environment.** `NEXT_PUBLIC_MARKET_SQUARE_URL` and
  `NEXT_PUBLIC_MARKET_SQUARE_LIVE` are commented out in `.env.example`. If
  `NEXT_PUBLIC_MARKET_SQUARE_LIVE` is set in the Vercel project, it can stay:
  the surfaces it controlled are commented out.
- **Unchanged.** Square profile pictures, the Terms and Privacy text, the
  `/square` rewrite, the square slice and its proxies.

No scenario under `docs/scenarios/` covers these flows, so none is affected.
