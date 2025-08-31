


# Note App

Note App is a full-stack web application for secure note-taking with user authentication and OTP verification. It features a modern, responsive UI and robust backend, making it ideal for personal use or as a technical showcase.

---

## 🚀 Demo

[View the live app here](https://rahul-note-app.vercel.app)

---

## What does Note App do?

- Allows users to sign up, verify their email via OTP, and securely log in
- Lets users create, edit, delete, and organize notes with advanced features (color coding, tags, pinning, search)
- Provides a user dashboard for profile management
- Ensures security with JWT authentication, password hashing, and rate limiting

## Why is it impressive?

- Built with React, TypeScript, Node.js, Express, and MongoDB
- Implements modern authentication flows (OTP, JWT)
- Clean, mobile-first design and smooth user experience
- Well-structured codebase for both frontend and backend

## How to install and set up

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account (for OTP emails)

### Quick Start
1. **Clone the repository:**
	```bash
	git clone <repository-url>
	cd Note_App
	```
2. **Backend setup:**
	```bash
	cd server
	npm install
	cp env.example .env
	# Edit .env with your MongoDB and email credentials
	npm run dev
	```
3. **Frontend setup:**
	```bash
	cd client
	npm install
	cp env.example .env
	# Edit .env with your API URL
	npm run dev
	```

### Environment Variables
- See `server/env.example` and `client/env.example` for required variables

### Deployment
- You can deploy Note App on Render, Vercel, or any Node.js/static hosting platform
- For Render, follow the instructions in the server and client README files

---

**For more technical details, see the README files in the `client` and `server` folders.**
