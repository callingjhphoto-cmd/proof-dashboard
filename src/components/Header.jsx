import { Bell, ChevronDown, Menu } from 'lucide-react'
import { ROLES, ROLE_META, useRole } from '../context/RoleContext'

const C = {
  bg: '#0A0A0B', border: '#1E1E21',
  amber: '#D4A853', teal: '#14B8A6', blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff', red: '#EF4444',
}

const VENUES = ['The Ivy Chelsea Garden', 'The Ivy Soho', 'The Ivy City Garden', 'The Ivy Tower Bridge', 'The Ivy Kensington']

export default function Header({ onMenuClick }) {
  const { role, notifications } = useRole()
  const meta = ROLE_META[role]
  const notifCount = notifications[role] || 0
  const venueName = role === ROLES.OWNER ? 'All Venues' : role === ROLES.GM ? 'The Ivy Chelsea Garden' : null

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header style={{
      height: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px', background: C.bg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.textMuted }}>
        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          style={{
            background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer',
            padding: 4, display: 'none', alignItems: 'center',
          }}
        >
          <Menu size={20} />
        </button>
        {venueName && (
          <>
            <span style={{ color: C.ink, fontWeight: 600 }}>{venueName}</span>
            {role === ROLES.OWNER && <ChevronDown size={14} color={C.textDim} />}
            <span style={{ margin: '0 4px', color: C.textDim }}>|</span>
          </>
        )}
        {role === ROLES.EMPLOYEE && (
          <>
            <span style={{ color: C.ink, fontWeight: 600 }}>Marcus Taylor</span>
            <span style={{ margin: '0 4px', color: C.textDim }}>|</span>
            <span style={{ color: meta.color }}>Bartender</span>
            <span style={{ margin: '0 4px', color: C.textDim }}>|</span>
          </>
        )}
        <span>{dateStr}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color={C.textMuted} />
          {notifCount > 0 && (
            <div style={{
              position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8,
              background: C.red, fontSize: 9, fontWeight: 700, color: '#fff', padding: '0 4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{notifCount}</div>
          )}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: `linear-gradient(135deg, ${meta?.color || C.amber}, ${meta?.color || C.amber}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#000',
        }}>{meta?.initials || 'JH'}</div>
      </div>
    </header>
  )
}
