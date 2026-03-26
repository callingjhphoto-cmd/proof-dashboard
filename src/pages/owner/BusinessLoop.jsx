import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Users, Send, BookOpen, CloudSun, Calendar, Package,
  Percent, FileText, Sun, ArrowRight, Zap, CheckCircle
} from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6', tealBg: 'rgba(20,184,166,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const LOOP_NODES = [
  {
    id: 'pos', label: 'POS / Live Trading', icon: ShoppingCart,
    description: 'Every transaction captured in real-time. Revenue, items sold, payment methods, timestamps.',
    route: '/live', roleNeeded: 'gm',
    dataFlows: ['What was sold, when, and how much'],
    status: 'live', color: C.green,
  },
  {
    id: 'crm', label: 'CRM / Customers', icon: Users,
    description: 'Customer profiles built automatically from POS data. Visit frequency, spend patterns, preferences.',
    route: '/customers',
    dataFlows: ['Customer identity linked to transactions'],
    status: 'live', color: C.green,
  },
  {
    id: 'campaigns', label: 'Campaigns', icon: Send,
    description: 'Targeted marketing based on customer segments. Win-back lapsed customers, reward regulars.',
    route: '/campaigns',
    dataFlows: ['Segment-based outreach drives repeat visits'],
    status: 'live', color: C.green,
  },
  {
    id: 'bookings', label: 'Bookings', icon: BookOpen,
    description: 'Reservation system with pre-orders. Links to customer profiles for personalised service.',
    route: '/bookings',
    dataFlows: ['Future demand signals for forecasting'],
    status: 'live', color: C.green,
  },
  {
    id: 'forecasting', label: 'Weather Forecasting', icon: CloudSun,
    description: 'AI combines bookings + weather + day-of-week + seasonality to predict covers and revenue.',
    route: '/', roleNeeded: 'gm',
    dataFlows: ['Predicted covers drive staffing and stock decisions'],
    status: 'live', color: C.green,
  },
  {
    id: 'scheduling', label: 'Staff Scheduling', icon: Calendar,
    description: 'AI-optimised rotas based on forecast demand, staff availability, and labour budget targets.',
    route: '/scheduling', roleNeeded: 'gm',
    dataFlows: ['Labour cost controlled against revenue forecast'],
    status: 'live', color: C.green,
  },
  {
    id: 'stock', label: 'Stock / Suppliers', icon: Package,
    description: 'Automated reorder suggestions based on usage rates, current stock, and lead times.',
    route: '/suppliers',
    dataFlows: ['Ingredient costs feed directly into GP% calculation'],
    status: 'live', color: C.green,
  },
  {
    id: 'gp', label: 'GP% / Menu Engineering', icon: Percent,
    description: 'Every menu item analysed: cost, margin, volume. Stars, Plowhorses, Puzzles, Dogs.',
    route: '/menu-engineering',
    dataFlows: ['Menu optimisation improves overall profitability'],
    status: 'live', color: C.green,
  },
  {
    id: 'pnl', label: 'P&L / Cash Flow', icon: FileText,
    description: 'Revenue minus COGS minus labour minus overheads. The truth of the business, updated daily.',
    route: '/pl',
    dataFlows: ['Financial performance feeds owner reporting'],
    status: 'live', color: C.green,
  },
  {
    id: 'briefing', label: 'Morning Briefing', icon: Sun,
    description: 'AI-generated daily summary: what happened yesterday, what to expect today, what needs attention.',
    route: '/morning-briefing',
    dataFlows: ['Closes the loop — insights become actions'],
    status: 'live', color: C.green,
  },
]

export default function BusinessLoop() {
  const navigate = useNavigate()
  const [hoveredNode, setHoveredNode] = useState(null)
  const [animating, setAnimating] = useState(true)

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.ink, margin: 0 }}>
          The Closed Loop
        </h1>
        <p style={{ fontSize: 14, color: C.textMuted, margin: '8px 0 0', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          Every data point in your venue connects to every decision. This is how Proof turns raw transactions into intelligent operations.
        </p>
      </div>

      {/* Loop Visualisation */}
      <div style={{
        position: 'relative', maxWidth: 800, margin: '0 auto 40px',
        padding: 40,
      }}>
        {/* Circular layout */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
          {LOOP_NODES.map((node, i) => {
            const angle = (i / LOOP_NODES.length) * 2 * Math.PI - Math.PI / 2
            const radius = 42 // percentage from center
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle)
            const isHovered = hoveredNode === node.id
            const NodeIcon = node.icon

            return (
              <div
                key={node.id}
                onClick={() => navigate(node.route)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  position: 'absolute',
                  left: `${x}%`, top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isHovered ? 10 : 1,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Node circle */}
                <div style={{
                  width: isHovered ? 80 : 64, height: isHovered ? 80 : 64,
                  borderRadius: '50%',
                  background: isHovered ? C.amberBg : C.card,
                  border: `2px solid ${isHovered ? C.amber : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: isHovered ? `0 0 20px ${C.amber}30` : 'none',
                }}>
                  <NodeIcon size={isHovered ? 28 : 22} color={isHovered ? C.amber : C.textMuted} />
                </div>

                {/* Label */}
                <div style={{
                  position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                  top: isHovered ? 88 : 72, whiteSpace: 'nowrap', textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: isHovered ? 12 : 10, fontWeight: 600,
                    color: isHovered ? C.amber : C.textMuted,
                    transition: 'all 0.3s ease',
                  }}>{node.label}</div>
                </div>

                {/* Flow arrow */}
                {i < LOOP_NODES.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '100%', top: '50%', transform: 'translateY(-50%)',
                    opacity: 0, // Arrows handled by CSS animation below
                  }} />
                )}
              </div>
            )
          })}

          {/* Center text */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', width: 200,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
              background: `linear-gradient(135deg, ${C.amber}, #A67C2E)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: '#000',
              boxShadow: `0 0 40px ${C.amber}30`,
            }}>P</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Proof</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>AI Operations Intelligence</div>
          </div>

          {/* Animated ring */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="0.3" />
            {animating && (
              <circle cx="50" cy="50" r="42" fill="none" stroke={C.amber} strokeWidth="0.5" strokeDasharray="8 255" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>
      </div>

      {/* Hover detail card */}
      {hoveredNode && (
        <div style={{
          maxWidth: 600, margin: '0 auto 32px',
          background: C.card, border: `1px solid ${C.amber}30`, borderRadius: 12, padding: 20,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {(() => {
            const node = LOOP_NODES.find(n => n.id === hoveredNode)
            if (!node) return null
            const NodeIcon = node.icon
            return (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <NodeIcon size={20} color={C.amber} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{node.label}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    background: C.greenBg, color: C.green, textTransform: 'uppercase',
                  }}>Live</span>
                </div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: '0 0 10px' }}>{node.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.amber }}>
                  <ArrowRight size={12} /> {node.dataFlows[0]}
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Linear flow breakdown */}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16, textAlign: 'center' }}>Data Flow: Step by Step</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LOOP_NODES.map((node, i) => {
            const NodeIcon = node.icon
            return (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: C.card, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <NodeIcon size={16} color={C.amber} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{node.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{node.dataFlows[0]}</div>
                </div>
                <button
                  onClick={() => navigate(node.route)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`,
                    background: 'transparent', color: C.textMuted, fontSize: 11, cursor: 'pointer',
                  }}
                >
                  View
                </button>
                {i < LOOP_NODES.length - 1 && (
                  <div style={{ position: 'absolute', left: 17, marginTop: 44, color: C.textDim }}>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pitch summary */}
      <div style={{
        maxWidth: 800, margin: '32px auto 0',
        background: C.card, border: `1px solid ${C.amber}20`, borderRadius: 12, padding: 24,
        textAlign: 'center',
      }}>
        <Zap size={20} color={C.amber} style={{ margin: '0 auto 12px' }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
          One platform. Zero blind spots.
        </div>
        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
          Proof connects every aspect of your venue into a single intelligent system. Your POS data feeds your CRM. Your CRM powers your campaigns. Your campaigns drive bookings. Your bookings inform your forecast. Your forecast optimises your staffing. Your staffing controls your labour cost. Your stock management protects your GP%. Your P&L tells the whole story. And every morning, your AI briefing tells you exactly what to do next.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
          {[
            { label: 'Modules', value: '10' },
            { label: 'Data Points', value: '1000+' },
            { label: 'Decisions Automated', value: '47' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.amber }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
