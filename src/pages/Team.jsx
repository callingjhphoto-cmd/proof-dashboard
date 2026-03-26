import { useNavigate } from 'react-router-dom'
import { Users, Clock, AlertCircle, PoundSterling } from 'lucide-react'
import { STAFF_DB } from './StaffProfile'

const team = STAFF_DB.map(s => ({
  id: s.id,
  name: s.name,
  role: s.role,
  rate: s.rate,
  scheduledHrs: s.contractedHrs,
  workedHrs: s.weeklyHours,
  status: s.status,
  shift: s.shift,
}))

const rota = [
  { day: 'Mon', staff: ['Sarah', 'Marcus', 'Lily', 'Tom', 'Anya'], covers: 85, labourCost: 892 },
  { day: 'Tue', staff: ['Sarah', 'Ben', 'Lily', 'Priya'], covers: 72, labourCost: 756 },
  { day: 'Wed', staff: ['Sarah', 'Marcus', 'Lily', 'Tom', 'Anya', 'Ben'], covers: 95, labourCost: 1044 },
  { day: 'Thu', staff: ['Sarah', 'Marcus', 'Lily', 'Tom', 'Anya', 'Priya'], covers: 108, labourCost: 1098 },
  { day: 'Fri', staff: ['Sarah', 'Marcus', 'Ben', 'Lily', 'Tom', 'Anya', 'Priya', 'Jake'], covers: 142, labourCost: 1420 },
  { day: 'Sat', staff: ['Sarah', 'Marcus', 'Ben', 'Lily', 'Tom', 'Anya', 'Priya', 'Jake'], covers: 155, labourCost: 1480 },
  { day: 'Sun', staff: ['Sarah', 'Marcus', 'Lily', 'Tom', 'Priya'], covers: 92, labourCost: 936 },
]

const statusColor = { 'on-shift': '#22C55E', ending: '#F97316', upcoming: '#3B82F6', off: '#333' }
const statusLabel = { 'on-shift': 'On Shift', ending: 'Ending Soon', upcoming: 'Starting', off: 'Off' }

function Card({ title, children, C, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {title && <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  )
}

export default function Team({ C }) {
  const navigate = useNavigate()
  const totalScheduled = team.reduce((s, t) => s + t.scheduledHrs, 0)
  const totalWorked = team.reduce((s, t) => s + t.workedHrs, 0)
  const totalLabourCost = team.reduce((s, t) => s + t.workedHrs * t.rate, 0)
  const weeklyLabourForecast = rota.reduce((s, d) => s + d.labourCost, 0)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Team &amp; Scheduling
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'On Shift Now', value: team.filter(t => t.status === 'on-shift').length.toString(), icon: Users, color: '#22C55E' },
          { label: 'Hours This Week', value: `${totalWorked}/${totalScheduled}`, icon: Clock, color: C.ink },
          { label: 'Labour Cost WTD', value: `£${totalLabourCost.toLocaleString('en', { maximumFractionDigits: 0 })}`, icon: PoundSterling, color: C.amber },
          { label: 'Weekly Forecast', value: `£${weeklyLabourForecast.toLocaleString()}`, icon: AlertCircle, color: C.blue },
        ].map((kpi, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <kpi.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color, marginTop: 8 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Team List */}
      <Card title="Team Status" C={C} style={{ marginBottom: 16 }}>
        <div className="grid-kpi-4">
          {team.map((t, i) => (
            <div key={i} onClick={() => navigate(`/staff/${t.id}`)} style={{
              padding: '14px 16px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${statusColor[t.status]}`, cursor: 'pointer', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{t.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t.role} {'\u2022'} £{t.rate.toFixed(2)}/hr</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
                <span style={{ color: statusColor[t.status] }}>{statusLabel[t.status]}</span>
                <span style={{ color: C.textDim }}>{t.shift}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textDim, marginBottom: 3 }}>
                  <span>{t.workedHrs}h worked</span>
                  <span>{t.scheduledHrs}h scheduled</span>
                </div>
                <div style={{ height: 3, background: '#1E1E21', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(t.workedHrs / t.scheduledHrs) * 100}%`,
                    background: t.workedHrs / t.scheduledHrs > 0.95 ? C.amber : C.blue, borderRadius: 2,
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Rota */}
      <Card title="This Week's Rota" C={C}>
        <div className="grid-7day">
          {rota.map((day, i) => {
            const isToday = day.day === 'Mon'
            return (
              <div key={i} style={{
                padding: 12, borderRadius: 8, textAlign: 'center',
                background: isToday ? C.amberBg : C.bg, border: `1px solid ${isToday ? C.amber : C.border}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isToday ? C.amber : C.ink }}>{day.day}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: '6px 0' }}>{day.staff.length}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>staff</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{day.covers} covers</div>
                <div style={{ fontSize: 11, color: C.amber, marginTop: 2 }}>£{day.labourCost}</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
