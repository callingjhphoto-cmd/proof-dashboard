import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { Users, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', red: '#EF4444', orange: '#F97316', blue: '#3B82F6', purple: '#A855F7',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const weeklyData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  chelsea: 28 + Math.random() * 8,
  soho: 25 + Math.random() * 7,
  city: 30 + Math.random() * 8,
  tower: 32 + Math.random() * 8,
  kensington: 26 + Math.random() * 6,
  target: 30,
}))

const venueLabourData = [
  { name: 'Chelsea Garden', current: 31.5, prev: 29.8, target: 30, staff: 12, cost: 52920, trend: 'up' },
  { name: 'Soho Brasserie', current: 28.3, prev: 30.1, target: 30, staff: 15, cost: 55185, trend: 'down' },
  { name: 'City Garden', current: 33.8, prev: 31.2, target: 30, staff: 10, cost: 48000, trend: 'up' },
  { name: 'Tower Bridge', current: 36.2, prev: 34.5, target: 30, staff: 9, cost: 42696, trend: 'up' },
  { name: 'Kensington', current: 29.1, prev: 29.5, target: 30, staff: 13, cost: 52962, trend: 'down' },
]

const alerts = [
  { venue: 'Tower Bridge', severity: 'critical', message: 'Labour at 36.2% — 6.2pts above target. Consistently trending high for 4 weeks. Review rota immediately.' },
  { venue: 'City Garden', severity: 'warning', message: 'Labour at 33.8% — 3.8pts above target. Driven by overtime hours. Consider hiring one additional part-time server.' },
  { venue: 'Chelsea Garden', severity: 'info', message: 'Labour at 31.5% — marginally above target. Friday\'s 142-cover booking offset. Monitor next week.' },
]

const sevColors = { critical: C.red, warning: C.orange, info: C.blue }
const sevBg = { critical: 'rgba(239,68,68,0.08)', warning: 'rgba(249,115,22,0.08)', info: 'rgba(59,130,246,0.08)' }

export default function LabourTrends() {
  const avgLabour = (venueLabourData.reduce((s, v) => s + v.current, 0) / venueLabourData.length).toFixed(1)
  const totalCost = venueLabourData.reduce((s, v) => s + v.cost, 0)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Labour Cost Intelligence
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Avg Labour %</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: parseFloat(avgLabour) > 30 ? C.orange : C.green }}>{avgLabour}%</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Target: 30%</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Total Labour Cost</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{`£${(totalCost / 1000).toFixed(0)}k`}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>This month across 5 venues</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Venues Above Target</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.red }}>{venueLabourData.filter(v => v.current > v.target).length}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>of {venueLabourData.length} venues</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Total Headcount</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{venueLabourData.reduce((s, v) => s + v.staff, 0)}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Active staff members</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Labour % by Venue &mdash; Last 12 Weeks</div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
            <XAxis dataKey="week" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
            <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} domain={[20, 42]} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
              formatter={v => [`${v.toFixed(1)}%`, '']} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="target" stroke={C.amber} strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
            <Line type="monotone" dataKey="chelsea" stroke={C.green} strokeWidth={2} dot={{ r: 2 }} name="Chelsea" />
            <Line type="monotone" dataKey="soho" stroke={C.blue} strokeWidth={2} dot={{ r: 2 }} name="Soho" />
            <Line type="monotone" dataKey="city" stroke={C.orange} strokeWidth={2} dot={{ r: 2 }} name="City" />
            <Line type="monotone" dataKey="tower" stroke={C.red} strokeWidth={2} dot={{ r: 2 }} name="Tower Bridge" />
            <Line type="monotone" dataKey="kensington" stroke={C.purple} strokeWidth={2} dot={{ r: 2 }} name="Kensington" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2col">
        {/* Venue Breakdown */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Venue-by-Venue Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {venueLabourData.map((v, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{v.name}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: v.current > v.target + 3 ? C.red : v.current > v.target ? C.orange : C.green,
                  }}>{v.current}%</span>
                </div>
                <div style={{ height: 4, background: '#1E1E21', borderRadius: 2, overflow: 'hidden', position: 'relative', marginBottom: 6 }}>
                  <div style={{
                    height: '100%', width: `${(v.current / 40) * 100}%`, borderRadius: 2,
                    background: v.current > v.target + 3 ? C.red : v.current > v.target ? C.orange : C.green,
                  }} />
                  <div style={{
                    position: 'absolute', left: `${(v.target / 40) * 100}%`, top: -2, width: 2, height: 8,
                    background: C.amber, borderRadius: 1,
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textDim }}>
                  <span>{v.staff} staff &bull; £{(v.cost / 1000).toFixed(0)}k cost</span>
                  <span style={{ color: v.trend === 'up' ? C.red : C.green, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {v.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    vs last month: {v.prev}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Labour Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 8, background: sevBg[a.severity],
                borderLeft: `3px solid ${sevColors[a.severity]}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: sevColors[a.severity], marginBottom: 4 }}>
                  <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {a.venue}
                </div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{a.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
