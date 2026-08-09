# Supabase Setup Guide — Goodwill Motive

## Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (fastest) or email
4. Verify your email if needed

## Step 2: Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `goodwill-motive` (or `goodwill-motive-dev`)
   - **Database Password:** Generate a strong random password — **SAVE IT SOMEWHERE SAFE**
   - **Region:** Choose the closest region to you
3. Click **"Create new project"**
4. Wait ~2 minutes for setup

## Step 3: Get Connection String

1. In your project dashboard, click **"Connect"** at the top
2. Select **"Connection string"** tab
3. Choose **"URI"** format
4. Copy the **Direct connection** string — it looks like:

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklm.supabase.co:5432/postgres
```

5. **Replace `[YOUR-PASSWORD]`** with the password you saved in Step 2

## Step 4: Update Backend .env

Open `backend/.env` and replace the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklm.supabase.co:5432/postgres"
```

## Step 5: Run Migrations

```bash
cd backend
npm run prisma:migrate
```

This will create all the database tables.

## Step 6: Seed Data

```bash
cd backend
npm run prisma:seed
```

This populates initial categories, badges, and missions.

## Step 7: Update .env.local (Frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If you deploy the backend later, update this to your production URL.

---

## Connection String Format

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Find your project reference in Supabase Dashboard → Settings → General → Reference ID

## Troubleshooting

### "Connection refused"
- Wait 2-5 minutes after creating project for initial setup
- Check firewall/network settings
- Ensure IP is allowed (Supabase allows all by default on free tier)

### "Password authentication failed"
- Double-check the password matches exactly
- In Supabase Dashboard → Settings → Database → Reset password if needed

### "Database does not exist"
- Use `postgres` as the database name (default) in the connection string
- Or check your connection string has `/postgres` at the end

## Free Tier Limits

- **500MB** database storage
- **2GB** transfer/month
- **60 connected users** max
- Sufficient for MVP development and early testing

## API URL

Once you have a Supabase project, you'll also get:
- **Project URL:** `https://[REF].supabase.co`
- **Anon/Public Key:** For frontend (can add later)

You can ignore these for now — we're using our own NestJS backend, not Supabase's built-in APIs.