import { Calendar, Clock, MapPin, Sun, Cloud } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  orange: '#F97316', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const thisWeek = [
  { day: 'Mon 17', shift: '16:00-23:00', hours: 7, status: 'completed', tips: 42, covers: 18 },
  { day: 'Tue 18', shift: '16:00-23:00', hours: 7, status: 'today', tips: null, covers: null },
  { day: 'Wed 19', shift: 'OFF', hours: 0, status: 'off' },
  { day: 'Thu 20', shift: '16:00-23:00', hours: 7, status: 'upcoming', tips: null, covers: null },
  { day: 'Fri 21', shift: '14:00-23:00', hours: 9, status: 'upcoming', tips: null, covers: null },
  { day: 'Sat 22', shift: '14:00-23:00', hours: 9, status: 'upcoming', tips: null, covers: null },
  { day: 'Sun 23', shift: '16:00-23:00', hours: 7, status: 'upcoming', tips: null, covers: null },
]

const nextWeek = [
  { day: 'Mon 24', shift: 'OFF', hours: 0, status: 'off' },
  { day: 'Tue 25', shift: '16:00-23:00', hours: 7, status: 'upcoming' },
  { day: 'Wed 26', shift: '16:00-23:00', hours: 7, status: 'upcoming' },
  { day: 'Thu 27', shift: 'OFF', hours: 0, status: 'off' },
  { day: 'Fri 28', shift: '14:00-23:00', hours: 9, status: 'upcoming' },
  { day: 'Sat 29', shift: '14:00-23:00', hours: 9, status: 'upcoming' },
  { day: 'Sun 30', shift: '16:00-23:00', hours: 7, status: 'upcoming' },
]

const statusConfig = {
  completed: { color: C.green, bg: C.greenBg, label: 'Done' },
  today: { color: C.blue, bg: C.blueBg, label: 'Today' },
  upcoming: { color: C.textMuted, bg: 'transparent', label: '' },
  off: { color: C.textDim, bg: 'transparent', label: 'Day Off' },
}

export default function MyShifts() {
  const totalHoursThisWeek = thisWeek.reduce((s, d) => s + d.hours, 0)
  const totalHoursNextWeek = nextWeek.reduce((s, d) => s + d.hours, 0)
  const earnedThisWeek = totalHoursThisWeek * 13.50
  const today = thisWeek.find(d => d.status === 'today')

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        My Shifts
      </div>

      {/* Today's Shift Highlight */}
      {today && (
        <div style={{
          background: `linear-gradient(135deg, ${C.blue}15, ${C.blue}08)`,
          border: `1px solid ${C.blue}40`, borderRadius: 14, padding: 20, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: C.blue, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Today&apos;s Shift</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{today.shift}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
                {today.hours} hours &bull; The Ivy Chelsea Garden &bull; Bar
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>Estimated Pay</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.blue }}>{'\u00a3'}{(today.hours * 13.50).toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>This Week</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{totalHoursThisWeek}h</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{thisWeek.filter(d => d.status !== 'off').length} shifts</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Next Week</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{totalHoursNextWeek}h</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{nextWeek.filter(d => d.status !== 'off').length} shifts</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Est. Earnings</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{'\u00a3'}{earnedThisWeek.toFixed(0)}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>This week</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Holiday Left</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>14</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>of 28 days</div>
        </div>
      </div>

      {/* This Week Calendar */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>This Week</div>
        <div className="grid-7day">
          {thisWeek.map((d, i) => {
            const sc = statusConfig[d.status]
            const isOff = d.status === 'off'
            return (
              <div key={i} style={{
                padding: 14, borderRadius: 10, textAlign: 'center',
                background: d.status === 'today' ? sc.bg : C.bg,
                border: `1px solid ${d.status === 'today' ? C.blue : C.border}`,
                opacity: isOff ? 0.5 : 1,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: d.status === 'today' ? C.blue : C.ink }}>{d.day}</div>
                {isOff ? (
                  <div style={{ fontSize: 12, color: C.textDim, marginTop: 10 }}>OFF</div>
                ) : (
                  <>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{d.shift.split('-')[0]}</div>
                    <div style={{ fontSize: 10, color: C.textDim }}>{d.shift.split('-')[1]}</div>
                    <div style={{ fontSize: 11, color: sc.color, marginTop: 6 }}>{d.hours}h</div>
                    {d.tips !== null && (
                      <div style={{ fontSize: 11, color: C.amber, marginTop: 2 }}>+{'\u00a3'}{d.tips} tips</div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Next Week */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Next Week</div>
        <div className="grid-7day">
          {nextWeek.map((d, i) => {
            const isOff = d.status === 'off'
            return (
              <div key={i} style={{
                padding: 14, borderRadius: 10, textAlign: 'center',
                background: C.bg, border: `1px solid ${C.border}`, opacity: isOff ? 0.5 : 1,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{d.day}</div>
                {isOff ? (
                  <div style={{ fontSize: 12, color: C.textDim, marginTop: 10 }}>OFF</div>
                ) : (
                  <>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{d.shift.split('-')[0]}</div>
                    <div style={{ fontSize: 10, color: C.textDim }}>{d.shift.split('-')[1]}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{d.hours}h</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
