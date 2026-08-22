# DSDL Club Portal — Complete Developer Documentation

> **Who is this for?** This guide is written specifically for junior members and new contributors who are joining the DSDL Club Portal project. By the end of this document, you will understand how every piece of this project works — from what happens when a user clicks a button on the website, all the way to how data is fetched from the database and sent back.

---

## 📚 Table of Contents

1. [What is this project?](#1-what-is-this-project)
2. [The Big Picture — How the app works](#2-the-big-picture--how-the-app-works)
3. [Tech Stack — What we use and WHY](#3-tech-stack--what-we-use-and-why)
4. [Setting up the project from scratch](#4-setting-up-the-project-from-scratch)
5. [The Backend Deep Dive](#5-the-backend-deep-dive)
   - [server.js — The Entry Point](#serverjs--the-entry-point)
   - [app.js — The Express App](#appjs--the-express-app)
   - [Database & Schema (SQLite)](#database--schema-sqlite)
   - [The Layered Architecture](#the-layered-architecture)
   - [Routes — The Address Book](#routes--the-address-book)
   - [Middleware — The Gatekeepers](#middleware--the-gatekeepers)
   - [Controllers — The Traffic Cops](#controllers--the-traffic-cops)
   - [Services — The Business Logic Brain](#services--the-business-logic-brain)
   - [Repositories — The Database Talker](#repositories--the-database-talker)
   - [Utils — The Helper Tools](#utils--the-helper-tools)
6. [The Frontend Deep Dive](#6-the-frontend-deep-dive)
   - [How React Works in 2 Minutes](#how-react-works-in-2-minutes)
   - [Entry Point — main.jsx and App.jsx](#entry-point--mainjsx-and-appjsx)
   - [Routing — React Router](#routing--react-router)
   - [Context — The Global State (AuthContext)](#context--the-global-state-authcontext)
   - [apiClient.js — How we talk to the Backend](#apiclientjs--how-we-talk-to-the-backend)
   - [Layouts — The Page Wrappers](#layouts--the-page-wrappers)
   - [Pages — The Screens](#pages--the-screens)
   - [Common Components](#common-components)
7. [How Frontend & Backend Connect — Full Flow Examples](#7-how-frontend--backend-connect--full-flow-examples)
   - [Example 1: A user logs in](#example-1-a-user-logs-in)
   - [Example 2: A member views all events](#example-2-a-member-views-all-events)
8. [Authentication — How Login Stays Remembered](#8-authentication--how-login-stays-remembered)
9. [Role-Based Access Control (RBAC)](#9-role-based-access-control-rbac)
10. [The Database — All the Tables Explained](#10-the-database--all-the-tables-explained)
11. [File Uploads — How images are stored](#11-file-uploads--how-images-are-stored)
12. [All API Endpoints Reference](#12-all-api-endpoints-reference)
13. [What Has Been Built — Project Progress](#13-what-has-been-built--project-progress)
14. [What Still Needs to Be Built](#14-what-still-needs-to-be-built)
15. [How to Add a New Feature (Step-by-Step)](#15-how-to-add-a-new-feature-step-by-step)

---

## 1. What is this project?

The DSDL Club Portal is a **full-stack web application** — a website that has both a visible interface (frontend) and a powerful server running behind the scenes (backend). It allows:

- **Students (Members)** to register, view events, join teams, and submit projects.
- **Domain Leads** to manage their team members, approve/reject project proposals.
- **Administrators** to manage all events, users, announcements and domains across the entire club.

---

## 2. The Big Picture — How the app works

Imagine you open a browser and go to `http://localhost:5173`. Here is what is actually happening under the hood at a very high level:

```
YOUR BROWSER (at port 5173)
      |
      |  You open the website
      |
   REACT APP (Vite/React)
      |
      |  You click "View Events"
      |  React sends an HTTP request to:
      |
   BACKEND API (Express at port 8000)
      |
      |  Express finds the /api/events route
      |  Checks your cookie (are you logged in?)
      |  Fetches data from Database
      |  Sends back a JSON response
      |
   REACT APP (receives JSON)
      |
      |  React updates the UI — you see the events!
```

The **Frontend** (React) is what you see. It runs in your browser.
The **Backend** (Node/Express) is the invisible powerhouse. It lives on a server and manages all the data.
They talk to each other using **HTTP requests** (the same protocol your browser uses to load websites).

---

## 3. Tech Stack — What we use and WHY

### 🖥️ Frontend Technologies

| Technology | What it is | Why we chose it |
|---|---|---|
| **React.js** | A JavaScript library for building UI components | Industry standard, component-based (reusable building blocks), massive community |
| **Vite** | A super-fast build tool and dev server | 10x faster than older tools like Webpack/Create React App |
| **React Router** (`react-router-dom`) | A library that handles page navigation | Enables "Single Page Application" — pages switch without reloading the browser |
| **Lucide React** | SVG icon library | Clean, lightweight icons that scale perfectly at any size |
| **Native CSS** | Plain CSS with CSS custom variables | No external frameworks — forces you to actually learn CSS. Keeps the bundle small. |
| **Native `fetch` API** | Browser's built-in HTTP request function | No need for extra libraries like Axios. We wrapped it in our own `apiClient.js`. |

### ⚙️ Backend Technologies

| Technology | What it is | Why we chose it |
|---|---|---|
| **Node.js** | A runtime that lets you run JavaScript outside of a browser (on a server) | Same language as the frontend — JavaScript everywhere! |
| **Express.js** | A framework that makes building HTTP servers easy in Node.js | Minimal and flexible. The de-facto standard for Node.js backends. |
| **SQLite3** | A relational database stored in a single `.sqlite` file | Zero setup required. No installation. Perfect for development. Can be swapped for PostgreSQL later. |
| **`sqlite` (npm package)** | A Promise-based wrapper around `sqlite3` | Lets us use `async/await` instead of ugly callbacks when writing SQL queries |
| **JWT (`jsonwebtoken`)** | JSON Web Tokens — a standard for securely transmitting user identity | Stateless authentication. The server doesn't need to store sessions. |
| **bcryptjs** | A library to hash passwords | Never store passwords as plain text! bcrypt makes them unreadable even if the database is stolen. |
| **Multer** | A middleware for handling file uploads | Handles `multipart/form-data` requests, which is the format browsers use to send files. |
| **`cookie-parser`** | Parses HTTP cookies from the request | Lets us read the JWT token we store in the user's browser cookie. |
| **`cors`** | Cross-Origin Resource Sharing middleware | Allows our frontend (port 5173) to talk to our backend (port 8000). Browsers block this by default! |
| **`dotenv`** | Loads environment variables from a `.env` file | Keeps secrets (like our JWT secret key and database path) out of the source code. |
| **`nodemon`** | A development tool that auto-restarts Node on file changes | No need to manually stop/restart the server after every code change. |

---

## 4. Setting up the project from scratch

### Prerequisites
- Install **Node.js** (v18+): https://nodejs.org/
- Install **Git**: https://git-scm.com/

### Step 1: Clone the project
```bash
git clone <repository-url>
cd DSDL-Portal
```

### Step 2: Set up the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder with this content:
```env
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=pick_a_long_random_string_here_like_this_abc123xyz
JWT_EXPIRES_IN=7d
ADMIN_NAME=DSDL Admin
ADMIN_EMAIL=admin@dsdl.local
ADMIN_PASSWORD=admin123
DATABASE_PATH=./database/portal.sqlite
```

Seed the database (create tables + dummy data + admin account):
```bash
npm run seed:dev
node src/seeds/seedAdmin.js
node src/seeds/seedLead.js
```

Start the backend:
```bash
npm run dev
# You should see: "Server running in development mode on port 8000"
```

### Step 3: Set up the Frontend
Open a **new terminal** (keep the backend running in the first one):
```bash
cd frontend
npm install
npm run dev
# You should see: "VITE v8.x  ready in xxxms → Local: http://localhost:5173/"
```

Open `http://localhost:5173` in your browser. The app is running!

### Step 4: Login

> 💡 The `/login` page has **"🚀 Quick Access"** one-click buttons for each role — you don't even have to type!

| Role | Email | Password |
|---|---|---|
| 🔑 Admin | `admin@dsdl.local` | `admin123` |
| 🎯 Lead | `lead@dsdl.local` | `password123` |
| 👤 Member | `member@dsdl.com` | `member123` |

---

## 5. The Backend Deep Dive

The backend lives in the `backend/src/` folder. Let's walk through each piece in the order the code actually executes.

### `server.js` — The Entry Point

This is where everything starts. When you run `npm run dev`, Node runs this file first.

```js
// server.js
require('dotenv').config();      // 1. Load .env variables first
const app = require('./app');    // 2. Import the configured Express app
const { connectDB } = require('./database/sqlite/connection'); // 3. Import DB connector

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();        // 4. Connect to (and initialize) the SQLite database
  app.listen(PORT, () => {  // 5. Start the server on port 8000
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
```

The reason we separate `server.js` and `app.js` is a professional practice. `app.js` just describes what the app does (middleware, routes). `server.js` actually boots it up. This makes testing easier too.

---

### `app.js` — The Express App

This is where we configure everything the Express server needs before it handles any requests.

```js
// app.js
const app = express();

// 1. CORS — Allow requests from our React app's URL (port 5173)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// 2. JSON Parser — So Express can read req.body from POST/PUT requests
app.use(express.json());

// 3. Cookie Parser — So Express can read req.cookies (our JWT token lives here)
app.use(cookieParser());

// 4. Static Files — Serve uploaded images at the /uploads URL path
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 5. Health Check — A simple endpoint to confirm the backend is alive
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 6. All API Routes — Mount everything under /api
app.use('/api', routes);

// 7. Centralized Error Handler — Catches ALL errors from any route
app.use(errorMiddleware);
```

**The request flow:** Every request goes through the middleware stack from top to bottom. CORS runs first, then JSON parsing, then cookie parsing, then it hits the routes, and if anything throws an error, it falls down to `errorMiddleware` at the bottom.

---

### Database & Schema (SQLite)

**What is a database?** A database is structured storage for your app's data. Unlike storing things in a JavaScript array (which disappears when the server restarts), a database saves data permanently.

**Why SQLite?** SQLite stores your entire database in a single file: `backend/database/portal.sqlite`. There's nothing to install or configure — it just works. This is perfect for development.

**`database/sqlite/connection.js`** — Opens the connection to the file:
```js
const connectDB = async () => {
  // Opens (or creates) the portal.sqlite file
  dbInstance = await open({ filename: dbPath, driver: sqlite3.Database });

  // Then creates all the tables if they don't exist yet
  await initializeSchema(dbInstance);
};
```

**`database/sqlite/schema.js`** — Defines all the tables. This runs every time the server starts (`CREATE TABLE IF NOT EXISTS` means it won't overwrite existing tables):

| Table Name | What it Stores |
|---|---|
| `users` | All registered accounts (name, email, hashed password, role) |
| `domains` | The club's technical domains (AI/ML, Web Dev, etc.) |
| `member_profiles` | Extended profile info for each user (bio, GitHub, skills) |
| `events` | Club events (hackathons, workshops, seminars) |
| `event_registrations` | Who registered for which event |
| `announcements` | News and alerts published by admins |
| `projects` | Club projects submitted by members |
| `teams` | Domain-specific squads |
| `team_memberships` | Who is in which team |
| `team_join_requests` | Pending requests to join a team |
| `achievements` | Club awards and milestones |

---

### The Layered Architecture

This is the most important concept in this project. **Every feature follows the same 4-step pattern:**

```
HTTP Request
     ↓
  ROUTE          (Where is this request going?)
     ↓
MIDDLEWARE       (Is the user logged in? Do they have permission?)
     ↓
CONTROLLER       (Extract data from the request)
     ↓
  SERVICE        (Apply business rules and logic)
     ↓
REPOSITORY       (Talk to the database)
     ↓
  DATABASE       (SQLite reads/writes data)
     ↑
(Response flows back up the same stack)
```

**Why this pattern?**
- Each layer has ONE job. It keeps code clean.
- If you want to switch from SQLite to MongoDB, you only change the **Repository** files. The Controllers and Services don't care.
- It's easy for new contributors to know where to look for a bug.

---

### Routes — The Address Book

Routes are like a phone directory. They map a URL + HTTP method to a Controller function.

All routes start from `routes/index.js`:
```js
router.use('/auth',          authRoutes);        // → /api/auth/...
router.use('/events',        eventRoutes);       // → /api/events/...
router.use('/projects',      projectRoutes);     // → /api/projects/...
router.use('/teams',         teamRoutes);        // → /api/teams/...
router.use('/announcements', announcementRoutes);// → /api/announcements/...
router.use('/achievements',  achievementRoutes); // → /api/achievements/...
router.use('/domains',       domainRoutes);      // → /api/domains/...
router.use('/members',       memberRoutes);      // → /api/members/...
router.use('/upload',        uploadRoutes);      // → /api/upload/...
```

Inside a specific route file (e.g., `eventRoutes.js`):
```js
// Anyone can view events (public)
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Only logged-in users can register
router.use(protect);                        // ← auth middleware
router.post('/:id/register', registerForEvent);

// Only admins can create/edit/delete events
router.use(requireRole('admin'));           // ← role middleware
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
```

**HTTP Methods explained:**
- `GET` — Read data (don't change anything)
- `POST` — Create new data
- `PUT` — Replace/update existing data
- `PATCH` — Partially update data (e.g., just change one field)
- `DELETE` — Remove data

---

### Middleware — The Gatekeepers

Middleware are functions that run **between** the request arriving and the Controller handling it. They are the security guards of our API.

**`authMiddleware.js` — The `protect` guard:**
```js
const protect = (req, res, next) => {
  // 1. Look for the JWT token in the browser cookie
  const token = req.cookies.dsdl_token;
  if (!token) throw new ApiError(401, 'Not authorized, no token');

  // 2. Verify the token is valid and not expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Attach the user info to the request object
  req.user = decoded; // { userId: 5, role: 'member' }

  // 4. Call next() to move to the Controller
  next();
};
```

**`roleMiddleware.js` — The `requireRole` guard:**
```js
const requireRole = (...roles) => {
  return (req, res, next) => {
    // Check if the logged-in user's role is in the allowed list
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient privileges'));
    }
    next();
  };
};
```

So `requireRole('admin')` will block anyone who isn't an admin, and `requireRole('admin', 'lead')` will allow both admins and leads.

**`errorMiddleware.js` — The Global Error Catcher:**
```js
const errorMiddleware = (err, req, res, next) => {
  // Formats any error consistently and sends it as JSON
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
};
```

This sits at the very bottom of `app.js`. Any time any route/controller/service throws an error, it travels here and gets formatted nicely before being sent to the browser. This is why we don't need `try/catch` blocks in our controllers — `asyncHandler` does that for us.

---

### Controllers — The Traffic Cops

Controllers are simple. They receive the HTTP request, pull out the data the Service needs, call the Service, and send back the response.

**Rule:** Never write business logic or SQL here!

```js
// authController.js
exports.login = asyncHandler(async (req, res) => {
  // 1. Extract data from the request body
  const { email, password } = req.body;

  // 2. Pass it to the Service — let the Service do the work
  const safeUser = await authService.loginUser(email, password);

  // 3. Set the JWT cookie in the browser
  generateTokenAndSetCookie(res, safeUser.id, safeUser.role);

  // 4. Send the response
  res.status(200).json(new ApiResponse(200, 'Logged in successfully', { user: safeUser }));
});
```

Notice `asyncHandler` wrapping the function. This is a utility that automatically catches any errors from `async/await` code and passes them to `errorMiddleware`. Without it, unhandled promise rejections would crash the server.

```js
// asyncHandler.js — just 3 lines!
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

---

### Services — The Business Logic Brain

This is where the real logic lives. A Service answers questions like: "Is this allowed?", "What should happen?", "What data do I need?"

```js
// authService.js
async loginUser(email, password) {
  // Business Rule 1: Email and password are required
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  // Call Repository to check if user exists in database
  const user = await userRepository.findByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid email or password');

  // Business Rule 2: Compare the password against the stored hash
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  // Return safe user data (no password hash!)
  return user.toSafeObject();
}
```

The Service throws `ApiError` objects when something goes wrong. These are caught by `asyncHandler` and forwarded to `errorMiddleware` to be sent back to the browser.

---

### Repositories — The Database Talker

Repositories contain all the raw SQL queries. Their job is simple: talk to the database.

```js
// userRepository.js
async findByEmail(email) {
  const db = getDB();
  const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  return row ? new User(row) : null;
}

async create({ name, email, passwordHash, role }) {
  const db = getDB();
  const result = await db.run(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role]
  );
  return this.findById(result.lastID);
}
```

**Why use `?` instead of putting variables directly in the SQL?**
This is called a **parameterized query** and it prevents **SQL Injection attacks** — one of the most common and dangerous security vulnerabilities. Never, ever put user input directly in a SQL string.

---

### Utils — The Helper Tools

These are small utility classes used everywhere.

**`ApiResponse.js`** — Wraps every successful response in a consistent format:
```js
// Every success response looks like:
{
  "statusCode": 200,
  "success": true,
  "message": "Logged in successfully",
  "data": { "user": { "id": 1, "name": "Arpit" } }
}
```

**`ApiError.js`** — A custom Error class that includes a status code:
```js
throw new ApiError(404, 'User not found');
// This generates an error that errorMiddleware will format as:
// { "success": false, "message": "User not found" } with HTTP 404 status
```

**`generateToken.js`** — Creates a JWT and stores it in a secure HttpOnly cookie:
```js
const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('dsdl_token', token, {
    httpOnly: true,  // JS can't read this cookie — prevents XSS attacks
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};
```

---

## 6. The Frontend Deep Dive

The frontend lives in the `frontend/src/` folder.

### How React Works in 2 Minutes

React builds UIs out of **components** — reusable pieces of JavaScript that return HTML (called JSX). When data (called **state**) changes, React automatically re-renders only the parts of the page that changed.

```jsx
// A simple React component
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Used like:
<Greeting name="Arpit" />
// Renders: <h1>Hello, Arpit!</h1>
```

---

### Entry Point — `main.jsx` and `App.jsx`

`main.jsx` is the very first file Vite runs. It mounts our React app into the HTML file:

```jsx
// main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

`App.jsx` wraps the entire app in providers:
```jsx
// App.jsx
function App() {
  return (
    <AuthProvider>      {/* Global auth state available everywhere */}
      <BrowserRouter>   {/* Enables page routing */}
        <AppRoutes />   {/* Decides which page to show */}
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

### Routing — React Router

`AppRoutes.jsx` maps URL paths to page components. When you navigate to `/member/events`, React Router shows the `MemberEvents` component without reloading the page.

```jsx
// AppRoutes.jsx (simplified)
<Routes>
  {/* Public pages anyone can see */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />

  {/* Member dashboard (must be logged in as member or lead) */}
  <Route path="/member" element={<RoleRoute roles={['member', 'lead']}><DashboardLayout /></RoleRoute>}>
    <Route path="events" element={<MemberEvents />} />
    <Route path="projects" element={<MemberProjects />} />
  </Route>

  {/* Admin dashboard (must be logged in as admin) */}
  <Route path="/admin" element={<RoleRoute roles={['admin']}><DashboardLayout /></RoleRoute>}>
    <Route path="dashboard" element={<AdminDashboard />} />
  </Route>
</Routes>
```

**`ProtectedRoute.jsx`**: Redirects to `/login` if user is not logged in.

**`RoleRoute.jsx`**: Redirects to `/` if user doesn't have the required role.

```jsx
// RoleRoute.jsx
const RoleRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};
```

---

### Context — The Global State (AuthContext)

React Context solves the "prop drilling" problem — when you need the same data (like the logged-in user) in many different components across the app.

`AuthContext.jsx` provides the `user`, `login`, `logout`, and `register` functions to every component in the app:

```jsx
// AuthContext.jsx (key parts)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app startup, check if there's already a logged-in cookie
  useEffect(() => {
    apiClient.get('/auth/me')  // Backend checks the cookie
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const login = async (email, password) => {
    const data = await apiClient.post('/auth/login', { email, password });
    setUser(data.user); // This triggers a re-render across the whole app
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// In any component, use it like:
const { user, logout } = useAuth();
```

---

### `apiClient.js` — How we talk to the Backend

This is the single file responsible for ALL communication between the frontend and the backend. Instead of writing `fetch()` everywhere, we have a clean wrapper:

```js
// apiClient.js (simplified)

const BASE_URL = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;  // e.g., http://localhost:8000/api/events

  const config = {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include' // This is critical! Sends/receives cookies automatically
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data.data; // Unwrap the ApiResponse envelope, return just the data
}

export const apiClient = {
  get:    (endpoint) => request(endpoint, { method: 'GET' }),
  post:   (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put:    (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: (endpoint, formData) => request(endpoint, { method: 'POST', body: formData }),
  //         ↑ For file uploads, we pass FormData and let the browser set the content-type
};
```

**`credentials: 'include'`** is the most important setting. It tells the browser to automatically include the JWT cookie in every request. Without this, you'd never be authenticated.

**Usage in a component:**
```jsx
useEffect(() => {
  apiClient.get('/events')
    .then(data => setEvents(data))
    .catch(err => console.error(err));
}, []);
```

---

### Layouts — The Page Wrappers

Layouts are components that provide a consistent shell around pages.

**`PublicLayout.jsx`** — Wraps public pages with the top Navbar and Footer.

**`DashboardLayout.jsx`** — Wraps member/admin pages with the left Sidebar and top DashboardHeader.

In React Router, a layout component renders an `<Outlet />` which is a placeholder where the child page component appears:

```jsx
// DashboardLayout.jsx
const DashboardLayout = () => (
  <div style={{ display: 'flex' }}>
    <Sidebar />                 {/* Left sidebar navigation */}
    <main>
      <DashboardHeader />       {/* Top header */}
      <Outlet />                {/* ← Child page renders here */}
    </main>
  </div>
);
```

---

### Pages — The Screens

Each page is a React component inside `src/pages/`:

| Folder | Pages | Who can see them |
|---|---|---|
| `pages/public/` | `Home`, `DomainDetail` | Everyone (no login needed) |
| `pages/auth/` | `Login`, `Register` | Only non-logged-in users |
| `pages/member/` | `Dashboard`, `Events`, `Projects`, `Teams`, `Achievements` | Members & Leads |
| `pages/admin/` | `Dashboard`, `ManageUsers`, `ManageEvents`, `ManageProjects` | Admins only |

A typical page component follows this pattern:
```jsx
// MemberEvents.jsx
const MemberEvents = () => {
  const [events, setEvents] = useState([]);   // 1. State to hold the data
  const [loading, setLoading] = useState(true);

  useEffect(() => {                           // 2. Fetch data when component mounts
    apiClient.get('/events')
      .then(data => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>; // 3. Show loading state

  return (                                    // 4. Render the UI
    <div>
      {events.map(event => (
        <Card key={event.id}>
          <h3>{event.title}</h3>
          <Button>Register</Button>
        </Card>
      ))}
    </div>
  );
};
```

---

### Common Components

These reusable components in `src/common/` are used throughout the app to keep the design consistent:

- **`<Button variant="primary" onClick={...}>`** — Styled buttons with variants
- **`<Card style={...}>`** — A container with shadow and border-radius
- **`<Badge color="...">`** — A small colored label (like "UPCOMING" or "ADMIN")
- **`<Container>`** — Centers content and limits max width
- **`<SectionHeading>`** — Consistent heading style for page sections

**Always use these instead of writing raw HTML elements!** If you use a raw `<button>` or `<div>` you miss out on the consistent styling and have to write CSS from scratch.

---

## 7. How Frontend & Backend Connect — Full Flow Examples

### Example 1: A user logs in

Let's trace every single step that happens when you click "Login":

```
1. User fills in email="admin@dsdl.local" and password="admin123"
   and clicks the Login button.

2. [Frontend - Login.jsx]
   The form's onSubmit handler calls:
   await authContext.login(email, password);

3. [Frontend - AuthContext.jsx]
   The login function calls:
   const data = await apiClient.post('/auth/login', { email, password });

4. [Frontend - apiClient.js]
   Makes an HTTP POST request to:
   POST http://localhost:8000/api/auth/login
   Body: { "email": "admin@dsdl.local", "password": "admin123" }
   (with credentials: 'include' to accept cookies in the response)

5. [Backend - app.js]
   Express receives the request.
   cookieParser() and express.json() middleware run first.

6. [Backend - routes/index.js]
   The request matches: router.use('/auth', authRoutes)

7. [Backend - routes/authRoutes.js]
   The request matches: router.post('/login', login)
   No middleware gates on this route (login is public).

8. [Backend - controllers/authController.js]
   The `login` controller runs:
   const { email, password } = req.body;
   const safeUser = await authService.loginUser(email, password);

9. [Backend - services/authService.js]
   Validates email/password aren't empty.
   Calls userRepository.findByEmail(email).

10. [Backend - repositories/userRepository.js]
    Runs SQL: SELECT * FROM users WHERE email = ?
    Returns the user row as a User model object.

11. [Back in authService.js]
    Runs: bcrypt.compare("admin123", user.passwordHash)
    Passwords match! Returns user.toSafeObject() (no password hash included).

12. [Back in authController.js]
    Calls: generateTokenAndSetCookie(res, safeUser.id, safeUser.role)

13. [Backend - utils/generateToken.js]
    Creates a JWT: jwt.sign({ userId: 1, role: "admin" }, JWT_SECRET, { expiresIn: "7d" })
    Sets it as a cookie in the HTTP response:
    Set-Cookie: dsdl_token=eyJhbGci...; HttpOnly; Max-Age=604800

14. [Back in authController.js]
    Sends response: { statusCode: 200, success: true, message: "Logged in successfully", data: { user: {...} } }

15. [Frontend - apiClient.js]
    Receives the response. The cookie is automatically saved by the browser.
    Returns data.data (just the { user: {...} } object).

16. [Frontend - AuthContext.jsx]
    setUser(data.user) — This updates global state!
    Every component using useAuth() re-renders with the new user.

17. [Frontend - Login.jsx]
    Sees user.role === 'admin', navigates to /admin/dashboard.

18. Browser shows the Admin Dashboard! 🎉
```

---

### Example 2: A member views all events

```
1. Member navigates to /member/events in the browser.

2. [Frontend - AppRoutes.jsx]
   RoleRoute checks: user.role is 'member' ✓. Shows MemberEvents component.

3. [Frontend - MemberEvents.jsx]
   useEffect runs on mount: apiClient.get('/events')

4. [Frontend - apiClient.js]
   GET http://localhost:8000/api/events
   (The dsdl_token cookie is included automatically by the browser)

5. [Backend - routes/eventRoutes.js]
   Route: router.get('/', optionalProtect, getAllEvents)
   optionalProtect tries to read the cookie. Since it exists, sets req.user.

6. [Backend - controllers/eventController.js]
   getAllEvents checks: if (req.user?.role === 'admin') show all events (including drafts)
   else show only published events.

7. [Backend - services/eventService.js]
   Calls eventRepository.findAll({ status: 'published' })

8. [Backend - repositories/eventRepository.js]
   Runs SQL: SELECT * FROM events WHERE status = 'published' ORDER BY date ASC
   Returns array of Event objects.

9. Response flows back:
   { statusCode: 200, success: true, data: [ { id: 1, title: "Hackathon 2026", ... }, ... ] }

10. [Frontend - apiClient.js]
    Returns data.data — the array of events.

11. [Frontend - MemberEvents.jsx]
    setEvents(eventsArray) — state updates.
    React re-renders: The event cards appear on screen.
```

---

## 8. Authentication — How Login Stays Remembered

One of the most common questions from beginners: "How does the website know I'm still logged in when I refresh the page?"

The answer: **HTTP-Only Cookies**.

When you log in:
1. The backend creates a **JWT (JSON Web Token)** — a small, self-contained string that encodes `{ userId: 5, role: "member" }`.
2. This token is signed with a secret key (only the server knows it) so it can't be faked.
3. The backend sends it back as a **cookie** with the `HttpOnly` flag.

The `HttpOnly` flag means **JavaScript cannot read this cookie**. This is a critical security feature that prevents XSS (Cross-Site Scripting) attacks from stealing your login token.

When you refresh the page:
1. `AuthContext.jsx` runs `apiClient.get('/auth/me')` on startup.
2. The browser automatically includes the cookie in this request (it does this for all requests to the same server).
3. `authMiddleware.js` reads the cookie, verifies the JWT signature, and if valid, attaches `req.user` to the request.
4. The `/auth/me` endpoint returns your user data.
5. `AuthContext` sets the user — you're logged in again!

---

## 9. Role-Based Access Control (RBAC)

We have 3 roles in the system:

| Role | What they can do |
|---|---|
| `member` | View events, register for events, view team peers, submit project proposals |
| `lead` | Everything a member can do + approve/reject projects, manage domain teams |
| `admin` | Everything — create/edit/delete events, manage all users, publish announcements |

**On the Backend**, access is controlled by middleware in route files:
```js
router.use(protect);                  // Must be logged in
router.use(requireRole('admin'));      // Must be an admin
```

**On the Frontend**, navigation and page access is controlled by `RoleRoute.jsx`:
```jsx
<Route path="/admin" element={<RoleRoute roles={['admin']}><DashboardLayout /></RoleRoute>}>
```

Even if someone types `/admin/dashboard` manually in the URL, `RoleRoute` will redirect them away if they're not an admin. And even if they somehow bypassed the frontend check, the backend would reject the API request with a 403 Forbidden error.

---

## 10. The Database — All the Tables Explained

```
users               ← Every person who has registered
  ↓ 1-to-1
member_profiles     ← Extended profile details (bio, skills, GitHub, etc.)

domains             ← The technical domains (AI/ML, Web Dev, etc.)

events              ← Club events
  ↓ many-to-many
event_registrations ← Joins users to events they registered for

announcements       ← News and alerts from admins

projects            ← Submitted project proposals

teams               ← Domain-specific squads
  ↓ many-to-many
team_memberships    ← Who is in which team
  ↓ separate
team_join_requests  ← Pending requests to join a team

achievements        ← Club awards and milestones
```

**Foreign Keys** connect tables together. For example, each `event` has an `organizer_id` that references a `user.id`. If you delete a user, the database automatically sets `organizer_id` to `NULL` (we set this up in the schema with `ON DELETE SET NULL`).

---

## 11. File Uploads — How images are stored

When a user uploads a profile picture or event banner:

**Frontend (`apiClient.upload`):**
```js
const formData = new FormData();
formData.append('image', file); // 'file' is a File object from an <input type="file">
await apiClient.upload('/upload/image', formData);
```

**Key detail**: When sending `FormData`, we **delete** the `Content-Type` header from our request. The browser then automatically sets it to `multipart/form-data; boundary=----WebKitFormBoundary...`. If we manually set `Content-Type: application/json`, Multer on the backend won't be able to parse the file.

**Backend (`uploadMiddleware.js` + `multer`):**
1. `multer` intercepts the request before it reaches the controller.
2. It reads the file from the request stream.
3. Saves it to `backend/uploads/` with a unique timestamped filename.
4. Attaches `req.file` (containing the file path) to the request object.
5. The Controller reads `req.file.filename` and stores the path in the database.

**Serving uploaded files:**
In `app.js`:
```js
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```
This means a file saved as `backend/uploads/image-1234567890.jpg` is accessible at `http://localhost:8000/uploads/image-1234567890.jpg` — a real URL your frontend can use in an `<img>` tag.

---

## 12. All API Endpoints Reference

### Authentication (`/api/auth`)
| Method | URL | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new member account |
| POST | `/api/auth/login` | Public | Login and receive JWT cookie |
| POST | `/api/auth/logout` | Auth | Clear the JWT cookie |
| GET | `/api/auth/me` | Auth | Get the currently logged-in user |

### Domains (`/api/domains`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/domains` | Public | List all domains |
| GET | `/api/domains/:slug` | Public | Get one domain by slug |
| POST | `/api/domains` | Admin | Create a domain |
| PUT | `/api/domains/:id` | Admin | Update a domain |
| DELETE | `/api/domains/:id` | Admin | Delete a domain |

### Events (`/api/events`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List all published events |
| GET | `/api/events/:id` | Public | Get one event |
| POST | `/api/events/:id/register` | Auth | Register for an event |
| POST | `/api/events` | Admin | Create an event |
| PUT | `/api/events/:id` | Admin | Update an event |
| DELETE | `/api/events/:id` | Admin | Delete an event |
| PATCH | `/api/events/:id/publish` | Admin | Publish a draft event |

### Projects (`/api/projects`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/projects` | Public | List all projects |
| GET | `/api/projects/:slug` | Public | Get one project |
| POST | `/api/projects` | Auth | Submit a project proposal |
| PUT | `/api/projects/:id` | Auth | Update a project |
| DELETE | `/api/projects/:id` | Admin | Delete a project |

### Announcements (`/api/announcements`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/announcements` | Public | List all published announcements |
| POST | `/api/announcements` | Admin/Lead | Create an announcement |
| PATCH | `/api/announcements/:id/publish` | Admin | Publish an announcement |

### Achievements (`/api/achievements`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/achievements` | Public | List all achievements |
| POST | `/api/achievements` | Admin/Lead | Add an achievement |
| DELETE | `/api/achievements/:id` | Admin | Delete an achievement |

### Teams (`/api/teams`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/teams` | Public | List all teams |
| POST | `/api/teams` | Admin/Lead | Create a team |
| POST | `/api/teams/:id/request` | Auth | Request to join a team |
| PATCH | `/api/teams/:id/request/:userId` | Auth | Approve/reject a join request |

### Members (`/api/members`)
| Method | URL | Access | Description |
|---|---|---|---|
| GET | `/api/members` | Public | List all members |
| GET | `/api/members/:id/profile` | Public | Get a member's profile |
| PUT | `/api/members/:id/profile` | Auth (own) | Update your own profile |

### Upload (`/api/upload`)
| Method | URL | Access | Description |
|---|---|---|---|
| POST | `/api/upload/image` | Auth | Upload an image (max 5MB) |

---

## 13. What Has Been Built — Project Progress

Here is a complete picture of what has been built so far:

### ✅ Backend (100% Complete)
- [x] Layered architecture (Routes → Controllers → Services → Repositories)
- [x] SQLite database with 11 tables
- [x] Authentication API (Register, Login, Logout, GetMe)
- [x] JWT cookie-based authentication
- [x] Role-Based Access Control (admin, lead, member)
- [x] Domains API (full CRUD)
- [x] Events API (full CRUD + publish + registration)
- [x] Member Profiles API
- [x] Announcements API (full CRUD + publish)
- [x] Projects API (full CRUD + status management)
- [x] Teams API (create, join requests, membership)
- [x] Achievements API (create, list, delete)
- [x] File Upload API (image upload via Multer)
- [x] Global Error Handling Middleware
- [x] Seed scripts for admin, lead, and development data

### ✅ Frontend (Core UI 100% — Interactions ~60% Complete)
- [x] React Router setup with Public, Member, and Admin route guards
- [x] AuthContext for global login state management
- [x] `apiClient.js` wrapper for all backend communication
- [x] Public Home page (fetches real domains, events, achievements from API)
- [x] Domain Detail page
- [x] Login and Register pages (fully functional)
- [x] Member Dashboard (shows real events and announcements)
- [x] Member Events page (shows real events from API)
- [x] Member Projects page (shows real projects from API)
- [x] Member Teams page (shows real team members from API)
- [x] Member Achievements page (shows real achievements from API)
- [x] Admin Dashboard (shows real stats)
- [x] Admin Manage Events page (shows real events)
- [x] Admin Manage Projects page (shows real projects)
- [x] Admin Manage Users page (shows real users)
- [x] Sidebar navigation with role-based links
- [x] Reusable component library (Button, Card, Badge, Container)

---

## 14. What Still Needs to Be Built

These are the next tasks for contributors:

### 🚧 High Priority — Interactive Forms
- [ ] **Event Registration Modal**: When a member clicks "Register" on an event, show a confirmation modal and call `POST /api/events/:id/register`.
- [ ] **Project Submission Form**: Build a modal/page with a form for submitting a new project proposal.
- [ ] **Profile Edit Page**: A form where members can update their bio, skills, GitHub link, and upload a profile photo.

### 🚧 Medium Priority
- [ ] **Admin Create Event Form**: Admins need a form to create new events from the dashboard.
- [ ] **Admin Create Announcement Form**: Admins need to be able to post announcements.
- [ ] **File Upload UI**: Add `<input type="file">` components tied to the upload API.
- [ ] **Project Approval UI**: Wire up the "Approve"/"Reject" buttons in the Lead/Admin projects view to the actual API.

### 🚧 Lower Priority
- [ ] **Pagination**: Large lists (events, members) need pagination.
- [ ] **Search & Filter**: Add search bars to filter members, events, and projects.
- [ ] **Toast Notifications**: Replace `alert()` popups with a proper notification system.
- [ ] **Responsive Design**: Ensure the app looks great on mobile devices.

---

## 15. How to Add a New Feature (Step-by-Step)

Let's say you want to add a **"Blog Posts"** feature from scratch. Here's exactly how to do it following our architecture:

### Step 1: Add the database table (Backend)
In `backend/src/database/sqlite/schema.js`, add inside the `db.exec()` string:
```sql
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Step 2: Create the Repository
Create `backend/src/repositories/blogRepository.js`:
```js
const { getDB } = require('../database/sqlite/connection');

const findAll = async () => {
  const db = getDB();
  return db.all('SELECT * FROM blog_posts WHERE status = "published" ORDER BY created_at DESC');
};

const create = async ({ title, slug, content, authorId }) => {
  const db = getDB();
  const result = await db.run(
    'INSERT INTO blog_posts (title, slug, content, author_id) VALUES (?, ?, ?, ?)',
    [title, slug, content, authorId]
  );
  return db.get('SELECT * FROM blog_posts WHERE id = ?', [result.lastID]);
};

module.exports = { findAll, create };
```

### Step 3: Create the Service
Create `backend/src/services/blogService.js`:
```js
const blogRepository = require('../repositories/blogRepository');
const ApiError = require('../utils/apiError');

const getAllPosts = async () => blogRepository.findAll();

const createPost = async ({ title, content, authorId }) => {
  if (!title || !content) throw new ApiError(400, 'Title and content are required');
  const slug = title.toLowerCase().replace(/ /g, '-');
  return blogRepository.create({ title, slug, content, authorId });
};

module.exports = { getAllPosts, createPost };
```

### Step 4: Create the Controller
Create `backend/src/controllers/blogController.js`:
```js
const blogService = require('../services/blogService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await blogService.getAllPosts();
  res.json(new ApiResponse(200, 'Success', posts));
});

exports.createPost = asyncHandler(async (req, res) => {
  const post = await blogService.createPost({ ...req.body, authorId: req.user.userId });
  res.status(201).json(new ApiResponse(201, 'Post created', post));
});
```

### Step 5: Create the Route
Create `backend/src/routes/blogRoutes.js`:
```js
const express = require('express');
const { getAllPosts, createPost } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getAllPosts);            // Anyone can read

router.use(protect);
router.use(requireRole('admin', 'lead'));
router.post('/', createPost);           // Only admins and leads can create

module.exports = router;
```

### Step 6: Register the Route
In `backend/src/routes/index.js`, add:
```js
const blogRoutes = require('./blogRoutes');
router.use('/blogs', blogRoutes);       // → /api/blogs/...
```

### Step 7: Create the Frontend Page
Create `frontend/src/pages/public/Blog.jsx`:
```jsx
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import Card from '../../common/Card';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/blogs')
      .then(data => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => (
        <Card key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </Card>
      ))}
    </div>
  );
};

export default Blog;
```

### Step 8: Add the Route to the Router
In `frontend/src/routes/AppRoutes.jsx`:
```jsx
import Blog from '../pages/public/Blog';
// ... inside <Route element={<PublicLayout />}>:
<Route path="/blog" element={<Blog />} />
```

**Done!** You now have a fully working Blog feature — database, API, and UI — following the exact same pattern as everything else in the project.

---

*This documentation was last updated on August 22, 2026. For questions, reach out to the senior members or raise an issue in the GitHub repository.*
