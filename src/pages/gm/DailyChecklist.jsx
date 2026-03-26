import { useState } from 'react'
import { ClipboardCheck, Clock, AlertCircle, CheckCircle, Circle } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const openingChecks = [
  { id: 1, task: 'Check floor and bar area cleanliness', required: true },
  { id: 2, task: 'Verify POS system is operational', required: true },
  { id: 3, task: 'Confirm all bookings for today (108 covers)', required: true },
  { id: 4, task: 'Review yesterday\'s close-out notes', required: true },
  { id: 5, task: 'Check cold room temperatures (must be 1-4°C)', required: true },
  { id: 6, task: 'Verify ice machine is full', required: false },
  { id: 7, task: 'Set up bar garnish station', required: false },
  { id: 8, task: 'Brief staff on today\'s specials', required: true },
  { id: 9, task: 'Check toilet supplies', required: false },
  { id: 10, task: 'Test fire alarm panel', required: true },
]

const closingChecks = [
  { id: 11, task: 'Cash up all tills and reconcile', required: true },
  { id: 12, task: 'Complete stock count for spirits', required: true },
  { id: 13, task: 'Log any incidents or complaints', required: true },
  { id: 14, task: 'Check all fridges are closed and locked', required: true },
  { id: 15, task: 'Set alarm system', required: true },
  { id: 16, task: 'Lock all doors and windows', required: true },
  { id: 17, task: 'Complete staff sign-out sheet', required: false },
  { id: 18, task: 'Submit daily takings report', required: true },
]

export default function DailyChecklist() {
  const [checked, setChecked] = useState(new Set([1, 2, 3, 4, 5, 8]))
  const [incidents, setIncidents] = useState([
    { time: '19:45', note: 'Customer complaint about wait time on table 12. Offered complimentary dessert. Resolved.' },
  ])
  const [newIncident, setNewIncident] = useState('')

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addIncident = () => {
    if (!newIncident.trim()) return
    const now = new Date()
    setIncidents(prev => [...prev, {
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      note: newIncident
    }])
    setNewIncident('')
  }

  const openingDone = openingChecks.filter(c => checked.has(c.id)).length
  const closingDone = closingChecks.filter(c => checked.has(c.id)).length

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Daily Checklist
      </div>

      <div className="grid-kpi-3" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Opening Complete</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: openingDone === openingChecks.length ? C.green : C.amber }}>
            {openingDone}/{openingChecks.length}
          </div>
          <div style={{ height: 4, background: '#1E1E21', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(openingDone / openingChecks.length) * 100}%`, background: C.teal, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Closing Complete</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: closingDone === closingChecks.length ? C.green : C.textDim }}>
            {closingDone}/{closingChecks.length}
          </div>
          <div style={{ height: 4, background: '#1E1E21', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(closingDone / closingChecks.length) * 100}%`, background: C.teal, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Incidents Today</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: incidents.length > 0 ? C.orange : C.green }}>
            {incidents.length}
          </div>
        </div>
      </div>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        {/* Opening */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardCheck size={16} color={C.teal} /> Opening Checks
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {openingChecks.map(c => {
              const isDone = checked.has(c.id)
              return (
                <div
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                    background: isDone ? C.greenBg : 'transparent', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  {isDone ?
                    <CheckCircle size={18} color={C.green} /> :
                    <Circle size={18} color={C.textDim} />
                  }
                  <span style={{
                    fontSize: 13, color: isDone ? C.green : C.text,
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>{c.task}</span>
                  {c.required && !isDone && (
                    <span style={{ fontSize: 9, color: C.red, marginLeft: 'auto', fontWeight: 600, textTransform: 'uppercase' }}>Required</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Closing */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardCheck size={16} color={C.amber} /> Closing Checks
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {closingChecks.map(c => {
              const isDone = checked.has(c.id)
              return (
                <div
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                    background: isDone ? C.greenBg : 'transparent', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  {isDone ?
                    <CheckCircle size={18} color={C.green} /> :
                    <Circle size={18} color={C.textDim} />
                  }
                  <span style={{
                    fontSize: 13, color: isDone ? C.green : C.text,
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>{c.task}</span>
                  {c.required && !isDone && (
                    <span style={{ fontSize: 9, color: C.red, marginLeft: 'auto', fontWeight: 600, textTransform: 'uppercase' }}>Required</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* EHO Readiness */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} color={C.green} /> EHO Readiness Score
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>94%</div>
          <div>
            <div style={{ fontSize: 12, color: C.text }}>Ready for inspection</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Last EHO visit: 14 Jan 2026 (Rating: 5/5)</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { area: 'Food Safety (HACCP)', score: 100, status: 'All logs current' },
            { area: 'Allergen Records', score: 95, status: '1 update pending' },
            { area: 'Temperature Logs', score: 88, status: 'Cold room logged at 09:15' },
          ].map((a, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{a.area}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: a.score >= 95 ? C.green : a.score >= 80 ? C.amber : C.red }}>{a.score}%</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{a.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Log */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} color={C.orange} /> Incident Log
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            value={newIncident}
            onChange={e => setNewIncident(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addIncident()}
            placeholder="Log an incident..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
              background: C.bg, color: C.text, fontSize: 13, outline: 'none',
            }}
          />
          <button onClick={addIncident} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: C.teal, color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Log</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {incidents.map((inc, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8, background: C.orangeBg,
              borderLeft: `3px solid ${C.orange}`,
            }}>
              <span style={{ fontSize: 11, color: C.orange, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{inc.time}</span>
              <span style={{ fontSize: 12, color: C.text, marginLeft: 10 }}>{inc.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
