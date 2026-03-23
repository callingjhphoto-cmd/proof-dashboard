import { useState } from 'react'
import { Calendar, AlertTriangle, UserPlus, Clock, Users } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const days = ['Mon 17', 'Tue 18', 'Wed 19', 'Thu 20', 'Fri 21', 'Sat 22', 'Sun 23']
const staff = [
  { name: 'Sarah M.', role: 'Bar Lead', rate: 16.50 },
  { name: 'Marcus T.', role: 'Bartender', rate: 13.50 },
  { name: 'Ben H.', role: 'Bartender', rate: 13.50 },
  { name: 'Lily C.', role: 'Floor Mgr', rate: 15.00 },
  { name: 'Tom R.', role: 'Server', rate: 12.00 },
  { name: 'Anya K.', role: 'Server', rate: 12.00 },
  { name: 'Priya P.', role: 'Server', rate: 12.00 },
  { name: 'Jake W.', role: 'Kitchen Porter', rate: 11.50 },
]

const shifts = {
  'Sarah M.': ['14-23', '14-23', '14-23', '14-23', '12-23', '12-23', 'OFF'],
  'Marcus T.': ['16-23', 'OFF', '16-23', '16-23', '14-23', '14-23', '16-23'],
  'Ben H.': ['OFF', '16-23', 'OFF', '16-23', '14-23', '14-23', 'OFF'],
  'Lily C.': ['11-20', '11-20', '11-20', '11-20', '11-22', '11-22', 'OFF'],
  'Tom R.': ['17-23', 'OFF', '17-23', '17-23', '14-23', '14-23', '17-23'],
  'Anya K.': ['17-23', '17-23', 'OFF', '17-23', '14-23', '14-23', 'OFF'],
  'Priya P.': ['OFF', '17-23', '17-23', 'OFF', '14-23', '14-23', '17-23'],
  'Jake W.': ['10-18', '10-18', '10-18', '10-18', '10-20', '10-20', 'OFF'],
}

const coversForecast = [85, 72, 95, 108, 142, 155, 92]
const staffPerDay = days.map((_, di) => staff.filter(s => shifts[s.name][di] !== 'OFF').length)

const gapAlerts = [
  { day: 'Tue 18', issue: 'Only 4 floor staff for 72 covers. Below minimum 5 for service quality.', severity: 'warning' },
  { day: 'Fri 21', issue: '142 covers booked. All hands on deck. Confirm availability with all staff.', severity: 'info' },
]

export default function Rota() {
  const [selectedDay, setSelectedDay] = useState(1) // Tuesday (today)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Rota Management
      </div>

      {/* Alerts */}
      {gapAlerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {gapAlerts.map((a, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8,
              background: a.severity === 'warning' ? C.orangeBg : 'rgba(59,130,246,0.08)',
              borderLeft: `3px solid ${a.severity === 'warning' ? C.orange : C.blue}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <AlertTriangle size={14} color={a.severity === 'warning' ? C.orange : C.blue} />
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{a.day}:</span>
                <span style={{ fontSize: 12, color: C.text, marginLeft: 6 }}>{a.issue}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 20 }}>
        {days.map((day, i) => {
          const isToday = i === 1
          const isSelected = selectedDay === i
          const staffCount = staffPerDay[i]
          const coversNeeded = Math.ceil(coversForecast[i] / 20) // rough: 1 staff per 20 covers
          const isShort = staffCount < coversNeeded + 2

          return (
            <div
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: 12, borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                background: isSelected ? C.amberBg : isToday ? 'rgba(20,184,166,0.06)' : C.card,
                border: `1px solid ${isSelected ? C.amber : isToday ? C.teal + '40' : C.border}`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? C.amber : isToday ? C.teal : C.ink }}>{day}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: '4px 0' }}>{staffCount}</div>
              <div style={{ fontSize: 10, color: isShort ? C.red : C.textDim }}>{isShort ? 'Short!' : 'staff'}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{coversForecast[i]} cvrs</div>
            </div>
          )
        })}
      </div>

      {/* Rota Grid */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Weekly Rota</div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
            background: C.teal + '15', border: `1px solid ${C.teal}30`, color: C.teal,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            <UserPlus size={14} /> Request Cover
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase', width: 140 }}>Staff</th>
              {days.map((d, i) => (
                <th key={i} style={{
                  padding: '8px 6px', textAlign: 'center', fontSize: 10, textTransform: 'uppercase',
                  color: selectedDay === i ? C.amber : C.textDim, fontWeight: selectedDay === i ? 700 : 500,
                }}>{d}</th>
              ))}
              <th style={{ padding: '8px 10px', textAlign: 'right', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, si) => {
              const staffShifts = shifts[s.name]
              const totalHours = staffShifts.reduce((sum, sh) => {
                if (sh === 'OFF') return sum
                const [start, end] = sh.split('-').map(Number)
                return sum + (end - start)
              }, 0)

              return (
                <tr key={si} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px', color: C.ink, fontWeight: 500 }}>
                    <div>{s.name}</div>
                    <div style={{ fontSize: 10, color: C.textDim }}>{s.role}</div>
                  </td>
                  {staffShifts.map((sh, di) => {
                    const isOff = sh === 'OFF'
                    const isSelected2 = selectedDay === di
                    return (
                      <td key={di} style={{
                        padding: '6px 4px', textAlign: 'center',
                        background: isSelected2 ? 'rgba(212,168,83,0.04)' : 'transparent',
                      }}>
                        <div style={{
                          padding: '6px 4px', borderRadius: 6, fontSize: 11,
                          background: isOff ? 'transparent' : C.teal + '12',
                          color: isOff ? C.textDim : C.teal,
                          fontWeight: isOff ? 400 : 600,
                          fontFamily: isOff ? 'inherit' : "'JetBrains Mono', monospace",
                        }}>
                          {isOff ? '\u2014' : sh}
                        </div>
                      </td>
                    )
                  })}
                  <td style={{ padding: '10px', textAlign: 'right', color: C.amber, fontWeight: 600 }}>
                    {totalHours}h
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid ${C.border}` }}>
              <td style={{ padding: '10px', color: C.textDim, fontWeight: 600, fontSize: 11 }}>TOTAL STAFF</td>
              {staffPerDay.map((count, i) => (
                <td key={i} style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: C.ink }}>{count}</td>
              ))}
              <td style={{ padding: '10px', textAlign: 'right', color: C.amber, fontWeight: 700 }}>
                {staff.reduce((sum, s) => {
                  return sum + shifts[s.name].reduce((sh, v) => {
                    if (v === 'OFF') return sh
                    const [start, end] = v.split('-').map(Number)
                    return sh + (end - start)
                  }, 0)
                }, 0)}h
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
