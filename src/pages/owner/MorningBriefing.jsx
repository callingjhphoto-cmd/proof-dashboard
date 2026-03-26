import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import {
  Sun, Cloud, CloudRain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Users, PoundSterling, Percent, Star, Send, Mail, Clock, ThermometerSun,
  ShieldAlert, Package, Calendar, Award, Coffee, Zap, ChevronDown, ChevronUp
} from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberLight: '#E8C878', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

// Yesterday's performance data
const yesterday = {
  date: 'Wednesday 25 March 2026',
  revenue: 8420,
  revenueTarget: 7800,
  revenueVsTarget: '+8.0%',
  covers: 142,
  coversTarget: 128,
  avgSpend: 59.30,
  avgSpendTarget: 60.94,
  gp: 68.4,
  gpTarget: 67.0,
  labour: 31.2,
  labourTarget: 30.0,
  wastage: 1.8,
  wastageBudget: 2.0,
  complaints: 1,
  compliments: 4,
  voidCount: 3,
  voidValue: 47.50,
  topPerformer: { name: 'Sarah Mitchell', role: 'Bar Lead', metric: '£2,840 in bar sales', note: 'Upsold 18 cocktails to premium spirits' },
  bottomPerformer: { name: 'New starter — Jake P.', role: 'Server', metric: '£680 in covers', note: 'Still learning menu, paired with Lily for mentoring today' },
}

const hourlyRevenue = [
  { hour: '11am', rev: 320 }, { hour: '12pm', rev: 890 }, { hour: '1pm', rev: 1240 },
  { hour: '2pm', rev: 680 }, { hour: '3pm', rev: 410 }, { hour: '4pm', rev: 520 },
  { hour: '5pm', rev: 780 }, { hour: '6pm', rev: 1120 }, { hour: '7pm', rev: 1380 },
  { hour: '8pm', rev: 1540 }, { hour: '9pm', rev: 980 }, { hour: '10pm', rev: 560 },
]

const weekRevenue = [
  { day: 'Mon', actual: 5200, target: 5500 },
  { day: 'Tue', actual: 4800, target: 5000 },
  { day: 'Wed', actual: 8420, target: 7800 },
  { day: 'Thu', actual: null, target: 8200 },
  { day: 'Fri', actual: null, target: 10500 },
  { day: 'Sat', actual: null, target: 12000 },
  { day: 'Sun', actual: null, target: 7500 },
]

// Today's forecast
const today = {
  date: 'Thursday 26 March 2026',
  dayOfWeek: 'Thursday',
  weather: { icon: 'partly-cloudy', temp: 14, condition: 'Partly Cloudy', wind: '12mph SW', rain: '15%' },
  expectedCovers: 156,
  expectedRevenue: 9200,
  bookings: 42,
  walkInEstimate: 114,
  largeParties: [
    { name: 'Henderson Birthday', size: 12, time: '19:30', preOrders: true, spend: '£80pp' },
    { name: 'Corporate — Deloitte', size: 8, time: '12:30', preOrders: false, spend: '£65pp est.' },
  ],
  specialEvents: ['Spring Menu Preview (VIP table 6-8, 19:00)'],
  staffOnToday: 8,
  staffNeeded: 8,
  labourForecast: 29.4,
}

// Alerts
const alerts = [
  { severity: 'critical', icon: Package, text: 'Low stock: Hendricks Gin (2 bottles) — reorder needed before Friday service', action: 'Order Now' },
  { severity: 'critical', icon: Package, text: 'Oat Milk running low (3 cartons) — high demand with spring menu launch', action: 'Order Now' },
  { severity: 'warning', icon: Users, text: 'Anya K. called in sick for Friday evening shift — no cover found yet', action: 'Find Cover' },
  { severity: 'warning', icon: ShieldAlert, text: 'Fire extinguisher check overdue by 3 days — compliance risk', action: 'Schedule' },
  { severity: 'info', icon: Calendar, text: 'Spring menu goes live Wednesday — 4 staff still need briefing', action: 'View Training' },
  { severity: 'info', icon: Award, text: 'Sarah M. hit 50 consecutive shifts without absence — recognition due', action: 'Recognise' },
]

const sevColors = { critical: C.red, warning: C.orange, info: C.blue }
const sevBg = { critical: C.redBg, warning: C.orangeBg, info: C.blueBg }

