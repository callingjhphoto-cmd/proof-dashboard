import { useState, useEffect } from 'react'
import { Clock, MapPin, Wifi, Check, Play, Square } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const recentClocks = [
  { date: 'Mon 17 Mar', clockIn: '15:58', clockOut: '23:04', hours: '7h 06m', status: 'complete' },
  { date: 'Sun 16 Mar', clockIn: '15:55', clockOut: '23:02', hours: '7h 07m', status: 'complete' },
  { date: 'Sat 15 Mar', clockIn: '13:52', clockOut: '23:15', hours: '9h 23m', status: 'complete' },
  { date: 'Fri 14 Mar', clockIn: '13:58', clockOut: '23:08', hours: '9h 10m', status: 'complete' },
  { date: 'Thu 13 Mar', clockIn: '16:02', clockOut: '23:01', hours: '6h 59m', status: 'complete' },
]

export default function ClockInOut() {
  const [clockedIn, setClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (clockedIn && clockInTime) {
        setElapsed(Math.floor((Date.now() - clockInTime) / 1000))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [clockedIn, clockInTime])

  const handleClockIn = () => {
    setClockedIn(true)
    setClockInTime(Date.now())
    setElapsed(0)
  }

  const handleClockOut = () => {
    setClockedIn(false)
    setClockInTime(null)
  }

  const formatElapsed = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const timeStr = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Clock In / Out
      </div>

      {/* Big Clock */}
      <div style={{
        background: C.card, border: `1px solid ${clockedIn ? C.green + '60' : C.border}`,
        borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 20,
      }}>
        <div style={{
          fontSize: 48, fontWeight: 800, color: C.ink, letterSpacing: '-1px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>{timeStr}</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>
          Tuesday 18 March 2026
        </div>

        {/* GPS / WiFi verification */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6,
            background: C.greenBg, fontSize: 12, color: C.green,
          }}>
            <Wifi size={14} /> Venue WiFi Connected
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6,
            background: C.greenBg, fontSize: 12, color: C.green,
          }}>
            <MapPin size={14} /> GPS Verified
          </div>
        </div>

        {clockedIn ? (
          <>
            <div style={{ fontSize: 14, color: C.green, fontWeight: 600, marginBottom: 8 }}>
              <Check size={16} style={{ verticalAlign: 'middle' }} /> Clocked in
            </div>
            <div style={{
              fontSize: 36, fontWeight: 700, color: C.ink, marginBottom: 20,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {formatElapsed(elapsed)}
            </div>
            <button
              onClick={handleClockOut}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 40px', borderRadius: 12, border: 'none',
                background: C.red, color: '#fff',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Square size={18} /> Clock Out
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>
              Scheduled: 16:00 - 23:00
            </div>
            <button
              onClick={handleClockIn}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 40px', borderRadius: 12, border: 'none',
                background: C.green, color: '#fff',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                transition: 'transform 0.1s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Play size={18} /> Clock In
            </button>
          </>
        )}
      </div>

      {/* This Week Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20,
      }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Hours This Week</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>7h 06m</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>of 46h scheduled</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Punctuality</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>98%</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Last 30 days</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Avg Shift Length</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>7h 49m</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Last 4 weeks</div>
        </div>
      </div>

      {/* Recent History */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Recent Clock History</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Date', 'Clock In', 'Clock Out', 'Total Hours'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentClocks.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px', color: C.ink, fontWeight: 500 }}>{c.date}</td>
                <td style={{ padding: '10px', color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>{c.clockIn}</td>
                <td style={{ padding: '10px', color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>{c.clockOut}</td>
                <td style={{ padding: '10px', color: C.blue, fontWeight: 600 }}>{c.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
