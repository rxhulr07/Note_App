import { Routes, Route, Navigate } from 'react-router-dom'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<div>Signup Page</div>} />
      <Route path="/login"  element={<div>Login Page</div>} />
      <Route path="/app"    element={<div>Protected App</div>} />
    </Routes>
  )
}
