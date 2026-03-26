import { useState, useEffect } from 'react'
import { TrendingUp, PoundSterling, Users, Clock, Zap, UtensilsCrossed } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', blue: '#3B82F6', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const hourlyData = [
  { hour: '11:00', revenue: 420, covers: 8 },
  { hour: '12:00', revenue: 1180, covers: 22 },
  { hour: '13:00', revenue: 1640, covers: 31 },
  { hour: '14:00', revenue: 980, covers: 18 },
  { hour: '15:00', revenue: 520, covers: 9 },
  { hour: '16:00', revenue: 380, covers: 6 },
  { hour: '17:00', revenue: 720, covers: 14 },
  { hour: '18:00', revenue: 1450, covers: 28 },
  { hour: '19:00', revenue: 2100, covers: 38 },
  { hour: '20:00', revenue: 2480, covers: 42 },
]

const recentTransactions = [
  { time: '20:14', table: 'T12', items: 'Espresso Martini x2, Negroni', amount: 39.00, staff: 'Marcus T.' },
  { time: '20:12', table: 'T8', items: 'G&T (Hendricks), House Red x2', amount: 35.50, staff: 'Anya K.' },
  { time: '20:09', table: 'T15', items: 'Old Fashioned, Whiskey Sour', amount: 27.00, staff: 'Marcus T.' },
  { time: '20:06', table: 'T3', items: 'Champagne (btl), Espresso Martini x3', amount: 98.00, staff: 'Sarah M.' },
  { time: '20:02', table: 'Bar', items: 'House Lager x4, Aperol Spritz x2', amount: 46.00, staff: 'Ben H.' },
  { time: '19:58', table: 'T6', items: 'Margarita x2, Cosmopolitan', amount: 42.00, staff: 'Tom R.' },
]

const topSelling = [
  { item: 'Espresso Martini', count: 14, revenue: 182 },
  { item: 'Negroni', count: 9, revenue: 117 },
  { item: 'G&T (Hendricks)', count: 8, revenue: 96 },
  { item: 'House Lager', count: 12, revenue: 72 },
  { item: 'Old Fashioned', count: 7, revenue: 98 },
]

export default function LiveTrading() {
  const [totalRevenue, setTotalRevenue] = useState(11870)
  const [liveCovers, setLiveCovers] = useState(216)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalRevenue(prev => prev + Math.floor(Math.random() * 25 + 5))
      setPulse(true)
      setTimeout(() => setPulse(false), 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const rpc = (totalRevenue / liveCovers).toFixed(2)
  const targetRevenue = 14500
  const pctTarget = ((totalRevenue / targetRevenue) * 100).toFixed(0)

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, fontFamily: 'Georgia, serif' }}>
          Live Trading
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
          background: C.greenBg, border: `1px solid ${C.green}30`,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: C.green,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Big Revenue Number */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Today&apos;s Revenue</div>
        <div style={{
          fontSize: 52, fontWeight: 800, color: C.ink, letterSpacing: '-2px',
          fontFamily: "'JetBrains Mono', monospace",
          transition: 'color 0.3s',
          ...(pulse ? { color: C.teal } : {}),
        }}>
          {'\u00a3'}{totalRevenue.toLocaleString()}
        </div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 12 }}>
          <span style={{ color: C.textMuted }}>{liveCovers} covers</span>
          <span style={{ color: C.amber }}>{'\u00a3'}{rpc}/cover</span>
          <span style={{ color: parseInt(pctTarget) >= 80 ? C.green : C.orange }}>{pctTarget}% of {'\u00a3'}{targetRevenue.toLocaleString()} target</span>
        </div>
        <div style={{ height: 6, background: '#1E1E21', borderRadius: 3, overflow: 'hidden', marginTop: 14, maxWidth: 400, margin: '14px auto 0' }}>
          <div style={{
            height: '100%', width: `${Math.min(parseInt(pctTarget), 100)}%`, borderRadius: 3,
            background: `linear-gradient(90deg, ${C.teal}, ${C.green})`, transition: 'width 1s',
          }} />
        </div>
      </div>

      <div className="grid-2col-sidebar" style={{ marginBottom: 16 }}>
        {/* Hourly Revenue */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Revenue by Hour</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.teal} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00a3${v}`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                formatter={v => [`\u00a3${v}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke={C.teal} strokeWidth={2} fill="url(#tealGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Top Selling Right Now</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topSelling.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{item.item}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{item.count} sold today</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{'\u00a3'}{item.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Recent Transactions</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Time', 'Table', 'Items', 'Amount', 'Staff'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px', color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{t.time}</td>
                <td style={{ padding: '10px', color: C.ink, fontWeight: 600 }}>{t.table}</td>
                <td style={{ padding: '10px', color: C.text }}>{t.items}</td>
                <td style={{ padding: '10px', color: C.teal, fontWeight: 600 }}>{'\u00a3'}{t.amount.toFixed(2)}</td>
                <td style={{ padding: '10px', color: C.textMuted }}>{t.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
