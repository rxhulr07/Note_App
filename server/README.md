# HD App Backend

A Node.js/Express backend with MongoDB for the HD App authentication system.

## Features

- ✅ User registration with OTP verification
- ✅ User authentication with JWT tokens
- ✅ OTP generation and email sending
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ MongoDB integration with Mongoose
- ✅ TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account for email sending (or other email service)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

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

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/profile` - Delete user account

## Project Structure

```
src/
├── models/          # MongoDB schemas
├── routes/          # API route handlers
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
