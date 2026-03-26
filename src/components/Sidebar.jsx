import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Receipt, Package, Users, Brain, Bell, Grid3X3, TrendingUp,
  Calendar, ArrowLeftRight, Clock, BookOpen, PoundSterling, Megaphone,
  ClipboardCheck, BarChart3, Truck, Coffee, GraduationCap, LogOut,
  Building2, Wallet, Expand, UserCircle, Send, Award, Activity, FileText, Eye,
  Sun, Star, MessageSquare, UtensilsCrossed, Boxes, CloudSun, CalendarClock, Zap
} from 'lucide-react'
import { ROLES, ROLE_META, useRole } from '../context/RoleContext'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  teal: '#14B8A6', tealBg: 'rgba(20,184,166,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
  red: '#EF4444',
}

const NAV_BY_ROLE = {
  [ROLES.OWNER]: [
    { to: '/morning-briefing', icon: Sun, label: 'Morning Briefing' },
    { to: '/', icon: Grid3X3, label: 'Venue Grid' },
    { to: '/pl', icon: Receipt, label: 'P&L' },
    { to: '/cash-flow', icon: Wallet, label: 'Cash Flow' },
    { to: '/labour', icon: Users, label: 'Labour Trends' },
    { to: '/stock', icon: Package, label: 'Stock Intelligence' },
    { to: '/insights', icon: Brain, label: 'AI Insights' },
    { to: '/ops-intelligence', icon: Activity, label: 'Ops Intelligence' },
    { to: '/ops-weekly', icon: FileText, label: 'Weekly Review' },
    { to: '/competitor-watch', icon: Eye, label: 'Competitor Watch' },
    { to: '/expansion', icon: Expand, label: 'Expansion' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/bookings', icon: BookOpen, label: 'Bookings' },
    { to: '/suppliers', icon: Truck, label: 'Suppliers' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
    { to: '/menu-engineering', icon: UtensilsCrossed, label: 'Menu Engineering' },
    { to: '/venues/league', icon: Award, label: 'League Table' },
    { to: '/business-loop', icon: Zap, label: 'Business Loop' },
    { divider: true, label: 'Customers' },
    { to: '/customers', icon: UserCircle, label: 'Directory' },
    { to: '/campaigns', icon: Send, label: 'Campaigns' },
    { to: '/loyalty', icon: Award, label: 'Loyalty' },
  ],
  [ROLES.GM]: [
    { to: '/morning-briefing', icon: Sun, label: 'Morning Briefing' },
    { to: '/', icon: LayoutDashboard, label: 'The Pass' },
    { to: '/live', icon: TrendingUp, label: 'Live Trading' },
    { to: '/rota', icon: Calendar, label: 'Rota' },
    { to: '/stock', icon: Package, label: 'Stock Count' },
    { to: '/checklist', icon: ClipboardCheck, label: 'Daily Checklist' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/insights', icon: Brain, label: 'AI Insights' },
    { to: '/bookings', icon: BookOpen, label: 'Bookings' },
    { to: '/suppliers', icon: Truck, label: 'Suppliers' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
    { to: '/scheduling', icon: CalendarClock, label: 'Scheduling AI' },
    { divider: true, label: 'Customers' },
    { to: '/customers', icon: UserCircle, label: 'Directory' },
    { to: '/loyalty', icon: Award, label: 'Loyalty' },
  ],
  [ROLES.EMPLOYEE]: [
    { to: '/', icon: Calendar, label: 'My Shifts' },
    { to: '/swap', icon: ArrowLeftRight, label: 'Shift Swap' },
    { to: '/clock', icon: Clock, label: 'Clock In/Out' },
    { to: '/specials', icon: Coffee, label: "Today's Specials" },
    { to: '/tips', icon: PoundSterling, label: 'My Tips' },
    { to: '/training', icon: GraduationCap, label: 'Training' },
    { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  ],
}

export default function Sidebar({ open }) {
  const { role, setRole, notifications } = useRole()
  const meta = ROLE_META[role]
  const nav = NAV_BY_ROLE[role] || []
  const roleColor = meta?.color || C.amber
  const roleBg = role === ROLES.OWNER ? C.amberBg : role === ROLES.GM ? C.tealBg : C.blueBg
  const notifCount = notifications[role] || 0

  return (
    <aside className={open ? 'sidebar-open' : ''} style={{
      width: 220, minHeight: '100vh', background: C.bg, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'fixed', left: 0, top: 0, zIndex: 100,
      transition: 'transform 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${C.amber}, #A67C2E)`,
          fontSize: 14, fontWeight: 800, color: '#000',
        }}>P</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: '-0.3px' }}>Proof</div>
          <div style={{ fontSize: 10, color: roleColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {meta?.subtitle || 'AI Operator'}
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{
        margin: '0 12px 16px', padding: '8px 12px', borderRadius: 8,
        background: roleBg, border: `1px solid ${roleColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: roleColor }}>{meta?.label}</div>
          <div style={{ fontSize: 10, color: C.textDim }}>{meta?.description}</div>
        </div>
        {notifCount > 0 && (
          <div style={{
            minWidth: 18, height: 18, borderRadius: 9, background: C.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff', padding: '0 5px',
          }}>{notifCount}</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {nav.map((item, i) => {
          if (item.divider) {
            return (
              <div key={`div-${i}`} style={{
                fontSize: 10, fontWeight: 600, color: C.textDim, textTransform: 'uppercase',
                letterSpacing: '1px', padding: '14px 12px 6px',
                borderTop: `1px solid ${C.border}`, marginTop: 6,
              }}>{item.label}</div>
            )
          }
          const { to, icon: Icon, label } = item
          return (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
              textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
              color: isActive ? roleColor : C.textMuted,
              background: isActive ? roleBg : 'transparent',
              borderLeft: isActive ? `3px solid ${roleColor}` : '3px solid transparent',
            })}>
              <Icon size={18} />{label}
            </NavLink>
          )
        })}
      </nav>

      {/* Switch role */}
      <div style={{ padding: '12px', borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={() => setRole(null)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`,
            background: 'transparent', color: C.textMuted, fontSize: 12, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = C.ink }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted }}
        >
          <LogOut size={14} /> Switch Role
        </button>
      </div>

      <div style={{ padding: '8px 20px 0', fontSize: 10, color: C.textDim }}>
        v0.4.0 &mdash; Full Suite
      </div>
    </aside>
  )
}
