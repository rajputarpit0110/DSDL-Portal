# DSDL Club Official Portal

Welcome to the **Data Science & Deep Learning (DSDL)** Club Portal! This platform serves as a central hub for managing club domains, organizing events, tracking member projects, showcasing achievements, and facilitating team collaborations.

This document is designed to help **junior members and new contributors** understand how the project is built, what technologies we use, what has been completed so far, and how you can contribute!

---

## 🛠️ The Tech Stack (What & Why)

We use a modern, decoupled Client-Server architecture. This means our Frontend (what the user sees) and Backend (the server and database) are two completely separate applications that talk to each other over an API.

### Frontend (Client-Side)
- **React.js**: The core library for building our user interfaces.
- **Vite**: Our build tool and development server. It is extremely fast and replaces older tools like Create React App (Webpack).
- **React Router (`react-router-dom`)**: Handles navigation. It allows us to have different pages (like `/login`, `/admin/dashboard`) without reloading the browser.
- **Pure CSS / CSS Variables**: We are purposefully **not** using heavy UI libraries (like Bootstrap or Material UI) or utility classes (like Tailwind) to keep the project lightweight and help juniors master fundamental CSS.
- **Lucide React**: Our icon library. It provides clean, scalable SVG icons.
- **Native Fetch API (`apiClient.js`)**: Instead of `axios`, we use a custom wrapper around the native browser `fetch` to handle API calls, attach authentication tokens, and handle file uploads smoothly.

### Backend (Server-Side)
- **Node.js & Express.js**: The engine and framework for our backend API. It handles incoming HTTP requests from the frontend and sends back JSON data.
- **SQLite3**: Our current relational database. We chose SQLite for development because it requires zero setup (it just creates a `.sqlite` file in the folder). *Note: The code is structured so we can easily swap this out for PostgreSQL or MongoDB in the future.*
- **JSON Web Tokens (JWT)**: Used for authentication. When a user logs in, they get a token stored in their browser cookies to keep them logged in.
- **Bcrypt.js**: Used to securely hash and salt user passwords before saving them to the database.
- **Multer**: A middleware used to handle `multipart/form-data`, which allows users to upload files (like profile pictures or event banners) to our server.

---

## 📊 Project Status: What's Done?

We have successfully completed the massive foundational work for both the Backend API and the Frontend UI.

### ✅ Completed Features
1. **Core Architecture**: The layered backend structure and the frontend routing setup are fully complete.
2. **Authentication System**: Register, Login, and Role-Based Access Control (Admin vs Lead vs Member).
3. **Domain Management**: Domains (AI/ML, Web Dev, etc.) can be viewed and members belong to them.
4. **Member Profiles**: Users have profiles and the backend can list members.
5. **Event Management API & UI**: Admins can create events. The frontend successfully fetches and displays upcoming and past events.
6. **Project Submission API & UI**: Members can see projects, and leads/admins can manage project statuses.
7. **Team Formation API & UI**: Members can see their peers, and leads can manage domain teams.
8. **Announcements System**: Admins can broadcast announcements which appear on the Member Dashboard.
9. **Achievements System**: Global achievements and awards can be fetched and displayed on the public Home page and member dashboards.
10. **File Upload Infrastructure**: The backend is configured to accept image uploads and serve them statically.

### 🚧 What's Next? (Pending Work)
While the pages exist and data is loading from the database, **some interactive UI flows need to be built**:
- **Forms & Modals**: The buttons for "Register for Event", "Submit Project Proposal", and "Edit Role" currently show mock alerts. We need to build the React forms that actually send the `POST` requests to the API.
- **File Upload UI**: We need to add file picker inputs to the frontend so users can upload their avatars or project banners.
- **Profile Editing**: Building the settings page for members to update their details.

---

## 🏗️ How the Code Works (Architecture)

To keep our code clean as it grows, we follow a strict **Layered Architecture** on the Backend. If you are adding a new feature (like "Blogs"), you must follow this flow:

