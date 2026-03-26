import { useState, useMemo } from 'react'
import {
  Calendar, Clock, Users, Zap, PoundSterling, Percent, AlertTriangle,
  CheckCircle, ChevronLeft, ChevronRight, Send, Target
} from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const SHIFT_TEMPLATES = {
  morning: { name: 'Morning', hours: '07:00-15:00', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  afternoon: { name: 'Afternoon', hours: '11:00-19:00', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  evening: { name: 'Evening', hours: '16:00-00:00', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  close: { name: 'Close', hours: '18:00-02:00', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
}

const STAFF = [
  { id: 1, name: 'Sarah Mitchell', role: 'Bar Lead', rate: 16.50, maxHours: 45, availability: { Mon: ['morning', 'afternoon', 'evening'], Tue: ['morning', 'afternoon', 'evening'], Wed: ['afternoon', 'evening'], Thu: ['afternoon', 'evening'], Fri: ['afternoon', 'evening', 'close'], Sat: ['afternoon', 'evening', 'close'], Sun: [] } },
  { id: 2, name: 'Marcus Taylor', role: 'Bartender', rate: 13.50, maxHours: 40, availability: { Mon: [], Tue: ['afternoon', 'evening'], Wed: ['afternoon', 'evening'], Thu: ['afternoon', 'evening', 'close'], Fri: ['afternoon', 'evening', 'close'], Sat: ['afternoon', 'evening', 'close'], Sun: ['morning', 'afternoon'] } },
  { id: 3, name: 'Lily Chen', role: 'Floor Manager', rate: 15.00, maxHours: 45, availability: { Mon: ['morning', 'afternoon'], Tue: ['morning', 'afternoon'], Wed: ['morning', 'afternoon', 'evening'], Thu: ['morning', 'afternoon', 'evening'], Fri: ['morning', 'afternoon', 'evening'], Sat: ['morning', 'afternoon'], Sun: ['morning', 'afternoon'] } },
  { id: 4, name: 'Tom Robinson', role: 'Server', rate: 12.00, maxHours: 35, availability: { Mon: ['evening'], Tue: [], Wed: ['afternoon', 'evening'], Thu: ['afternoon', 'evening'], Fri: ['afternoon', 'evening', 'close'], Sat: ['afternoon', 'evening', 'close'], Sun: [] } },
  { id: 5, name: 'Anya Kowalski', role: 'Server', rate: 12.00, maxHours: 35, availability: { Mon: ['morning', 'afternoon'], Tue: ['morning', 'afternoon', 'evening'], Wed: [], Thu: ['afternoon', 'evening'], Fri: ['afternoon', 'evening'], Sat: ['afternoon', 'evening', 'close'], Sun: ['morning', 'afternoon'] } },
  { id: 6, name: 'Jake Patterson', role: 'Server (New)', rate: 11.50, maxHours: 30, availability: { Mon: ['morning', 'afternoon'], Tue: ['morning', 'afternoon'], Wed: ['morning', 'afternoon'], Thu: ['morning', 'afternoon'], Fri: ['afternoon', 'evening'], Sat: ['afternoon', 'evening'], Sun: [] } },
  { id: 7, name: 'Priya Shah', role: 'Barback', rate: 11.00, maxHours: 30, availability: { Mon: [], Tue: ['evening'], Wed: ['afternoon', 'evening'], Thu: ['afternoon', 'evening', 'close'], Fri: ['afternoon', 'evening', 'close'], Sat: ['afternoon', 'evening', 'close'], Sun: ['morning', 'afternoon'] } },
  { id: 8, name: 'Chris Okafor', role: 'KP / Runner', rate: 11.00, maxHours: 35, availability: { Mon: ['morning', 'afternoon'], Tue: ['morning', 'afternoon', 'evening'], Wed: ['morning', 'afternoon', 'evening'], Thu: [], Fri: ['afternoon', 'evening', 'close'], Sat: ['afternoon', 'evening', 'close'], Sun: ['morning', 'afternoon'] } },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Forecast data per day
const dayForecasts = {
  Mon: { covers: 98, revenue: 5400, staffNeeded: 6 },
  Tue: { covers: 88, revenue: 4800, staffNeeded: 6 },
  Wed: { covers: 112, revenue: 6200, staffNeeded: 7 },
  Thu: { covers: 156, revenue: 9200, staffNeeded: 8 },
  Fri: { covers: 182, revenue: 10800, staffNeeded: 10 },
  Sat: { covers: 198, revenue: 12400, staffNeeded: 11 },
  Sun: { covers: 142, revenue: 8600, staffNeeded: 8 },
}

// AI-optimised rota (pre-generated)
const AI_ROTA = {
  Mon: [
    { staffId: 3, shift: 'morning' }, { staffId: 5, shift: 'morning' }, { staffId: 6, shift: 'morning' },
    { staffId: 1, shift: 'afternoon' }, { staffId: 8, shift: 'afternoon' }, { staffId: 4, shift: 'evening' },
  ],
  Tue: [
    { staffId: 3, shift: 'morning' }, { staffId: 5, shift: 'morning' }, { staffId: 6, shift: 'morning' },
    { staffId: 2, shift: 'afternoon' }, { staffId: 8, shift: 'afternoon' }, { staffId: 7, shift: 'evening' },
  ],
  Wed: [
    { staffId: 3, shift: 'morning' }, { staffId: 6, shift: 'morning' },
    { staffId: 1, shift: 'afternoon' }, { staffId: 8, shift: 'afternoon' },
    { staffId: 2, shift: 'evening' }, { staffId: 4, shift: 'evening' }, { staffId: 7, shift: 'evening' },
  ],
  Thu: [
    { staffId: 3, shift: 'morning' }, { staffId: 6, shift: 'morning' },
    { staffId: 1, shift: 'afternoon' }, { staffId: 5, shift: 'afternoon' },
    { staffId: 2, shift: 'evening' }, { staffId: 4, shift: 'evening' }, { staffId: 7, shift: 'evening' }, { staffId: 8, shift: 'close' },
  ],
  Fri: [
    { staffId: 3, shift: 'morning' }, { staffId: 6, shift: 'afternoon' },
    { staffId: 1, shift: 'afternoon' }, { staffId: 5, shift: 'afternoon' },
    { staffId: 2, shift: 'evening' }, { staffId: 4, shift: 'evening' }, { staffId: 7, shift: 'evening' },
    { staffId: 8, shift: 'evening' }, { staffId: 1, shift: 'close' }, { staffId: 2, shift: 'close' },
  ],
  Sat: [
    { staffId: 3, shift: 'morning' },
    { staffId: 1, shift: 'afternoon' }, { staffId: 5, shift: 'afternoon' }, { staffId: 6, shift: 'afternoon' },
    { staffId: 2, shift: 'evening' }, { staffId: 4, shift: 'evening' }, { staffId: 7, shift: 'evening' }, { staffId: 8, shift: 'evening' },
    { staffId: 1, shift: 'close' }, { staffId: 2, shift: 'close' }, { staffId: 7, shift: 'close' },
  ],
  Sun: [
    { staffId: 3, shift: 'morning' }, { staffId: 5, shift: 'morning' }, { staffId: 8, shift: 'morning' },
    { staffId: 2, shift: 'afternoon' }, { staffId: 5, shift: 'afternoon' },
    { staffId: 3, shift: 'afternoon' }, { staffId: 7, shift: 'afternoon' }, { staffId: 8, shift: 'afternoon' },
  ],
}

export default function Scheduling() {
  const [rota, setRota] = useState(AI_ROTA)
  const [selectedCell, setSelectedCell] = useState(null) // { day, shift }
  const [published, setPublished] = useState(false)

  // Calculate labour cost per day
  const labourCosts = useMemo(() => {
    const costs = {}
    DAYS.forEach(day => {
      const dayShifts = rota[day] || []
      let cost = 0
      dayShifts.forEach(s => {
        const staff = STAFF.find(st => st.id === s.staffId)
        if (staff) {
          const shiftHours = s.shift === 'close' ? 8 : 8
          cost += staff.rate * shiftHours
        }
      })
      costs[day] = cost
    })
    return costs
  }, [rota])

  const totalWeeklyLabour = Object.values(labourCosts).reduce((s, c) => s + c, 0)
  const totalWeeklyRevenue = Object.values(dayForecasts).reduce((s, d) => s + d.revenue, 0)
  const labourPercent = ((totalWeeklyLabour / totalWeeklyRevenue) * 100).toFixed(1)

  function toggleAssignment(day, shiftKey, staffId) {
    setRota(prev => {
      const dayShifts = [...(prev[day] || [])]
      const idx = dayShifts.findIndex(s => s.staffId === staffId && s.shift === shiftKey)
      if (idx >= 0) {
        dayShifts.splice(idx, 1)
      } else {
        dayShifts.push({ staffId, shift: shiftKey })
      }
      return { ...prev, [day]: dayShifts }
    })
  }

  function isAssigned(day, shiftKey, staffId) {
    return (rota[day] || []).some(s => s.staffId === staffId && s.shift === shiftKey)
  }

  function isAvailable(day, shiftKey, staffId) {
    const staff = STAFF.find(s => s.id === staffId)
    return staff?.availability[day]?.includes(shiftKey)
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={22} color={C.teal} /> Staff Scheduling AI
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>AI-optimised rota based on forecast covers, availability, and labour budget</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setRota(AI_ROTA)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
            background: 'transparent', border: `1px solid ${C.teal}`, color: C.teal,
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            <Zap size={14} /> AI Optimise
          </button>
          <button onClick={() => setPublished(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
            background: published ? C.greenBg : `linear-gradient(135deg, ${C.teal}, #0D9488)`,
            border: published ? `1px solid ${C.green}` : 'none',
            color: published ? C.green : '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            {published ? <><CheckCircle size={14} /> Published</> : <><Send size={14} /> Publish Rota</>}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        {[
          { icon: PoundSterling, label: 'Weekly Labour Cost', value: `\u00A3${totalWeeklyLabour.toLocaleString()}`, color: C.ink },
          { icon: Percent, label: 'Labour %', value: `${labourPercent}%`, color: parseFloat(labourPercent) <= 30 ? C.green : C.red, sub: 'Target: < 30%' },
          { icon: Users, label: 'Staff Rostered', value: STAFF.length, sub: `${STAFF.filter(s => DAYS.some(d => (rota[d] || []).some(r => r.staffId === s.id))).length} active this week` },
          { icon: Target, label: 'Forecast Covers', value: Object.values(dayForecasts).reduce((s, d) => s + d.covers, 0).toLocaleString(), sub: `\u00A3${(totalWeeklyRevenue / 1000).toFixed(1)}k projected` },
        ].map((k, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <k.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color || C.ink, marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
            {k.sub && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Labour Cost Preview */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Daily Labour Cost vs Revenue</div>
        <div className="grid-7day">
          {DAYS.map(day => {
            const forecast = dayForecasts[day]
            const cost = labourCosts[day]
            const pct = ((cost / forecast.revenue) * 100).toFixed(1)
            const isOver = parseFloat(pct) > 30
            return (
              <div key={day} style={{ background: C.bg, borderRadius: 8, padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>{day}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{'\u00A3'}{cost.toFixed(0)}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>of {'\u00A3'}{(forecast.revenue / 1000).toFixed(1)}k rev</div>
                <div style={{
                  fontSize: 12, fontWeight: 700, marginTop: 4,
                  color: isOver ? C.red : C.green,
                }}>{pct}%</div>
                <div style={{ fontSize: 9, color: C.textDim }}>{forecast.covers} covers</div>
                <div style={{ fontSize: 9, color: forecast.staffNeeded <= (rota[day] || []).length ? C.green : C.red, marginTop: 2 }}>
                  {(rota[day] || []).length}/{forecast.staffNeeded} staff
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Shift Templates Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        {Object.entries(SHIFT_TEMPLATES).map(([key, t]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: t.color }} />
            <span style={{ color: C.textMuted }}>{t.name}</span>
            <span style={{ color: C.textDim }}>({t.hours})</span>
          </div>
        ))}
      </div>

      {/* Rota Grid */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}`, width: 160 }}>Staff</th>
              <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}`, width: 60 }}>Rate</th>
              {DAYS.map(day => (
                <th key={day} style={{ textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{day}</th>
              ))}
              <th style={{ textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {STAFF.map(staff => {
              const weekHours = DAYS.reduce((total, day) => {
                const shifts = (rota[day] || []).filter(s => s.staffId === staff.id)
                return total + shifts.length * 8
              }, 0)
              const overHours = weekHours > staff.maxHours
              return (
                <tr key={staff.id}>
                  <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{staff.name}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{staff.role}</div>
                  </td>
                  <td style={{ padding: '10px 8px', fontSize: 12, color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>
                    {'\u00A3'}{staff.rate.toFixed(2)}/h
                  </td>
                  {DAYS.map(day => {
                    const shifts = (rota[day] || []).filter(s => s.staffId === staff.id)
                    const avail = staff.availability[day] || []
                    return (
                      <td key={day} style={{ padding: '6px 4px', borderBottom: `1px solid ${C.border}`, textAlign: 'center', verticalAlign: 'top' }}>
                        {avail.length === 0 ? (
                          <div style={{ fontSize: 10, color: C.textDim, padding: 4 }}>OFF</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {Object.entries(SHIFT_TEMPLATES).map(([shiftKey, tmpl]) => {
                              if (!avail.includes(shiftKey)) return null
                              const assigned = isAssigned(day, shiftKey, staff.id)
                              return (
                                <button
                                  key={shiftKey}
                                  onClick={() => toggleAssignment(day, shiftKey, staff.id)}
                                  style={{
                                    padding: '3px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                                    border: `1px solid ${assigned ? tmpl.color : C.border}`,
                                    background: assigned ? tmpl.bg : 'transparent',
                                    color: assigned ? tmpl.color : C.textDim,
                                    cursor: 'pointer', textTransform: 'uppercase',
                                  }}
                                >
                                  {tmpl.name.substring(0, 3)}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    )
                  })}
                  <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: overHours ? C.red : weekHours > 0 ? C.ink : C.textDim,
                    }}>{weekHours}h</span>
                    {overHours && (
                      <div style={{ fontSize: 9, color: C.red }}>Max {staff.maxHours}h</div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
