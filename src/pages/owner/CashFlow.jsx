import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const weeklyForecast = [
  { week: 'W1 Mar', actual: 198000, forecast: 195000 },
  { week: 'W2 Mar', actual: 204000, forecast: 200000 },
  { week: 'W3 Mar', actual: 192000, forecast: 198000 },
  { week: 'W4 Mar', actual: null, forecast: 210000 },
  { week: 'W1 Apr', actual: null, forecast: 188000 },
  { week: 'W2 Apr', actual: null, forecast: 195000 },
  { week: 'W3 Apr', actual: null, forecast: 205000 },
  { week: 'W4 Apr', actual: null, forecast: 215000 },
]

const monthlyFlow = [
  { month: 'Oct', inflow: 785000, outflow: 658000, net: 127000 },
  { month: 'Nov', inflow: 820000, outflow: 672000, net: 148000 },
  { month: 'Dec', inflow: 965000, outflow: 748000, net: 217000 },
  { month: 'Jan', inflow: 695000, outflow: 645000, net: 50000 },
  { month: 'Feb', inflow: 742000, outflow: 668000, net: 74000 },
  { month: 'Mar*', inflow: 805000, outflow: 698000, net: 107000 },
]

const upcomingPayments = [
  { date: '22 Mar', payee: 'Staff Payroll', amount: 68400, status: 'scheduled' },
  { date: '25 Mar', payee: 'Matthew Clark (Spirits)', amount: 12800, status: 'due' },
  { date: '28 Mar', payee: 'Enotria & Coe (Wine)', amount: 8400, status: 'due' },
  { date: '01 Apr', payee: 'Commercial Rent (x5)', amount: 95000, status: 'upcoming' },
  { date: '01 Apr', payee: 'Business Rates (x5)', amount: 22500, status: 'upcoming' },
  { date: '05 Apr', payee: 'Insurance Premium', amount: 4200, status: 'upcoming' },
  { date: '07 Apr', payee: 'Staff Payroll', amount: 68400, status: 'upcoming' },
]

const statusColors = { scheduled: C.amber, due: C.orange, upcoming: C.textDim }

export default function CashFlow() {
  const currentBalance = 342000
  const projectedEnd = currentBalance + monthlyFlow[monthlyFlow.length - 1].net

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Cash Flow Forecast
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Current Balance', value: `\u00a3${(currentBalance / 1000).toFixed(0)}k`, color: C.ink },
          { label: 'Projected Month-End', value: `\u00a3${(projectedEnd / 1000).toFixed(0)}k`, color: C.green },
          { label: 'Upcoming Payments (7d)', value: `\u00a3${((68400 + 12800 + 8400) / 1000).toFixed(0)}k`, color: C.orange },
          { label: 'Runway at Current Burn', value: '4.2 months', color: C.amber },
        ].map((kpi, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Weekly Forecast Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Weekly Revenue: Actual vs Forecast</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={weeklyForecast}>
            <defs>
              <linearGradient id="cashGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cashAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.amber} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
            <XAxis dataKey="week" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
            <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00a3${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
              formatter={v => v ? [`\u00a3${v.toLocaleString()}`, ''] : ['--', '']} />
            <Area type="monotone" dataKey="actual" stroke={C.green} strokeWidth={2} fill="url(#cashGreen)" name="Actual" connectNulls={false} />
            <Area type="monotone" dataKey="forecast" stroke={C.amber} strokeWidth={2} strokeDasharray="5 5" fill="url(#cashAmber)" name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2col">
        {/* Monthly Cash Flow */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Monthly Cash Flow</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {monthlyFlow.map((m, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{m.month}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: m.net >= 100000 ? C.green : m.net >= 50000 ? C.amber : C.red }}>
                    +\u00a3{(m.net / 1000).toFixed(0)}k net
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                  <span style={{ color: C.green }}>\u2191 \u00a3{(m.inflow / 1000).toFixed(0)}k in</span>
                  <span style={{ color: C.red }}>\u2193 \u00a3{(m.outflow / 1000).toFixed(0)}k out</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Upcoming Payments</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {upcomingPayments.map((p, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{p.payee}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{p.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>\u00a3{p.amount.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: statusColors[p.status], textTransform: 'uppercase' }}>{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
