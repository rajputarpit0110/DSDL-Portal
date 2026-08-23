# DSDL Technical Club Portal

The official management portal for the Data Science & Deep Learning (DSDL) Club at KIET Group of Institutions.

---

## 🛠 Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast, modern UI development.
- **React Router (v6)**: Client-side routing with nested layouts and role-based protection.
- **Lucide React**: Beautiful, consistent iconography.
- **CSS Modules & Global Styles**: Custom theming without heavy UI libraries.

### Backend (Node.js & Express)
- **Express.js**: Robust API routing and middleware management.
- **MongoDB Atlas & Mongoose**: Fully managed NoSQL cloud database for scalable data storage.
- **JSON Web Tokens (JWT)**: Secure cookie-based authentication.
- **Bcrypt.js**: Secure password hashing.

---

## 🚀 Project Status

The DSDL Portal architecture is complete and highly structured. We recently executed a full migration from SQLite to **MongoDB Atlas**, meaning our application is now production-ready and fully operational.

### ✅ Completed Features
1. **Core Architecture**: Enterprise-grade Layered Backend Architecture (Routes → Controllers → Services → Repositories → Models).
2. **MongoDB Atlas Integration**: Complete transition to NoSQL document schemas, maintaining strict relationships via References.
3. **Master Admin Dashboard**: Fully wired UI featuring:
   - Live analytical metrics fetching.
   - Activity Audit Logs.
   - **Notification Engine**: Programmatic notification generation when events or announcements are created.
   - Dynamic Modals for Member and Event creation.
   - Export Reports.
4. **Member & Lead Dashboards**: Secure, role-isolated portals for standard members and domain leads to manage their tasks.
5. **Entity Management API & UI**: Full CRUD flows for Domains, Events, Projects, Announcements, and Teams.

---

## 🏗 How the Code Works (Layered Architecture)

To maintain a scalable and clean codebase, the backend adheres to a strict **Layered Architecture**. If you are building a new feature, you must follow this flow:

1. **Route (`routes/`)**: Catches the HTTP request (e.g., `POST /api/events`) and validates authentication/roles via middleware. Passes to the Controller.
2. **Controller (`controllers/`)**: Extracts payload data (`req.body`, `req.params`) and sends the final JSON response. **Never write database queries or business logic here.**
3. **Service (`services/`)**: The "Brain". Handles all business rules (e.g., "Is registration still open?", "Trigger a notification to users"). Calls the Repository.
4. **Repository (`repositories/`)**: Data access layer. This is the **only** place where we interact with Mongoose/MongoDB.
5. **Model (`models/`)**: Mongoose schemas defining the structure of our NoSQL documents.

---

## 📂 Project Structure

```text
DSDL-Portal/
├── backend/
│   ├── src/
│   │   ├── controllers/ # Step 2: Extracts HTTP data
│   │   ├── database/    # MongoDB connection setup
│   │   ├── middleware/  # Security checks (Auth, Roles, Error Handlers)
│   │   ├── models/      # Step 5: Mongoose Schemas (User, Event, Domain, etc.)
│   │   ├── repositories/# Step 4: MongoDB Queries
│   │   ├── routes/      # Step 1: API Endpoints definition
│   │   ├── seeds/       # Scripts to populate dummy data
│   │   ├── services/    # Step 3: Business Logic & Rules
│   │   ├── utils/       # Helpers (ApiResponse, Error handling, JWT setup)
│   │   └── server.js    # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Feature-specific components (Modals, NotificationBell)
    │   ├── common/      # Reusable UI elements (Buttons, Cards, Badges)
    │   ├── context/     # Global State (AuthContext)
    │   ├── layout/      # Navbars, Sidebars, and Wrappers
    │   ├── pages/       # Screen views (Admin, Auth, Member, Public)
    │   ├── routes/      # AppRoutes.js defining React Router logic
    │   └── utils/       # apiClient.js (HTTP wrapper for backend communication)
    └── package.json
```

---

## 🏃 Quick Start Guide

> ⚠️ **For teammates cloning this project:** The `.env` file is ignored by Git for security. You must create it manually!

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- Git

### 2. Backend Setup

```bash
cd backend
npm install
```

**Create the environment file:**
Duplicate `.env.example` and rename it to `.env`. The `.env.example` file contains the development MongoDB Atlas connection string (`MONGO_URI`). Ensure this matches exactly.

**Seed the database:**
To populate the database with initial domains, dummy events, and sample admin/lead accounts, run:
```bash
npm run setup
```

**Start the backend server:**
```bash
npm run dev
```
You should see: `✅ MongoDB Atlas Connected` and `Server running in development mode on port 8000`.

### 3. Frontend Setup

Open a **new terminal** (keep the backend running in the first terminal):
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. The app is live!

---

## 🔑 Default Credentials

If you ran the `npm run setup` command successfully, you can access the dashboards immediately:

| Role | Email | Password | Dashboard |
|---|---|---|---|
| 👑 **Admin** | `admin@dsdl.local` | `admin123` | `/admin/dashboard` |
| 🛠 **Domain Lead** | `lead@dsdl.local` | `password123` | `/member/dashboard` |
| 👤 **Member** | `member@dsdl.com` | `member123` | `/member/dashboard` |

> 💡 **Tip:** The Login page features a **"Quick Access"** section with one-click buttons to instantly log in as an Admin, Lead, or Member during local development.

Happy coding! 🚀
