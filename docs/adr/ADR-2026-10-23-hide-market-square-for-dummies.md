# ADR for Dummies: Hiding Market Square

## What was the problem?

Market Square is the social part of the platform, a separate site where people
post, chat and watch live games. The app pointed people to it from many
places: a menu entry, a tab on phones, cards on the dashboard, a banner on the
portfolio, "Share to Market Square" buttons, "Broadcast to Market Square"
panels in the games, and a setting called Shine that posted your trades there
automatically.

The team lead asked for all of that to be hidden in this version of the app,
and for the Buy button on the Kash card in the portfolio to be hidden too.

## What did we decide?

Switch every one of those places off by commenting the code out. Commented
code is still in the files, but the app ignores it. Nothing was deleted, so
everything can be brought back by removing the comments. Each hidden piece is
labelled "Market Square hidden" (or "Kash Buy hidden") so it is easy to find.

Shine no longer posts anything, because the part of the app that does the
posting is not switched on.

## What does not change?

- Your profile picture still shows. It comes from Market Square, but it is
  just a picture.
- The yellow Kash banner still opens the Kash Buy screen.
- The Terms and Privacy pages are unchanged.
- Trading, games and everything else work as before.

## What looks different?

- No Square in the menu or the phone's bottom bar. The bottom bar has four
  icons instead of five, so there is a gap on the right.
- The dashboard's "Join the Conversation" row shows only the chess room.
- The portfolio has no Market Square banner.
- The Kash card shows Send and Convert, with no Buy.
- No share or broadcast buttons, and no Shine setting.

## What do we give up?

Commented-out code is not checked while it is switched off, so if it stays off
for a long time, bringing it back may need some repair work.
