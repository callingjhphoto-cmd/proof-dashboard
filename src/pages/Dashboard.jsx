import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Users, UtensilsCrossed, AlertTriangle, Clock, Percent, PoundSterling, Sun, Cloud, CloudRain, CloudSnow, Droplets } from 'lucide-react'

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
  { severity: 'warning', text: 'Labour at 34% — 4% above weekly target', time: '2h ago' },
  { severity: 'critical', text: 'Low stock: Hendricks Gin (2 bottles remaining)', time: '1h ago' },
  { severity: 'info', text: 'VIP arriving: James Worthington (High Spender, £2,840 lifetime, prefers Booth 3, Negroni drinker)', time: '30m ago' },
  { severity: 'info', text: 'Friday booking: 142 covers (18% above avg)', time: '4h ago' },
  { severity: 'success', text: 'GP% trending up: 68.2% vs 66.5% last week', time: '6h ago' },
]

const shift = [
  { name: 'Sarah M.', role: 'Bar Lead', hours: '14:00–23:00', status: 'on', staffId: 'sarah-mitchell' },
  { name: 'Marcus T.', role: 'Bartender', hours: '16:00–23:00', status: 'on', staffId: 'marcus-taylor' },
  { name: 'Lily C.', role: 'Floor Mgr', hours: '11:00–20:00', status: 'ending', staffId: 'lily-chen' },
  { name: 'Tom R.', role: 'Server', hours: '17:00–23:00', status: 'upcoming', staffId: 'tom-robinson' },
  { name: 'Anya K.', role: 'Server', hours: '17:00–23:00', status: 'upcoming', staffId: 'anya-kowalski' },
]

// Weather forecast — next 7 days
const weatherForecast = [
  { day: 'Thu', date: '26', weather: 'partly-cloudy', temp: 14, covers: 156, revenue: 9200, confidence: 'high', staffRec: '8 staff', stockTip: '+25% Spritz prep — warming up', staffColor: '#22C55E' },
  { day: 'Fri', date: '27', weather: 'sunny', temp: 17, covers: 182, revenue: 10800, confidence: 'high', staffRec: '10 staff', stockTip: '+40% cocktail batch — sunny Fri', staffColor: '#22C55E' },
  { day: 'Sat', date: '28', weather: 'sunny', temp: 18, covers: 198, revenue: 12400, confidence: 'high', staffRec: '11 staff', stockTip: '30 extra Aperol Spritz, +50% citrus', staffColor: '#F97316' },
  { day: 'Sun', date: '29', weather: 'partly-cloudy', temp: 15, covers: 142, revenue: 8600, confidence: 'medium', staffRec: '8 staff', stockTip: 'Sunday roast protein — order Fri', staffColor: '#22C55E' },
  { day: 'Mon', date: '30', weather: 'rain', temp: 11, covers: 98, revenue: 5400, confidence: 'medium', staffRec: '6 staff', stockTip: 'Hot toddy ingredients, reduce terrace prep', staffColor: '#22C55E' },
  { day: 'Tue', date: '31', weather: 'rain', temp: 10, covers: 88, revenue: 4800, confidence: 'low', staffRec: '6 staff', stockTip: 'Comfort cocktails, warm drinks focus', staffColor: '#22C55E' },
  { day: 'Wed', date: '1 Apr', weather: 'partly-cloudy', temp: 13, covers: 112, revenue: 6200, confidence: 'medium', staffRec: '7 staff', stockTip: 'Spring menu launch — full prep', staffColor: '#22C55E' },
]

const historicalAccuracy = { lastSunnySat: { actual: 195, forecast: 180, accuracy: 92 }, lastRainyMon: { actual: 82, forecast: 90, accuracy: 91 } }

const weatherIcons = { sunny: Sun, 'partly-cloudy': Cloud, rain: CloudRain, snow: CloudSnow }
const weatherColors = { sunny: '#F59E0B', 'partly-cloudy': '#94A3B8', rain: '#60A5FA', snow: '#E2E8F0' }
const confColors = { high: '#22C55E', medium: '#F97316', low: '#EF4444' }