// Stock prep recommendations
const stockPrep = [
  { item: 'Espresso Martini pre-batch', qty: '40 portions', reason: 'Thursday avg 32 sold, spring menu push expected +25%' },
  { item: 'Citrus garnish prep', qty: '60 wheels, 40 twists', reason: 'High cocktail forecast — 156 covers' },
  { item: 'Aperol Spritz mise en place', qty: '25 portions', reason: 'Weather warming up — spritz sales spike in 14°C+' },
  { item: 'Sunday roast protein defrost', qty: 'N/A until Fri', reason: 'Plan ahead — last 2 Sundays sold out by 14:00' },
]

// AI Narrative
const aiNarrative = `Yesterday was a strong midweek day. Revenue came in at £8,420, beating the £7,800 target by 8%. The bar drove most of the over-performance — Sarah Mitchell delivered £2,840 in bar revenue alone, successfully upselling 18 cocktails to premium pours. This is the third consecutive Wednesday she has outperformed bar targets.

Gross profit held firm at 68.4%, comfortably above the 67% target. Labour came in slightly hot at 31.2% versus the 30% target — this was driven by the overlap shift during the lunch-to-dinner changeover. Consider staggering start times by 30 minutes to shave that extra percentage point.

One complaint was logged: a 45-minute wait for mains on table 14 during the 19:30 rush. The kitchen was understaffed on starters — the new commis chef is still finding their rhythm. Recommend pairing them with a senior for the Thursday evening service.

Looking ahead to today, 42 bookings are confirmed including a 12-top birthday celebration at 19:30 and an 8-person Deloitte lunch. With 156 expected covers and partly cloudy weather at 14°C, cocktail sales should remain strong. The spring menu VIP preview this evening will require dedicated service on tables 6-8. All 8 required staff are confirmed — no gaps.

Priority actions for today: reorder Hendricks Gin before Friday, find cover for Anya's Friday shift, and complete the fire extinguisher compliance check that's now 3 days overdue.`

function WeatherIcon({ condition, size = 24 }) {
  if (condition === 'sunny') return <Sun size={size} color="#F59E0B" />
  if (condition === 'partly-cloudy') return <Cloud size={size} color="#94A3B8" />
  if (condition === 'rain') return <CloudRain size={size} color="#60A5FA" />
  return <ThermometerSun size={size} color="#F97316" />
}

function KPICard({ icon: Icon, label, value, target, unit, goodDir, change }) {
  const numVal = parseFloat(String(value).replace(/[^0-9.-]/g, ''))
  const numTarget = parseFloat(String(target).replace(/[^0-9.-]/g, ''))
  const isGood = goodDir === 'up' ? numVal >= numTarget : numVal <= numTarget
  const statusColor = isGood ? C.green : C.red
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Icon size={16} color={C.textMuted} />
        <div style={{ fontSize: 10, color: statusColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
          {isGood ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
          {isGood ? 'On Target' : 'Off Target'}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: '-0.5px' }}>{value}{unit}</div>
      <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Target: {target}{unit} {change && <span style={{ color: statusColor, fontWeight: 600 }}>{change}</span>}</div>
    </div>
  )
}

