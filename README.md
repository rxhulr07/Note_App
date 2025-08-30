# HD App - Full Stack Authentication System

A complete full-stack application with user authentication, OTP verification, and responsive design.

## 🚀 Features

### Frontend (React + TypeScript)
- ✅ **Responsive Design** - Mobile-first approach with desktop optimization
- ✅ **Authentication Pages** - Beautiful signup and signin forms
- ✅ **OTP Verification** - Two-step signup process with email OTP
- ✅ **Floating Labels** - Modern form input design
- ✅ **Protected Routes** - JWT-based authentication
- ✅ **User Dashboard** - Profile management and account settings
- ✅ **State Management** - React Context for authentication
- ✅ **Form Validation** - Client-side validation with error handling

### Backend (Node.js + Express + MongoDB)
- ✅ **User Authentication** - JWT token-based security
- ✅ **OTP System** - Email-based verification
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Input Validation** - Server-side validation and sanitization
- ✅ **Rate Limiting** - API protection against abuse
- ✅ **Security Headers** - Helmet.js security middleware
- ✅ **MongoDB Integration** - Mongoose ODM with TypeScript
- ✅ **Email Service** - Nodemailer integration for OTP delivery

## 🏗️ Project Structure

```
Note_App/
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Authentication context
│   │   ├── services/      # API service layer
│   │   ├── styles/        # Global CSS
│   │   └── app/          # Routing and providers
│   ├── package.json
│   └── env.example
├── server/                 # Backend Node.js App
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Main server file
│   ├── package.json
│   └── env.example
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS Modules** - Scoped styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **TypeScript** - Type-safe backend

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **Gmail account** (for OTP emails)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Note_App
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Environment configuration
cp env.example .env
# Edit .env with your MongoDB and email credentials

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Environment configuration
cp env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### 4. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- Create database: `note_app`
- Update connection string in `.env`

### 5. Email Setup (Gmail)
- Enable 2-factor authentication
- Generate app password
- Update email credentials in `.env`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/note_app
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 📱 API Endpoints

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

## 🔐 Authentication Flow

1. **Signup Process**
   - User fills signup form
   - Backend creates user account
   - OTP sent to user's email
   - User verifies OTP
   - Account activated and JWT issued

2. **Signin Process**
   - User provides email/password
   - Backend validates credentials
   - JWT token issued
   - User redirected to dashboard

3. **OTP Alternative**
   - If password login fails
   - System suggests OTP mode
   - User receives OTP via email
   - OTP verification for login

## 🎨 UI Components

- **Responsive Forms** - Mobile-first design
- **Floating Labels** - Modern input styling
- **Loading States** - User feedback during operations
- **Error Handling** - Clear error messages
- **Success Notifications** - Positive feedback
- **Mobile Slide Bar** - Touch-friendly navigation

## 🚀 Deployment

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
# Deploy dist/ folder to your hosting service
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- Security headers with Helmet.js
- CORS configuration
- Request logging and monitoring

## 📱 Responsive Design

- **Mobile (< 768px)**: Single column layout with mobile image
- **Tablet (≥ 768px)**: Form-focused layout
- **Desktop (≥ 1024px)**: Side-by-side form and hero image

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd server
npm test

# Frontend tests (when implemented)
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🎯 Roadmap

- [ ] Password reset functionality
- [ ] Social media authentication
- [ ] Two-factor authentication
- [ ] User roles and permissions
- [ ] File upload capabilities
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

**Built with ❤️ using modern web technologies**
