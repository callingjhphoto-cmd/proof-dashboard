import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, Menu, X } from 'lucide-react'
import { ROLES, ROLE_META, useRole } from '../context/RoleContext'

const C = {
  bg: '#0A0A0B', border: '#1E1E21',
  amber: '#D4A853', teal: '#14B8A6', blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff', red: '#EF4444',
}

const VENUES = ['All Venues', 'The Ivy Chelsea Garden', 'The Ivy Soho Brasserie', 'The Ivy City Garden', 'The Ivy Tower Bridge', 'The Ivy Kensington']

export default function Header({ onMenuClick }) {
  const { role, notifications, clearNotifications } = useRole()
  const meta = ROLE_META[role]
  const notifCount = notifications[role] || 0

  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState('All Venues')
  const [notifPanelOpen, setNotifPanelOpen] = useState(false)
  const venueRef = useRef(null)
  const notifRef = useRef(null)

  const venueName = role === ROLES.OWNER ? selectedVenue : role === ROLES.GM ? 'The Ivy Chelsea Garden' : null

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (venueRef.current && !venueRef.current.contains(e.target)) setVenueDropdownOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifPanelOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setVenueDropdownOpen(false)
        setNotifPanelOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const notifMessages = {
    [ROLES.OWNER]: [
      { text: 'Tower Bridge EBITDA dropped below 10%', time: '2h ago', severity: 'red' },
      { text: 'City Garden labour at 33.8% \u2014 above target', time: '4h ago', severity: 'orange' },
      { text: 'Soho Brasserie hit \u00A3195k revenue this month', time: '6h ago', severity: 'green' },
    ],
    [ROLES.GM]: [
      { text: 'Low stock: Hendricks Gin (2 bottles)', time: '1h ago', severity: 'red' },
      { text: 'Friday booking: 142 covers (18% above avg)', time: '2h ago', severity: 'amber' },
      { text: 'Labour running at 34% this week', time: '3h ago', severity: 'orange' },
      { text: 'New shift swap request from Marcus T.', time: '4h ago', severity: 'amber' },
      { text: 'GP% trending up: 68.2% vs 66.5% last week', time: '5h ago', severity: 'green' },
      { text: 'Daily checklist 60% complete', time: '6h ago', severity: 'amber' },
      { text: 'Spring menu launch Wednesday', time: '8h ago', severity: 'green' },
    ],
    [ROLES.EMPLOYEE]: [
      { text: 'Your shift tomorrow: 16:00\u201323:00', time: '1h ago', severity: 'amber' },
      { text: 'New training module available: Spring Menu', time: '3h ago', severity: 'green' },
    ],
  }

  const sevColorMap = { red: C.red, orange: '#F97316', amber: C.amber, green: '#22C55E' }

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
            {role === ROLES.OWNER ? (
              <div ref={venueRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: venueDropdownOpen ? '#1E1E21' : 'transparent',
                    border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!venueDropdownOpen) e.currentTarget.style.background = '#161618' }}
                  onMouseLeave={e => { if (!venueDropdownOpen) e.currentTarget.style.background = 'transparent' }}
                  aria-haspopup="listbox"
                  aria-expanded={venueDropdownOpen}
                >
                  <span style={{ color: C.ink, fontWeight: 600, fontSize: 13 }}>{selectedVenue}</span>
                  <ChevronDown size={14} color={C.textDim} style={{
                    transition: 'transform 0.2s',
                    transform: venueDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }} />
                </button>
                {venueDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: 4, minWidth: 220,
                    background: '#111113', border: `1px solid ${C.border}`, borderRadius: 10,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden',
                    padding: '4px 0',
                  }} role="listbox">
                    {VENUES.map((v) => (
                      <button
                        key={v}
                        role="option"
                        aria-selected={selectedVenue === v}
                        onClick={() => { setSelectedVenue(v); setVenueDropdownOpen(false) }}
                        style={{
                          display: 'block', width: '100%', padding: '10px 14px', border: 'none',
                          background: selectedVenue === v ? 'rgba(212,168,83,0.1)' : 'transparent',
                          color: selectedVenue === v ? C.amber : C.text, fontSize: 13,
                          fontWeight: selectedVenue === v ? 600 : 400, cursor: 'pointer',
                          textAlign: 'left', transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = selectedVenue === v ? 'rgba(212,168,83,0.15)' : '#1E1E21'}
                        onMouseLeave={e => e.currentTarget.style.background = selectedVenue === v ? 'rgba(212,168,83,0.1)' : 'transparent'}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span style={{ color: C.ink, fontWeight: 600 }}>{venueName}</span>
            )}
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
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifPanelOpen(!notifPanelOpen); if (!notifPanelOpen) clearNotifications(role) }}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
              position: 'relative', display: 'flex', alignItems: 'center',
            }}
            aria-label={`Notifications (${notifCount} unread)`}
            aria-haspopup="true"
            aria-expanded={notifPanelOpen}
          >
            <Bell size={18} color={notifPanelOpen ? C.amber : C.textMuted} />
            {notifCount > 0 && (
              <div style={{
                position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8,
                background: C.red, fontSize: 9, fontWeight: 700, color: '#fff', padding: '0 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{notifCount}</div>
            )}
          </button>
          {notifPanelOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 320,
              background: '#111113', border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Notifications</span>
                <button
                  onClick={() => setNotifPanelOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textDim, display: 'flex' }}
                  aria-label="Close notifications"
                >
                  <X size={14} />
                </button>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {(notifMessages[role] || []).map((n, i) => (
                  <div key={i} style={{
                    padding: '10px 16px', borderBottom: `1px solid ${C.border}`,
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                      background: sevColorMap[n.severity] || C.textDim,
                    }} />
                    <div>
                      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
