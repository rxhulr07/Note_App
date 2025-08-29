import { Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from '../components/SignupPage'
import SigninPage from '../components/SigninPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login"  element={<SigninPage />} />
      <Route path="/app"    element={<div>Protected App</div>} />
    </Routes>
  )
}
