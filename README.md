# Lumo - Local Marketplace PWA

Lumo is a high-performance, mobile-first Local Marketplace Progressive Web App (PWA) designed to connect local buyers and sellers. It features offline synchronization, a robust design system, and a secure backend.

## 🚀 Key Features

- **Progressive Web App (PWA)**: Installable on mobile and desktop devices with offline capabilities.
- **Offline Sync**: Browse and interact with listings even without an internet connection using IndexedDB and background synchronization.
- **Discovery**: Search for local listings with filters for regions and categories.
- **Secure Transactions**: User authentication and authorization powered by Supabase and JWT.
- **Modern UI**: A premium, responsive design built with Tailwind CSS and Inter typography.
- **Robustness**: Global error handling and logging for both client and server.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Persistence**: IndexedDB (idb)
- **PWA**: `vite-plugin-pwa`, Workbox

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Auth**: Supabase Auth (JWT)
- **Validation**: Zod
- **API**: RESTful architecture

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage

## 📂 Project Structure

```text
├── client/          # React frontend application
│   ├── src/         # Source code
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks (offline sync, etc)
│   │   ├── pages/       # Application views
│   │   └── lib/         # External service clients (Supabase)
├── server/          # Node.js Express backend
│   ├── src/         # API source code
│   │   ├── middleware/  # Auth and request logging
│   │   ├── routes/      # API endpoints
│   │   └── lib/         # Utility libraries
└── README.md        # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- Supabase account and project setup

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lumo
   ```

2. **Backend Configuration**
   - Navigate to the `server` directory:
     ```bash
     cd server
     npm install
     ```
   - Create a `.env` file based on `.env.example`:
     ```env
     PORT=3001
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_JWT_SECRET=your_jwt_secret
     ALLOWED_ORIGIN=http://localhost:5173
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Frontend Configuration**
   - Navigate to the `client` directory:
     ```bash
     cd client
     npm install
     ```
   - Create a `.env.local` file:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

## 📄 License

This project is licensed under the ISC License.
