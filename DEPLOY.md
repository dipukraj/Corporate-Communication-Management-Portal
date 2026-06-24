# CMS Portal — Deploy Guide (GitHub + Netlify + Render)

Is guide ke baad **laptop band** karoge tab bhi website chalegi. Koi bhi link open karega → Login page → saare features.

---

## Final Architecture

```
User Browser
     ↓
Frontend (Netlify)     →  https://your-app.netlify.app
     ↓
Backend API (Render)   →  https://your-api.onrender.com
     ↓
MongoDB Atlas          →  Database (already setup ✅)
     ↓
Cloudinary             →  File storage (already setup ✅)
```

---

## Part A — Local Development (Ek hi command)

Ab dono server ek saath start honge:

```powershell
cd c:\Users\dipuk\OneDrive\Desktop\MERN
npm run install:all
npm run dev
```

Bas **ek command** `npm run dev` — frontend + backend dono chal jayenge.

Browser: http://localhost:5173

---

## Part B — GitHub par code upload

### Step 1: GitHub par naya repository banao

1. [github.com](https://github.com) → Login
2. **+ New repository**
3. Name: `corporate-cms-portal` (ya jo chaho)
4. **Public** select karo
5. **Create repository** (README mat add karo)

### Step 2: Code push karo

PowerShell mein:

```powershell
cd c:\Users\dipuk\OneDrive\Desktop\MERN
git init
git add .
git commit -m "Corporate CMS Portal - MERN Stack with deployment config"
git branch -M main
git remote add origin https://github.com/TUMHARA-USERNAME/corporate-cms-portal.git
git push -u origin main
```

> **Note:** `.env` file automatically ignore hogi — secrets GitHub par nahi jayenge ✅

---

## Part C — Backend deploy (Render — FREE)

Netlify sirf frontend host karta hai. Backend ke liye **Render** use karenge (free).

### Step 1: Render account

1. [render.com](https://render.com) → **Get Started for Free**
2. **Sign up with GitHub**

### Step 2: New Web Service

1. Dashboard → **New +** → **Web Service**
2. GitHub repo connect karo → `corporate-cms-portal` select karo
3. Settings:

| Field | Value |
|-------|-------|
| **Name** | `cms-portal-api` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### Step 3: Environment Variables (Render mein add karo)

**Environment** tab mein ye sab add karo (apni values se):

| Key | Value |
|-----|-------|
| `MONGODB_URI` | (backend/.env se copy karo) |
| `JWT_SECRET` | koi bhi strong random string |
| `JWT_EXPIRE` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | `dchkutp40` |
| `CLOUDINARY_API_KEY` | (tumhari key) |
| `CLOUDINARY_API_SECRET` | (tumhari secret) |
| `CLIENT_URL` | baad mein Netlify URL daaloge |

4. **Create Web Service** dabao
5. 5-10 minute wait — deploy complete hone do

### Step 4: Backend URL copy karo

Deploy hone ke baad URL milega jaise:

```
https://cms-portal-api.onrender.com
```

Browser mein kholo — ye dikhe:
```json
{"message":"CMS Portal API is running","mongo":"connected"}
```

---

## Part D — Frontend deploy (Netlify — FREE)

### Step 1: Netlify account

1. [netlify.com](https://netlify.com) → **Sign up with GitHub**

### Step 2: New site from Git

1. **Add new site** → **Import an existing project**
2. **GitHub** → repo select karo
3. Build settings (auto-detect hoga `netlify.toml` se):

| Field | Value |
|-------|-------|
| **Base directory** | (khali chhod do — netlify.toml handle karega) |
| **Build command** | auto |
| **Publish directory** | auto |

### Step 3: Environment Variable (important!)

**Site configuration → Environment variables** mein add karo:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cms-portal-api.onrender.com/api` |

(apni Render backend URL use karo)

### Step 4: Deploy

**Deploy site** dabao. 2-3 minute mein URL milega:

```
https://random-name.netlify.app
```

### Step 5: Render mein CLIENT_URL update karo

Render dashboard → Environment → `CLIENT_URL` update karo:

```
https://random-name.netlify.app
```

Save → Render auto redeploy karega.

---

## Part E — Seed data (sirf ek baar production mein)

Agar production par login nahi ho raha (users nahi hain), local se seed chalao — same Atlas DB use hogi:

```powershell
cd c:\Users\dipuk\OneDrive\Desktop\MERN\backend
npm run seed
```

Demo logins:
- Admin: `dipuraj@ccms.com` / `dipuraj@123`
- HR: `hr@cms.com` / `hr1234`

---

## Final Result

Koi bhi ye link open kare:

```
https://your-app.netlify.app
```

→ **Login page**  
→ Email/password se login  
→ Dashboard, Upload, Gallery, Magazine — sab kaam karega  
→ **Tumhara laptop band** ho sakta hai!

---

## Auto Update (Git push = website update)

Code change karo → push karo:

```powershell
git add .
git commit -m "Update feature"
git push
```

Netlify + Render **automatically** naya version deploy kar denge.

---

## Important Notes

| Topic | Detail |
|-------|--------|
| Render Free tier | 15 min inactive ke baad sleep — pehli request 30-50 sec le sakti hai |
| Secrets | Kabhi `.env` GitHub par mat daalo |
| Custom domain | Netlify mein apna domain add kar sakte ho |
| VS Code | Sirf code edit ke liye — server chalane ki zaroorat nahi deploy ke baad |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login fail on live site | `VITE_API_URL` Netlify mein sahi hai? |
| CORS error | Render mein `CLIENT_URL` = Netlify URL |
| Backend slow | Render free tier sleep — wait 30 sec |
| Upload fail | Cloudinary keys Render env mein check karo |

---

## Quick Checklist

```
⬜ GitHub par code push
⬜ Render par backend deploy + env variables
⬜ Netlify par frontend deploy + VITE_API_URL
⬜ Render mein CLIENT_URL = Netlify URL
⬜ npm run seed (demo users)
⬜ Live site par login test
```

**Congratulations! 🎉** Ab tumhara CMS Portal duniya ke liye live hai.
