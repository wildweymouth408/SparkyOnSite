# Discord Task Bot Setup

## What’s Been Built
Two GitHub Actions workflows that post to Discord:

1. **Notify Discord on Task Changes** – triggers automatically when `tasks.md` is modified (push to `main`).
2. **Post Task Summary to Discord** – can be triggered manually (GitHub Actions UI) or scheduled daily at 8 am UTC.

Both workflows send messages to a Discord channel via a webhook.

## Setup Steps

### 1. Create a Discord Webhook
- Go to your Discord server → **Server Settings** → **Integrations** → **Webhooks** → **New Webhook**.
- Choose a channel (e.g., `#sparky‑tasks`).
- Copy the **Webhook URL** (looks like `https://discord.com/api/webhooks/...`).

### 2. Add the Webhook URL as a GitHub Secret
- Go to your GitHub repository: `wildweymouth408/v0‑electrician‑calculator‑redesign`.
- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
- Name: `DISCORD_WEBHOOK_URL`
- Value: paste the webhook URL.
- Click **Add secret**.

### 3. Test the Bot
- Edit `tasks.md` (add a dummy line, commit, push).
- Within a minute, a Discord message should appear in the chosen channel.
- To post a manual summary:
  - Go to **Actions** tab in GitHub.
  - Select **Post Task Summary to Discord**.
  - Click **Run workflow**.

## How It Works
- The **change‑detection** workflow uses `git diff` to show what lines changed in `tasks.md`.
- The **summary** workflow extracts task counts and lists recent completed/current/pending tasks (simple grep‑based parsing).
- Both use the same webhook secret.

## Customization
- Edit `.github/workflows/tasks‑discord.yml` to change the message format.
- Edit `.github/workflows/tasks‑summary.yml` to adjust the cron schedule (default daily 8 am UTC).

## Notes
- The bot only posts when `tasks.md` actually changes (no polling).
- The summary workflow can be triggered manually anytime via GitHub Actions UI.
- If you want slash commands (`/tasks`), a persistent bot would be needed (not yet implemented).