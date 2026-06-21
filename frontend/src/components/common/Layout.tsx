import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: '클럽소개' },
    { to: '/board', label: '게시판' },
    { to: '/tournaments', label: '대회/일정' },
    { to: '/clubs', label: '클럽목록' },
    { to: '/videos', label: '갤러리' },
    { to: '/courts', label: '코트찾기' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 상단 정보 바 */}
      <div className="bg-gray-800 text-gray-300 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span>문의: info@kpickleball.us</span>
          <span>Chicago, Illinois, USA</span>
        </div>
      </div>

      {/* 헤더 */}
      <header className="bg-white border-b-2 border-green-600 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* 로고 */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="K-Pickleball" className="w-12 h-14" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">K-Pickleball</h1>
            <p className="text-xs text-gray-500">Korean Pickleball Association of America</p>
          </div>
        </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded ${
                  isActive(link.to)
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 로그인/회원가입 */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === 'Admin' && (
                <Link to="/admin"
                  className="text-sm text-purple-600 font-medium px-3 py-1.5 bg-purple-50 rounded hover:bg-purple-100">
                  ⚙️ 관리자
                </Link>
              )}
              <Link to="/profile"
                className="text-sm text-gray-700 hover:text-green-600 font-medium">
                👤 {user?.nickname}
              </Link>
              <button onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500">
                로그아웃
              </button>
            </div>
             ) : (
              <>
                <Link to="/login"
                  className="text-sm text-gray-600 hover:text-green-600 font-medium px-3 py-1.5">
                  로그인
                </Link>
                <Link to="/register"
                  className="bg-green-600 text-white text-sm px-4 py-1.5 rounded hover:bg-green-700 transition-colors font-medium">
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded text-sm font-medium ${
                    isActive(link.to)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <button onClick={handleLogout}
                    className="flex-1 text-center py-2 text-red-500 text-sm">
                    로그아웃
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2 border border-gray-300 rounded text-sm">
                      로그인
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2 bg-green-600 text-white rounded text-sm">
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 페이지 콘텐츠 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-gray-400 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="text-white font-bold mb-3">K-Pickleball</h4>
              <p className="text-sm">Korean Pickleball Association of America</p>
              <p className="text-sm mt-1">미국 한인 피클볼 커뮤니티</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">바로가기</h4>
              <ul className="space-y-1 text-sm">
                <li><Link to="/about" className="hover:text-white">클럽소개</Link></li>
                <li><Link to="/board" className="hover:text-white">게시판</Link></li>
                <li><Link to="/tournaments" className="hover:text-white">대회정보</Link></li>
                <li><Link to="/clubs" className="hover:text-white">클럽목록</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">연락처</h4>
              <p className="text-sm">Email: info@kpickleball.us</p>
              <p className="text-sm mt-1">Chicago, Illinois, USA</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center text-sm">
            © 2026 K-Pickleball. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
