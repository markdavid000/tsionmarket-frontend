# ADR for Dummies: Removing the tracking tools

## What was the problem?

We want to put this app on Vercel's free plan so people can try it. Vercel
refused, because the app asked it to run a scheduled job every hour. That job
checked whether our servers were up and told an error tracking tool called
Watchtower. Scheduled jobs that often need a paid plan.

The app also had two other tools watching how people use it:

- **Mixpanel** counted things people did, like "made a deposit" or "opened a
  game".
- **Microsoft Clarity** recorded anonymised videos of people's screens so the
  team could see where they got stuck.

## What did we decide?

Take all three tools out completely: the hourly job, the code, the installed
packages, the settings and the old documents about them. The privacy policy
no longer mentions them, because the app no longer does any of that.

## What does not change?

Everything a user sees and does works exactly as before. One feature looked
like tracking but is not: when a deposit arrives, the app refreshes your
balance automatically. That stays.

## What do we give up?

- Nobody gets an automatic alert if the servers go down or the app crashes
  for someone.
- We can no longer see usage numbers or screen recordings.
- Our copy of the code is now quite different from the organisation's copy,
  so bringing in their future updates will take more care.

## What do we gain?

- The app can be hosted on Vercel's free plan.
- Pages load slightly less code.
- Users are not tracked or recorded.
