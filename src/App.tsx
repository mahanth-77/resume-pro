import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Builder from './pages/Builder'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

// Simple auth mock (replace with real Supabase later)
const isAuthenticated = () => {
  return localStorage.getItem('resume-pro-auth') === 'true'
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}