const sevColors = { critical: '#EF4444', warning: '#F97316', info: '#3B82F6', success: '#22C55E' }
const sevBg = { critical: 'rgba(239,68,68,0.08)', warning: 'rgba(249,115,22,0.08)', info: 'rgba(59,130,246,0.08)', success: 'rgba(34,197,94,0.08)' }
const statusColors = { on: '#22C55E', ending: '#F97316', upcoming: '#3B82F6' }

function KPI({ icon: Icon, label, value, change, changeDir, goodDir, period, C }) {
  const isUp = changeDir === 'up'
  // Color logic: if goodDir matches changeDir, it's positive (green). Otherwise negative (red).
  // e.g., Revenue going up = good (green). Labour going up = bad (red).
  const isGood = goodDir === changeDir
  const changeColor = isGood ? C.green : C.red
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px',
      transition: 'border-color 0.2s', cursor: 'default',
    }} onMouseEnter={e => e.currentTarget.style.borderColor = '#333'} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Icon size={16} color={C.textMuted} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600,
          color: changeColor,
        }}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change} {period && <span style={{ color: C.textDim, fontWeight: 400 }}>{period}</span>}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ C }) {
  const navigate = useNavigate()
  return (
    <div className="animate-in">
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <KPI icon={PoundSterling} label="Today's Revenue" value="£7,140" change="+12%" changeDir="up" goodDir="up" period="vs last week" C={C} />
        <KPI icon={Percent} label="Labour %" value="34%" change="+4pts" changeDir="up" goodDir="down" period="vs last week" C={C} />
        <KPI icon={UtensilsCrossed} label="Gross Profit %" value="68.2%" change="+1.7pts" changeDir="up" goodDir="up" period="vs last week" C={C} />
        <KPI icon={Users} label="Covers Today" value="98" change="+8%" changeDir="up" goodDir="up" period="vs last week" C={C} />
      </div>

      {/* Weather Demand Forecast — Next 7 Days */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>7-Day Demand Forecast</div>
          <div style={{ fontSize: 10, color: C.textDim }}>
            Historical accuracy: Last sunny Sat = {historicalAccuracy.lastSunnySat.accuracy}% ({historicalAccuracy.lastSunnySat.actual} actual vs {historicalAccuracy.lastSunnySat.forecast} forecast)
          </div>
        </div>
        <div className="grid-7day">
          {weatherForecast.map((d, i) => {
            const WeatherIcon = weatherIcons[d.weather] || Cloud
            return (
              <div key={i} style={{
                background: i === 0 ? 'rgba(212,168,83,0.06)' : C.bg,
                border: `1px solid ${i === 0 ? C.amber + '30' : C.border}`,
                borderRadius: 8, padding: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: i === 0 ? C.amber : C.textMuted, marginBottom: 4 }}>{d.day} {d.date}</div>
                <WeatherIcon size={20} color={weatherColors[d.weather]} style={{ margin: '4px 0' }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{d.temp}°C</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.amber, marginTop: 6 }}>{d.covers}</div>
                <div style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase' }}>covers</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginTop: 4 }}>{'\u00A3'}{(d.revenue / 1000).toFixed(1)}k</div>
                <div style={{
                  fontSize: 9, fontWeight: 600, marginTop: 4, padding: '2px 6px', borderRadius: 3,
                  background: confColors[d.confidence] + '15', color: confColors[d.confidence],
                  display: 'inline-block',
                }}>{d.confidence}</div>
                <div style={{ fontSize: 9, color: d.staffColor, fontWeight: 600, marginTop: 4 }}>{d.staffRec}</div>
                <div style={{ fontSize: 8, color: C.textDim, marginTop: 3, lineHeight: 1.3 }}>{d.stockTip}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid-2col-sidebar">
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
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} formatter={v => [`£${v.toLocaleString()}`, '']} />
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
        <div className="grid-kpi-5">
          {shift.map((s, i) => (
            <div key={i} onClick={() => navigate(`/staff/${s.staffId}`)} style={{
              padding: '12px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
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
