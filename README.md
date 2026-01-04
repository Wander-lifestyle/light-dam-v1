# Light DAM V1 - Editorial OS

AI-first digital asset management powered by Claude + MCP.

## Deploy to Vercel (Step by Step)

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `light-dam-v1`
4. Keep it **Public** (or Private if you prefer)
5. Click **Create repository**

### Step 2: Upload Files to GitHub

**Option A: Upload via Browser (Easiest)**

1. On your new repo page, click **"uploading an existing file"**
2. Drag ALL files from this folder into the upload area:
   - `package.json`
   - `next.config.js`
   - `app/` folder (with all files inside)
3. Click **Commit changes**

**Option B: Use GitHub Desktop**

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your repo
3. Copy these files into the cloned folder
4. Commit and push

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **Project**
3. Find `light-dam-v1` in the list → Click **Import**
4. Keep all defaults → Click **Deploy**
5. Wait ~1-2 minutes
6. 🎉 **Your site is live!** You'll get a URL like: `light-dam-v1.vercel.app`

---

## How to Update

1. Edit files on GitHub (click any file → pencil icon)
2. Save/commit
3. Vercel auto-deploys in ~30 seconds

---

## How to Use

1. Open your deployed site
2. Enter search query (e.g., "travel woman")
3. Click **Search** to filter demo results
4. For **LIVE** search with your Google Sheet:
   - Click **"Copy Prompt to Clipboard"**
   - Paste into Claude.ai (with Google Drive MCP enabled)
   - Claude reads your actual sheet and returns real results

---

## Your Google Sheet

URL: https://docs.google.com/spreadsheets/d/1WjWMFSvHtUy3ghtHLyPggU52WApU1Xc3_JMU-Z0AgJU

Add more images by adding rows with:
- asset_id, filename, drive_url, preview_url, tags, mood, subjects, campaign, usage

---

## Next Steps (V2)

- [ ] Connect Claude API for fully automated search
- [ ] Add Cloudinary for image thumbnails
- [ ] Client-specific deployments
