import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ArrowLeft, Mail, Phone, MessageSquare, Star, Calendar, PoundSterling, Award, Plus, Flag, Send, UserPlus } from 'lucide-react'
import { CUSTOMERS } from '../../data/customers'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  orange: '#F97316',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const segmentConfig = {
  regular: { label: 'Regular', color: C.green, bg: C.greenBg },
  high_spender: { label: 'High Spender', color: C.amber, bg: C.amberBg },
  lapsed: { label: 'Lapsed', color: C.red, bg: C.redBg },
  new: { label: 'New', color: C.blue, bg: C.blueBg },
  normal: { label: 'Normal', color: C.textMuted, bg: 'rgba(136,136,136,0.08)' },
}

function SegmentBadge({ segment, size = 'normal' }) {
  const cfg = segmentConfig[segment]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'large' ? '5px 14px' : '3px 10px', borderRadius: 20,
      fontSize: size === 'large' ? 13 : 11, fontWeight: 600, color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}25`,
    }}>{cfg.label}</span>
  )
}

export default function CustomerProfile() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState(null)

  const customer = CUSTOMERS.find(c => c.id === customerId)
  if (!customer) {
    return (
      <div className="animate-in" style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 18, color: C.ink, marginBottom: 8 }}>Customer not found</div>
        <button onClick={() => navigate('/customers')} style={{
          padding: '8px 20px', borderRadius: 8, background: C.amberBg, border: `1px solid ${C.amber}40`,
          color: C.amber, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Back to Directory</button>
      </div>
    )
  }

  const customerNotes = notes !== null ? notes : (customer.notes || [])
  const addNote = () => {
    if (!newNote.trim()) return
    const updated = [...customerNotes, newNote.trim()]
    setNotes(updated)
    setNewNote('')
  }

  const cfg = segmentConfig[customer.segment]

  return (
    <div className="animate-in">
      {/* Back button */}
      <button onClick={() => navigate('/customers')} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', marginBottom: 20,
        background: 'none', border: 'none', color: C.textMuted, fontSize: 13, cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
      }}
        onMouseEnter={e => e.currentTarget.style.color = C.ink}
        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
        <ArrowLeft size={16} /> Back to Customer Directory
      </button>

      {/* Profile Header */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              {/* Avatar */}
              <div style={{
                width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}80)`,
                fontSize: 20, fontWeight: 700, color: '#000',
              }}>
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>{customer.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <SegmentBadge segment={customer.segment} size="large" />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4, fontStyle: 'italic' }}>{customer.segmentReason}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.text }}>
                <Mail size={14} color={C.textMuted} /> {customer.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.text }}>
                <Phone size={14} color={C.textMuted} /> {customer.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.text }}>
                <Calendar size={14} color={C.textMuted} /> Member since {customer.memberSince}
              </div>
            </div>
          </div>

          {/* Lifetime Value */}
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 24px',
            textAlign: 'center', minWidth: 160,
          }}>
            <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Lifetime Value</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.amber, fontFamily: "'JetBrains Mono', monospace" }}>
              {'\u00a3'}{customer.totalSpend.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{customer.totalVisits} visits</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
          {[
            { icon: Mail, label: 'Send Email', color: C.blue },
            { icon: MessageSquare, label: 'Send SMS', color: C.green },
            { icon: UserPlus, label: 'Add to Campaign', color: C.amber },
            { icon: Flag, label: 'Flag VIP', color: C.orange },
          ].map(btn => (
            <button key={btn.label} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
              background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted,
              fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = btn.color + '60'; e.currentTarget.style.color = btn.color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted }}>
              <btn.icon size={14} /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid-2col" style={{ marginBottom: 16 }}>
        {/* Spend Trend */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Monthly Spend Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={customer.monthlySpend}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} />
              <YAxis tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} tickFormatter={v => `\u00a3${v}`} />
              <Tooltip
                contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.ink }}
                formatter={v => [`\u00a3${v}`, 'Spend']}
              />
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.amber} stopOpacity={1} />
                  <stop offset="100%" stopColor={C.amber} stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="spend" stroke={C.amber} strokeWidth={2} dot={{ fill: C.amber, r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Favourite Items */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>
            <Star size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} color={C.amber} />
            Favourite Items
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {customer.favouriteItems.map((fi, i) => {
              const maxCount = customer.favouriteItems[0].count
              const pct = maxCount > 0 ? (fi.count / maxCount) * 100 : 0
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: i === 0 ? C.ink : C.text, fontWeight: i === 0 ? 600 : 400 }}>{fi.item}</span>
                    <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{fi.count}x</span>
                  </div>
                  <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, width: `${pct}%`,
                      background: i === 0 ? C.amber : `${C.amber}60`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Loyalty Status */}
          <div style={{ marginTop: 24, padding: '14px 16px', background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={16} color={C.amber} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Loyalty Progress</span>
              </div>
              <span style={{ fontSize: 11, color: C.textMuted }}>{customer.rewardsRedeemed} rewards redeemed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4, width: `${(customer.loyaltyVisits / 10) * 100}%`,
                  background: `linear-gradient(90deg, ${C.amber}, ${C.green})`,
                }} />
              </div>
              <span style={{ fontSize: 12, color: C.amber, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
                {customer.loyaltyVisits}/10
              </span>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>
              {10 - customer.loyaltyVisits} more visit{10 - customer.loyaltyVisits !== 1 ? 's' : ''} until free cocktail
            </div>
          </div>
        </div>
      </div>

      {/* Visit History & Notes */}
      <div className="grid-2col">
        {/* Visit History */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>
            <Calendar size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} color={C.amber} />
            Visit History (Last 20)
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Date', 'Time', 'Spend', 'Items'].map(h => (
                    <th key={h} style={{
                      padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                      color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', position: 'sticky', top: 0, background: C.card,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customer.visitHistory.map((v, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: C.text }}>{v.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: C.textMuted }}>{v.time}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{'\u00a3'}{v.spend.toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: C.textMuted }}>{v.items.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>
            <MessageSquare size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} color={C.amber} />
            Staff Notes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {customerNotes.map((note, i) => (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
                fontSize: 13, color: C.text, lineHeight: 1.5,
              }}>
                {note}
              </div>
            ))}
            {customerNotes.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 13 }}>No notes yet</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text" placeholder="Add a note..."
              value={newNote} onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, background: C.bg,
                border: `1px solid ${C.border}`, color: C.ink, fontSize: 13,
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
            <button onClick={addNote} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 8,
              background: C.amber, border: 'none', color: '#000', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
