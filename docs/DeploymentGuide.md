# Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks through deploying the **Goodwill Motive** monorepo to production using:
- **MongoDB Atlas** (Cloud Database)
- **Render** (NestJS Backend API)
- **Vercel** (Next.js Frontend Web)

---

## 1. Database Setup (MongoDB Atlas)

Because Render does not host managed MongoDB, create a free cloud database cluster:

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Cluster** (Shared).
3. Under **Database Access**, create a user with read/write privileges (e.g. `goodwill_admin`).
4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/goodwillmotive?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database credentials)*.

---

## 2. Backend Deployment (Render)

### Option A: Using the Render Blueprint (`render.yaml`)
1. Push your repository to **GitHub** / **GitLab**.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **Blueprints** → **New Blueprint Instance**.
3. Connect your repository. Render will automatically read `render.yaml`.
4. Fill in the required environment variables (`DATABASE_URL`, etc.) and click **Apply**.

---

### Option B: Manual Web Service Setup on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) → Click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `goodwill-backend`
   - **Language / Runtime**: `Node`
   - **Branch**: `main` (or your active branch)
   - **Root Directory**: *(Leave blank / `.`)*
   - **Build Command**:
     ```bash
     npm install && npm --workspace=@goodwill/shared run build && npm --workspace=backend run build
     ```
   - **Start Command**:
     ```bash
     npm --workspace=backend run start:prod
     ```
   - **Plan**: Free (or Starter)

4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `DATABASE_URL` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | *(Random 32+ char string)* | Secure secret key for signing tokens |
   | `FRONTEND_URL` | `https://<your-app>.vercel.app` | Vercel production frontend URL |
   | `PORT` | `10000` | Port assigned by Render |
   | `GOOGLE_CLIENT_ID` | *(Optional)* | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | *(Optional)* | Google OAuth client secret |
   | `GOOGLE_REDIRECT_URI` | `https://<your-render-url>.onrender.com/api/auth/google/callback` | OAuth redirect URL |

5. Click **Create Web Service**.
6. When deployment finishes, test your backend URL:
   ```
   https://<your-render-app>.onrender.com/api
   ```
   *(Should return `{ status: "ok", message: "Goodwill Motive API is running" }`)*.

---

## 3. Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository.
3. Configure the Project Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select **`frontend-web`**.
   - **Build Command**: *(Default `next build` or automatically detected)*
   - **Output Directory**: *(Default `.next`)*
   - **Install Command**: *(Default `npm install`)*

4. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://<your-render-app>.onrender.com/api` |

5. Click **Deploy**.

---

## 4. Final Handshake

1. In the **Render Dashboard**, update `FRONTEND_URL` to match your exact Vercel domain (e.g. `https://goodwill-motive.vercel.app`).
2. If using Google OAuth, update the Authorized Redirect URIs in your Google Cloud Console:
   - `https://<your-render-app>.onrender.com/api/auth/google/callback`
3. Open your Vercel deployment URL and verify full functionality:
   - Landing page loads
   - Sign up a new user account
   - Take a quiz or complete a mission
   - Check the live impact dashboard
