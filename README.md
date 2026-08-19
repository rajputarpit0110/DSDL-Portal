# MERN Stack Project Template

This is a clean, structured boilerplate for building MERN (MongoDB, Express, React, Node.js) stack applications. It separates the application into a `backend` server and a `frontend` client.

## Folder Structure

```text
DSDL/
├── backend/            # Express, Node, MongoDB setup
│   ├── config/         # Database and server config
│   ├── controllers/    # API endpoint business logic
│   ├── middleware/     # Express custom middlewares
│   ├── models/         # Mongoose models (schemas)
│   ├── routes/         # Express API routes
│   └── utils/          # Shared helper functions
└── frontend/           # React + Vite application
    └── src/
        ├── assets/     # Images, CSS files, fonts
        ├── components/ # Reusable UI components
        ├── context/    # React Context state management
        ├── hooks/      # Custom React hooks
        ├── pages/      # Page/route views
        └── services/   # API interaction layers (e.g., axios/fetch)
```

## Quick Start

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env` (such as `MONGO_URI` and `PORT`).
5. Start the backend dev server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
