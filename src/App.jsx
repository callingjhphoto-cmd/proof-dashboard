import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, Package, Users, Brain, Bell } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import PnL from './pages/PnL'
import Stock from './pages/Stock'
import Team from './pages/Team'
import Insights from './pages/Insights'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberLight: '#E8C878', amberDark: '#A67C2E', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555',
  ink: '#fff',
}

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'The Pass' },
  { to: '/pl', icon: Receipt, label: 'P&L' },
  { to: '/stock', icon: Package, label: 'Stock' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/insights', icon: Brain, label: 'Insights' },
]

function Sidebar() {
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: C.bg, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'fixed', left: 0, top: 0,
    }}>
      <div style={{ padding: '0 20px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.amber}, ${C.amberDark})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#000',
        }}>P</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: '-0.3px' }}>Proof</div>
          <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Operator</div>
        </div>
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
            textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
            color: isActive ? C.amber : C.textMuted,
            background: isActive ? C.amberBg : 'transparent',
            borderLeft: isActive ? `3px solid ${C.amber}` : '3px solid transparent',
          })}>
            <Icon size={18} />{label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textDim }}>
        Demo: The Ivy Chelsea<br/>v0.1.0 — MVP
      </div>
    </aside>
  )
}

function Header() {
  return (
    <header style={{
      height: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px', background: C.bg,
    }}>
      <div style={{ fontSize: 13, color: C.textMuted }}>
        <span style={{ color: C.ink, fontWeight: 600 }}>The Ivy Chelsea Garden</span>
        <span style={{ margin: '0 8px', color: C.textDim }}>|</span>
        <span>Monday 16 March 2026</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color={C.textMuted} />
          <div style={{
            position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%',
            background: C.red, fontSize: 9, fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>3</div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${C.amber}, ${C.amberDark})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000',
        }}>JH</div>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 220, minHeight: '100vh' }}>
          <Header />
          <main style={{ padding: 24 }}>
            <Routes>
              <Route path="/" element={<Dashboard C={C} />} />
              <Route path="/pl" element={<PnL C={C} />} />
              <Route path="/stock" element={<Stock C={C} />} />
              <Route path="/team" element={<Team C={C} />} />
              <Route path="/insights" element={<Insights C={C} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export { C }