1. **Route (`routes/blogRoutes.js`)**: Catches the HTTP request (e.g., `POST /api/blogs`) and checks permissions using middleware. Passes the request to the Controller.
2. **Controller (`controllers/blogController.js`)**: Extracts data from `req.body` or `req.params`. **Never write database queries or complex logic here.** It passes the extracted data to the Service.
3. **Service (`services/blogService.js`)**: The "Brain". Handles business logic (e.g., "Is this title too long?", "Does this user have permission?"). It calls the Repository to get/save data.
4. **Repository (`repositories/blogRepository.js`)**: The only place where we write SQL queries. It interacts directly with the Database.

**Why do we do this?** If we ever switch from SQLite to MongoDB, we only have to rewrite the *Repositories*. The Controllers and Services stay exactly the same!

---

## 📂 Project Structure

```text
DSDL-Portal/
├── backend/
│   ├── database/        # SQLite database file (.sqlite) lives here
│   ├── uploads/         # Uploaded images & banners are saved here
│   ├── src/
│   │   ├── controllers/ # Step 2: Extracts HTTP data
│   │   ├── middleware/  # Security checks (Auth, Roles, Uploads)
│   │   ├── models/      # Data schema blueprints
│   │   ├── repositories/# Step 4: SQL Database Queries
│   │   ├── routes/      # Step 1: API Endpoints definition
│   │   ├── seeds/       # Scripts to populate fake dummy data for testing
│   │   ├── services/    # Step 3: Business Logic & Rules
│   │   └── utils/       # Helpers like ApiResponse formatters
│   └── server.js        # The entry point that boots up Express
│
└── frontend/
    ├── public/          # Static assets & logos
    └── src/
        ├── common/      # Reusable UI components (Buttons, Cards, Badges)
        ├── context/     # Global State (AuthContext keeps track of who is logged in)
        ├── layout/      # Navbars, Sidebars, and Page Wrappers
        ├── pages/       # The actual screen views
        │   ├── admin/   # Admin dashboard screens
        │   ├── auth/    # Login and Registration screens
        │   ├── member/  # Authenticated member screens (Events, Projects)
        │   └── public/  # Unauthenticated marketing pages (Home, About)
        ├── routes/      # AppRoutes.js decides which page loads on which URL
        └── utils/       # apiClient.js (used to fetch data from the backend)
```

---

## 🚀 Quick Start Guide

Ready to code? Follow these steps to get the app running on your machine.

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v18+ recommended)
- Install Git

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env` (or create a `.env` file manually)
   - Ensure you define `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Seed the database (This creates the tables, dummy data, and admin accounts):
   ```bash
   npm run seed:dev
   node src/seeds/seedAdmin.js
   node src/seeds/seedLead.js
   ```
5. Start the backend server (Runs on `http://localhost:5000` by default):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a **new** terminal (keep the backend running) and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (Runs on `http://localhost:5173` by default):
   ```bash
   npm run dev
   ```

---

## 🔐 Default Login Credentials

If you ran the seed scripts during setup, you can access the dashboards immediately using these accounts:

**Global Admin** (Full access to all systems):
- **Email**: `admin@dsdl.local` (or whatever you set in `.env`)
- **Password**: `CHANGE_THIS_PASSWORD`

**Domain Lead** (Can approve projects and manage domain members):
- **Email**: `lead@dsdl.local`
- **Password**: `password123`

---

## 💡 How to Contribute as a Junior Member

1. **Pick a Task**: Look at the "What's Next" section above. A great first task is to turn one of the mock button alerts (like "Submit Project") into a real React Form modal!
2. **Use Existing Components**: If you need a button or a card on the frontend, import `Button` or `Card` from `src/common/`. Do not reinvent the wheel.
3. **Use the API Client**: To talk to the backend, import `apiClient` from `src/utils/apiClient.js`. 
   - *Example:* `apiClient.post('/projects', formData)`
4. **Ask Questions!**: If you aren't sure how a Service connects to a Repository, just ask me or seniors .
H
