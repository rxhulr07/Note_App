# HD App Backend

A Node.js/Express backend with MongoDB for the HD App authentication system.

## Features

- ✅ User registration with OTP verification
- ✅ OTP generation and email sending
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ MongoDB integration with Mongoose
## Setup

1. **Install dependencies:**

2. **Environment Configuration:**
   - Copy `env.example` to `.env`
   - Update the values in `.env`:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/note_app
     JWT_SECRET=your-super-secret-jwt-key
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-gmail-app-password
     CLIENT_URL=http://localhost:5173
     ```

3. **Gmail Setup (for OTP emails):**
   - Enable 2-factor authentication
   - Generate an app password
   - Use the app password in `EMAIL_PASS`

4. **MongoDB Setup:**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `note_app`

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/get-otp` - Generate OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user


```
├── middleware/      # Custom middleware
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- Security headers with helmet
- CORS configuration
- Request logging with morgan

# Note App Backend

This is the backend API for Note App, built with Node.js, Express, TypeScript, and MongoDB. It provides secure user authentication (with OTP), notes management, and robust security features.

## Features

- User registration and authentication (JWT)
- OTP verification via email
- Notes CRUD API
- Password hashing (bcrypt)
- Input validation and sanitization
- Rate limiting and security headers
- MongoDB integration (Mongoose)
- TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account (for OTP emails)

## Setup & Installation

1. Clone the repository and navigate to the server folder:
   ```bash
   git clone <repository-url>
   cd Note_App/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `env.example` to `.env` and fill in your credentials:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. For production build:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/get-otp` - Generate OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signin` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/profile` - Delete user account

### Notes Management
- `POST /api/notes` - Create note
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PUT /api/notes/:id/pin` - Toggle pin status

## Project Structure

```
src/
  models/        # MongoDB schemas (Note.ts, User.ts)
  routes/        # API endpoints (auth.ts, notes.ts, user.ts)
  middleware/    # Custom middleware (auth.ts, validation.ts)
  utils/         # Utility functions (email.ts)
  server.ts      # Main server file
```

## Security Features

- JWT authentication
- Password hashing (bcrypt)
- Input validation and sanitization
- Rate limiting
- Security headers (Helmet.js)
- CORS configuration
- Request logging

## Deployment

You can deploy this backend on Render, Heroku, or any Node.js hosting platform. For Render:

1. Push your code to GitHub.
2. Create a new Web Service on Render and select the `server` folder.
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`.
6. Set up MongoDB (Atlas or Render add-on).

---

**For more details, see the main README in the root folder.**
