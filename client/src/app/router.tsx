import { Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from '../components/SignupPage'
import SigninPage from '../components/SigninPage'
import Dashboard from '../components/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<SigninPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/app" element={<div>Protected App</div>} />
    </Routes>
  )
}
