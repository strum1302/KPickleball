import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import VideoPage from './pages/VideoPage'
import ClubPage from './pages/ClubPage'
import ClubDetailPage from './pages/ClubDetailPage'
import TournamentPage from './pages/TournamentPage'
import CourtMapPage from './pages/CourtMapPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import PostEditPage from './pages/PostEditPage'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* 로그인/회원가입 - 독립 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Layout 적용 - 모든 페이지 */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/:id" element={<PostDetailPage />} />
              <Route path="/board/create" element={
                <PrivateRoute><PostCreatePage /></PrivateRoute>
              } />
              <Route path="/board/edit/:id" element={
                <PrivateRoute><PostEditPage /></PrivateRoute>
              } />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/clubs" element={<ClubPage />} />
              <Route path="/clubs/:id" element={<ClubDetailPage />} />
              <Route path="/tournaments" element={<TournamentPage />} />
              <Route path="/courts" element={<CourtMapPage />} />
              <Route path="/profile" element={
                <PrivateRoute><ProfilePage /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute><AdminPage /></PrivateRoute>
              } />
            
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