export default function MorningBriefing() {
  const [expandedAlert, setExpandedAlert] = useState(null)
  const [sent, setSent] = useState({ whatsapp: false, email: false })

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Sun size={22} color={C.amber} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Morning Briefing</h1>
        </div>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          Auto-generated at 06:00 — {today.date}
        </p>
      </div>

      {/* Send buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => setSent(p => ({ ...p, whatsapp: true }))}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
            background: sent.whatsapp ? C.greenBg : 'transparent', border: `1px solid ${sent.whatsapp ? C.green : C.border}`,
            color: sent.whatsapp ? C.green : C.text, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Send size={14} /> {sent.whatsapp ? 'Sent to WhatsApp' : 'Send to WhatsApp'}
        </button>
        <button
          onClick={() => setSent(p => ({ ...p, email: true }))}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
            background: sent.email ? C.greenBg : 'transparent', border: `1px solid ${sent.email ? C.green : C.border}`,
            color: sent.email ? C.green : C.text, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Mail size={14} /> {sent.email ? 'Sent to Email' : 'Send to Email'}
        </button>
      </div>

      {/* Yesterday's Performance */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.amber, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Yesterday — {yesterday.date}
        </div>
        <div className="grid-kpi-4" style={{ marginBottom: 16 }}>
          <KPICard icon={PoundSterling} label="Revenue" value={`\u00A3${yesterday.revenue.toLocaleString()}`} target={`\u00A3${yesterday.revenueTarget.toLocaleString()}`} goodDir="up" change={yesterday.revenueVsTarget} />
          <KPICard icon={Percent} label="Gross Profit %" value={yesterday.gp} target={yesterday.gpTarget} unit="%" goodDir="up" />
          <KPICard icon={Users} label="Labour %" value={yesterday.labour} target={yesterday.labourTarget} unit="%" goodDir="down" />
          <KPICard icon={Coffee} label="Covers" value={yesterday.covers} target={yesterday.coversTarget} goodDir="up" />
        </div>
      </div>

      {/* Two column: Hourly Rev + Week Progress */}
      <div className="grid-2col" style={{ marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Yesterday Hourly Revenue</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyRevenue}>
              <XAxis dataKey="hour" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${v}`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} formatter={v => [`\u00A3${v}`, 'Revenue']} />
              <Bar dataKey="rev" fill={C.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Week Progress (Actual vs Target)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekRevenue}>
              <XAxis dataKey="day" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} formatter={v => v ? [`\u00A3${v.toLocaleString()}`, ''] : ['—', '']} />
              <Bar dataKey="target" fill="#333" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="actual" fill={C.amber} radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top/Bottom Performer */}
      <div className="grid-2col" style={{ marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Star size={16} color={C.green} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>Top Performer</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{yesterday.topPerformer.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{yesterday.topPerformer.role}</div>
          <div style={{ fontSize: 13, color: C.amber, fontWeight: 600, marginTop: 8 }}>{yesterday.topPerformer.metric}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{yesterday.topPerformer.note}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <TrendingDown size={16} color={C.orange} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.orange }}>Needs Support</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{yesterday.bottomPerformer.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{yesterday.bottomPerformer.role}</div>
          <div style={{ fontSize: 13, color: C.orange, fontWeight: 600, marginTop: 8 }}>{yesterday.bottomPerformer.metric}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{yesterday.bottomPerformer.note}</div>
        </div>
      </div>

      {/* Today's Forecast */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Today's Forecast — {today.date}
        </div>
        <div className="grid-kpi-5" style={{ marginBottom: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <WeatherIcon condition={today.weather.icon} size={20} />
              <span style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{today.weather.temp}°C</span>
            </div>
            <div style={{ fontSize: 12, color: C.text }}>{today.weather.condition}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Wind: {today.weather.wind} | Rain: {today.weather.rain}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <Users size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 4 }}>{today.expectedCovers}</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Expected Covers</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{today.bookings} booked + ~{today.walkInEstimate} walk-in</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <PoundSterling size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 4 }}>{'\u00A3'}{today.expectedRevenue.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Forecast Revenue</div>
            <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>+18% vs Thu avg</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <Users size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 4 }}>{today.staffOnToday}/{today.staffNeeded}</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Staff Confirmed</div>
            <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>Fully staffed</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <Percent size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 4 }}>{today.labourForecast}%</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Labour Forecast</div>
            <div style={{ fontSize: 10, color: C.green, marginTop: 2 }}>Under 30% target</div>
          </div>
        </div>

        {/* Large parties today */}
        {today.largeParties.length > 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Large Parties Today</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {today.largeParties.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: C.bg, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{p.size} guests — {p.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.amber }}>{p.spend}</div>
                    <div style={{ fontSize: 10, color: p.preOrders ? C.green : C.textDim }}>
                      {p.preOrders ? 'Pre-orders confirmed' : 'No pre-orders'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.red, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Attention Required ({alerts.filter(a => a.severity === 'critical').length} Critical)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              background: sevBg[a.severity], border: `1px solid ${sevColors[a.severity]}25`,
              borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a.icon size={16} color={sevColors[a.severity]} />
                <span style={{ fontSize: 13, color: C.text }}>{a.text}</span>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: 6, border: `1px solid ${sevColors[a.severity]}40`,
                background: 'transparent', color: sevColors[a.severity], fontSize: 11, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{a.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Prep Recommendations */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Package size={16} color={C.amber} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Stock Prep Recommendations</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Item', 'Quantity', 'Reasoning'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockPrep.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: '10px 12px', fontSize: 13, color: C.ink, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>{s.item}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: C.amber, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{s.qty}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>{s.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Narrative */}
      <div style={{ background: C.card, border: `1px solid ${C.amber}20`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={16} color={C.amber} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.amber }}>AI Ops Director Summary</span>
        </div>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {aiNarrative}
        </div>
      </div>
    </div>
  )
}
