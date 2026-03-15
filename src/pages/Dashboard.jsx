import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Users, UtensilsCrossed, AlertTriangle, Clock, Percent, PoundSterling } from 'lucide-react'

const revenueData = [
  { day: 'Mon', thisWeek: 5200, lastWeek: 4800 },
  { day: 'Tue', thisWeek: 4100, lastWeek: 4500 },
  { day: 'Wed', thisWeek: 6300, lastWeek: 5200 },
  { day: 'Thu', thisWeek: 7100, lastWeek: 6800 },
  { day: 'Fri', thisWeek: 9800, lastWeek: 8900 },
  { day: 'Sat', thisWeek: 11200, lastWeek: 10100 },
  { day: 'Sun', thisWeek: 6800, lastWeek: 6200 },
]

const alerts = [
  { severity: 'warning', text: 'Labour at 34% \u2014 4% above weekly target', time: '2h ago' },
  { severity: 'critical', text: 'Low stock: Hendricks Gin (2 bottles remaining)', time: '1h ago' },
  { severity: 'info', text: 'Friday booking: 142 covers (18% above avg)', time: '4h ago' },
  { severity: 'success', text: 'GP% trending up: 68.2% vs 66.5% last week', time: '6h ago' },
]

const shift = [
  { name: 'Sarah M.', role: 'Bar Lead', hours: '14:00\u201323:00', status: 'on' },
  { name: 'Marcus T.', role: 'Bartender', hours: '16:00\u201323:00', status: 'on' },
  { name: 'Lily C.', role: 'Floor Mgr', hours: '11:00\u201320:00', status: 'ending' },
  { name: 'Tom R.', role: 'Server', hours: '17:00\u201323:00', status: 'upcoming' },
  { name: 'Anya K.', role: 'Server', hours: '17:00\u201323:00', status: 'upcoming' },
]

const sevColors = { critical: '#EF4444', warning: '#F97316', info: '#3B82F6', success: '#22C55E' }
const sevBg = { critical: 'rgba(239,68,68,0.08)', warning: 'rgba(249,115,22,0.08)', info: 'rgba(59,130,246,0.08)', success: 'rgba(34,197,94,0.08)' }
const statusColors = { on: '#22C55E', ending: '#F97316', upcoming: '#3B82F6' }

function KPI({ icon: Icon, label, value, change, changeDir, C }) {
  const isUp = changeDir === 'up'
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px',
      transition: 'border-color 0.2s', cursor: 'default',
    }} onMouseEnter={e => e.currentTarget.style.borderColor = '#333'} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Icon size={16} color={C.textMuted} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600,
          color: isUp ? C.green : C.red,
        }}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ C }) {
  return (
    <div className="animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <KPI icon={PoundSterling} label="Today's Revenue" value="\u00A37,140" change="+12%" changeDir="up" C={C} />
        <KPI icon={Percent} label="Labour %" value="34%" change="+4pts" changeDir="down" C={C} />
        <KPI icon={UtensilsCrossed} label="Gross Profit %" value="68.2%" change="+1.7pts" changeDir="up" C={C} />
        <KPI icon={Users} label="Covers Today" value="98" change="+8%" changeDir="up" C={C} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Revenue Chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Revenue: This Week vs Last</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A853" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D4A853" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dimGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#555" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#555" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} formatter={v => [`\u00A3${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="lastWeek" stroke="#444" strokeWidth={1.5} fill="url(#dimGrad)" name="Last Week" />
              <Area type="monotone" dataKey="thisWeek" stroke="#D4A853" strokeWidth={2} fill="url(#amberGrad)" name="This Week" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Operator Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8, background: sevBg[a.severity],
                borderLeft: `3px solid ${sevColors[a.severity]}`, fontSize: 12,
              }}>
                <div style={{ color: C.text, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ color: C.textDim, fontSize: 10, marginTop: 4 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shift Summary */}
      <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Current Shift</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {shift.map((s, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[s.status] }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{s.name}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{s.role}</div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={10} />{s.hours}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
