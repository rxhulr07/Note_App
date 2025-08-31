
# Note App Frontend

This is the frontend for Note App, built with React, TypeScript, and Vite. It provides a responsive UI for user authentication, OTP verification, and notes management.

## Features

- Responsive design (mobile-first)
- Signup, signin, and OTP verification
- Protected routes (JWT-based)
- User dashboard (profile, account settings)
- Notes management (create, edit, delete, organize)
- Color coding, tags, pinning, search
- State management (React Context)
- Form validation and error handling

## Prerequisites

- Node.js (v16 or higher)

## Setup & Installation

1. Clone the repository and navigate to the client folder:
  ```bash
  git clone <repository-url>
  cd Note_App/client
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Copy `env.example` to `.env` and fill in your API URL:
  ```env
  VITE_API_URL=https://your-backend-url.onrender.com/api
  VITE_GOOGLE_CLIENT_ID=your-google-client-id
  ```
4. Start the development server:
  ```bash
  npm run dev
  ```

## Project Structure

```
src/
  app/           # Routing and providers (providers.tsx, router.tsx)
  assets/        # Images and static assets
  components/    # Dashboard, NoteCard, NoteForm, Auth pages, ProtectedRoute
  contexts/      # AuthContext, NotesContext
  services/      # API service (api.ts)
  styles/        # CSS modules and global styles
  types/         # TypeScript types (notes.ts)
  main.tsx       # App entry point
public/          # Static files
```

## Deployment

You can deploy this frontend on Render, Vercel, Netlify, or any static hosting platform. For Render:

1. Push your code to GitHub.
2. Create a new Static Site on Render and select the `client` folder.
3. Set build command: `npm install && npm run build`
4. Set publish directory: `dist`
5. Add environment variables from `.env.example`.

---

**For more details, see the main README in the root folder.**
