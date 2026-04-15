# ServiceNow PDI Keepalive

A lightweight GitHub Actions workflow that automatically logs into your 
ServiceNow Developer Portal every 8 hours to keep your Personal Developer 
Instance (PDI) from going to sleep.

## How it works

GitHub Actions runs a scheduled Node.js script using Playwright to log into
developer.servicenow.com with your credentials. This registers activity on 
your developer account and prevents your PDI from hibernating.

## Setup

### Step 1: Create your own copy

Click **"Use this template"** at the top of this page and select 
**"Create a new repository"**. Give it any name you like and set it to 
**Private**.

### Step 2: Add your credentials as secrets

Your ServiceNow Developer Portal credentials need to be stored as encrypted 
GitHub Secrets. They will never appear in any log or file.

1. In your new repository, go to **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"** and add the following two secrets:

| Secret Name | Value |
|---|---|
| `SN_PDI_USERNAME` | Your ServiceNow Developer Portal email address |
| `SN_PDI_PASSWORD` | Your ServiceNow Developer Portal password |

### Step 3: Test it

1. Go to the **Actions** tab in your repository
2. Click **PDI Keepalive** in the left sidebar
3. Click **"Run workflow"** to trigger a manual run
4. Watch the logs to confirm it completes successfully

### Step 4: Let it run

Once the manual test passes, the workflow will run automatically every 8 hours.
No further action needed.

## Adjusting the schedule

To change how often it runs, edit `.github/workflows/keepalive.yml` and 
modify the cron line:

```yaml
- cron: '0 */8 * * *'   # Every 8 hours
- cron: '0 */4 * * *'   # Every 4 hours
- cron: '0 */12 * * *'  # Every 12 hours
```

## Email notifications

To receive an email if a scheduled run ever fails:

1. Go to your GitHub account **Settings → Notifications**
2. Under **Actions**, set it to **"Send notifications for failed workflows only"**

## Multiple PDIs

If you have more than one PDI under separate developer accounts, see the
`multi-account` branch of this repository for a version that supports
multiple logins in a single workflow run.
