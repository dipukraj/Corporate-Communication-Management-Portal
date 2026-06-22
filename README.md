# Corporate Communication Management Portal (CMS)

A full-stack MERN application for managing corporate communication materials like e-magazines, posters, banners, certificates, and notices across departments.

## Tech Stack

- **Frontend:** React.js, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT + bcrypt
- **File Storage:** Cloudinary
- **Email:** Nodemailer

## Features

- Role-based access (Admin, Editor, Department User)
- Admin Dashboard with stats & recent uploads
- User & Department Management
- Content Upload with categories
- Magazine Management (PDF)
- Media Gallery with preview, download, delete
- Search & Filter (department, category, date/year)
- Dark/Light mode toggle
- Activity Logs
- Email notifications on upload

## Live Deploy + One-Command Dev

**Deploy guide (GitHub + Netlify + Render):** see [`DEPLOY.md`](./DEPLOY.md)

Local development — ek hi command se dono servers:

```powershell
npm run install:all   # pehli baar
npm run dev           # frontend + backend
```

## Project Structure

```
MERN/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── seed/            # Seed data script
│   ├── utils/           # Token & email helpers
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Sidebar, Card, etc.
│       ├── context/     # Auth & Theme context
│       ├── pages/       # All page components
│       └── services/    # API services
└── README.md
```

## Deployment (Live Website — Laptop band, sab chalega)

**Poori step-by-step guide:** [`DEPLOY.md`](./DEPLOY.md)

```
GitHub → Render (Backend) + Netlify (Frontend) → Live URL
```

Koi bhi link open kare → Login page → saare features.

### Local dev — ek hi command

```bash
npm run install:all   # pehli baar
npm run dev           # frontend + backend dono start
```

### Prerequisites

- Node.js (v18+)
- **MongoDB** (local install OR free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- Cloudinary account (optional — for file uploads)

### MongoDB Setup (Important!)

**Option A — MongoDB Atlas (Recommended, no local install):**
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster → Get connection string
3. Paste in `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cms_portal
   ```

**Option B — Local MongoDB:**
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default URI works: `mongodb://127.0.0.1:27017/cms_portal`

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB, JWT, Cloudinary & Email credentials
npm run seed    # Seed demo data
npm run dev     # Start backend on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev     # Start frontend on port 5173
```

### 3. Open Application

Visit: http://localhost:5173

## Demo Login Credentials

| Role            | Email             | Password   |
|-----------------|-------------------|------------|
| Admin           | admin@cms.com     | admin123   |
| Editor          | editor@cms.com    | editor123  |
| HR Department   | hr@cms.com        | hr1234     |
| PR Department   | pr@cms.com        | pr1234     |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user (Admin only)
- `GET /api/auth/me` - Get current user

### Users (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Departments (Admin)
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Content
- `GET /api/content` - Get content (with search/filter)
- `POST /api/content/upload` - Upload content
- `DELETE /api/content/:id` - Delete content

### Magazine
- `GET /api/magazine` - Get magazines
- `POST /api/magazine` - Create magazine (Admin/Editor)
- `DELETE /api/magazine/:id` - Delete magazine

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activity-logs` - Activity logs (Admin)

## Interview Explanation

> "During my internship at NTPC, I worked on corporate communication materials like e-magazines, posters, banners, and certificates. I observed that managing these digital assets across departments can be improved. So I developed a MERN-based Corporate Communication Management Portal where departments can upload, manage, and organize communication materials through a centralized system with role-based access, Cloudinary file storage, and activity tracking."

## License

MIT
