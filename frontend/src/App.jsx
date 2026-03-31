import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Organizations from './pages/Organizations'
import BookQueue from './pages/BookQueue'
import MyQueue from './pages/MyQueue'
import Login from './pages/Login'
import OperatorDashboard from './pages/operator/Dashboard'
import DisplayBoard from './pages/display/Board'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  const location = useLocation()
  
  // Zal ekrani va Admin paneli uchun Navbar, Footer yashiriladi.
  const isDisplayBoard = location.pathname.startsWith('/display')
  const isAdminPanel = location.pathname.startsWith('/admin')
  const hideLayout = isDisplayBoard || isAdminPanel

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tashkilotlar" element={<Organizations />} />
          <Route path="/navbat-olish" element={<BookQueue />} />
          <Route path="/mening-navbatim" element={<MyQueue />} />
          <Route path="/kirish" element={<Login />} />
          
          {/* Tizimning ishchi Panellari */}
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="/display" element={<DisplayBoard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default App
