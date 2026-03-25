import { useState, useEffect, createContext, useContext } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { RoleProvider, ROLES, useRole } from './context/RoleContext'
import RoleSelector from './components/RoleSelector'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

const MobileContext = createContext({ sidebarOpen: false, setSidebarOpen: () => {} })
export function useMobile() { return useContext(MobileContext) }

// Owner pages
import VenueGrid from './pages/owner/VenueGrid'
import PnL from './pages/PnL'
import CashFlow from './pages/owner/CashFlow'
import LabourTrends from './pages/owner/LabourTrends'
import Expansion from './pages/owner/Expansion'
import Reports from './pages/owner/Reports'

// GM pages
import Dashboard from './pages/Dashboard'
import LiveTrading from './pages/gm/LiveTrading'
import Rota from './pages/gm/Rota'
import StockCount from './pages/gm/StockCount'
import DailyChecklist from './pages/gm/DailyChecklist'
import Team from './pages/Team'
import Insights from './pages/Insights'

// Employee pages
import MyShifts from './pages/employee/MyShifts'
import ShiftSwap from './pages/employee/ShiftSwap'
import ClockInOut from './pages/employee/ClockInOut'
import TodaysSpecials from './pages/employee/TodaysSpecials'
import TipTracker from './pages/employee/TipTracker'
import Training from './pages/employee/Training'
import Announcements from './pages/employee/Announcements'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberLight: '#E8C878', amberDark: '#A67C2E', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', blue: '#3B82F6', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555',
  ink: '#fff',
}

function OwnerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<VenueGrid />} />
      <Route path="/pl" element={<PnL C={C} />} />
      <Route path="/cash-flow" element={<CashFlow />} />
      <Route path="/labour" element={<LabourTrends />} />
      <Route path="/insights" element={<Insights C={C} />} />
      <Route path="/expansion" element={<Expansion />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  )
}

function GMRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard C={C} />} />
      <Route path="/live" element={<LiveTrading />} />
      <Route path="/rota" element={<Rota />} />
      <Route path="/stock" element={<StockCount />} />
      <Route path="/checklist" element={<DailyChecklist />} />
      <Route path="/team" element={<Team C={C} />} />
      <Route path="/insights" element={<Insights C={C} />} />
    </Routes>
  )
}

function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MyShifts />} />
      <Route path="/swap" element={<ShiftSwap />} />
      <Route path="/clock" element={<ClockInOut />} />
      <Route path="/specials" element={<TodaysSpecials />} />
      <Route path="/tips" element={<TipTracker />} />
      <Route path="/training" element={<Training />} />
      <Route path="/announcements" element={<Announcements />} />
    </Routes>
  )
}

function AppContent() {
  const { role, setRole } = useRole()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (!role) {
    return <RoleSelector onSelect={setRole} />
  }

  return (
    <MobileContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="app-layout">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar open={sidebarOpen} />
        <div className="main-content">
          <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
          <main style={{ padding: 24 }}>
            {role === ROLES.OWNER && <OwnerRoutes />}
            {role === ROLES.GM && <GMRoutes />}
            {role === ROLES.EMPLOYEE && <EmployeeRoutes />}
          </main>
        </div>
      </div>
    </MobileContext.Provider>
  )
}

export default function App() {
  return (
    <HashRouter>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </HashRouter>
  )
}

export { C }
