import { useState } from 'react'
import { Shield, ClipboardList, User, ArrowRight, Zap } from 'lucide-react'
import { ROLES, ROLE_META } from '../context/RoleContext'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', teal: '#14B8A6', blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const roleIcons = {
  [ROLES.OWNER]: Shield,
  [ROLES.GM]: ClipboardList,
  [ROLES.EMPLOYEE]: User,
}

const roleFeatures = {
  [ROLES.OWNER]: ['Multi-venue P&L grid', 'EBITDA tracking', 'Cash flow forecast', 'Anomaly alerts', 'Expansion modelling'],
  [ROLES.GM]: ['Morning briefing', 'Live trading', 'Rota management', 'Stock counts', 'Daily checklists'],
  [ROLES.EMPLOYEE]: ['My shifts', 'Shift swaps', 'Clock in/out', 'Tip tracking', 'Training content'],
}

export default function RoleSelector({ onSelect }) {
  const [hoveredRole, setHoveredRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [animatingOut, setAnimatingOut] = useState(false)

  const handleSelect = (role) => {
    setSelectedRole(role)
    setAnimatingOut(true)
    setTimeout(() => onSelect(role), 400)
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      opacity: animatingOut ? 0 : 1, transform: animatingOut ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.4s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${C.amber}, #A67C2E)`,
          fontSize: 22, fontWeight: 800, color: '#000',
        }}>P</div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, letterSpacing: '-0.5px' }}>Proof</div>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '2px' }}>AI Operations Intelligence</div>
        </div>
      </div>

      <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 48, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        Select your role to access your personalised dashboard. Every role sees different tools, but all share one nervous system.
      </p>

      {/* Role Cards */}
      <div className="role-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, width: '100%' }}>
        {Object.values(ROLES).map((role) => {
          const meta = ROLE_META[role]
          const Icon = roleIcons[role]
          const isHovered = hoveredRole === role
          const isSelected = selectedRole === role

          return (
            <div
              key={role}
              onClick={() => handleSelect(role)}
              onMouseEnter={() => setHoveredRole(role)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{
                background: isSelected ? meta.color + '15' : isHovered ? C.cardHover : C.card,
                border: `1px solid ${isSelected ? meta.color : isHovered ? '#333' : C.border}`,
                borderRadius: 16, padding: 28, cursor: 'pointer',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 8px 32px rgba(0,0,0,0.3)` : 'none',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: meta.color + '15', marginBottom: 16,
              }}>
                <Icon size={24} color={meta.color} />
              </div>

              {/* Title */}
              <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{meta.label}</div>
              <div style={{ fontSize: 13, color: meta.color, fontWeight: 500, marginBottom: 4 }}>{meta.subtitle}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, fontStyle: 'italic' }}>
                &ldquo;{meta.description}&rdquo;
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {roleFeatures[role].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.text }}>
                    <Zap size={10} color={meta.color} />
                    {feat}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 8,
                background: isHovered ? meta.color : 'transparent',
                border: `1px solid ${meta.color}`,
                color: isHovered ? '#000' : meta.color,
                fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
              }}>
                Enter as {meta.label} <ArrowRight size={14} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Data flow hint */}
      <div style={{
        marginTop: 48, padding: '16px 24px', borderRadius: 12, background: C.card,
        border: `1px solid ${C.border}`, maxWidth: 600, textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, color: C.amber, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
          The Data Loop
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
          Employee clock-in &rarr; Manager shift coverage alert &rarr; Owner labour cost trend.
          Every action at every level feeds intelligence upward.
        </div>
      </div>
    </div>
  )
}
