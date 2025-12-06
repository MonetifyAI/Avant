# Whop Webhook Setup Guide

Complete these steps to enable automatic credit delivery after Whop purchases.

## Step 1: Run Database Migrations

In Supabase SQL Editor, run these files in order:
1. `supabase/credits_schema.sql` - Creates credits system
2. `supabase/webhook_logs_schema.sql` - Creates webhook logging

## Step 2: Deploy Edge Function

**Option A: Via Supabase CLI**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy whop-webhook --no-verify-jwt
```

**Option B: Via Supabase Dashboard**
1. Go to Supabase Dashboard → Edge Functions
2. Create new function named `whop-webhook`
3. Copy contents of `supabase/functions/whop-webhook/index.ts`
4. Deploy

## Step 3: Add Environment Variables

In Supabase Dashboard → Edge Functions → whop-webhook → Settings:

```
WHOP_API_KEY=apik_ix7HJezSKiT1i_C3897582_C_479b155f52e2059413f842276ebd8dab4ae975d98b64bc810cca92bfd9e810
```

Note: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are automatically available.

## Step 4: Get Your Webhook URL

Your webhook URL will be:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/whop-webhook
```

## Step 5: Configure Whop Webhook

1. Go to [Whop Dashboard](https://dash.whop.com) → Settings → Webhooks
2. Click "Add Webhook"
3. Enter your webhook URL from Step 4
4. Select these events:
   - `membership.went_valid`
   - `payment.succeeded`
5. Save

## Testing

1. Make a test purchase on your Whop store
2. Check Supabase → Table Editor → `webhook_logs` for the event
3. Verify credits were added to the user's profile

## Troubleshooting

- **User not found**: Make sure the email used for Whop purchase matches the email in your app
- **Check logs**: Supabase Dashboard → Edge Functions → whop-webhook → Logs
- **Check webhook_logs table**: Shows success/failure status for each webhook
