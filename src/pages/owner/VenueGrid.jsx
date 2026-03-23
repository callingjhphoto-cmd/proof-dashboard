import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, MapPin, Users, PoundSterling, Percent } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const venues = [
  {
    name: 'The Ivy Chelsea Garden', area: 'Chelsea, SW3', status: 'green',
    revenue: 168000, revenueChange: 8.4, ebitda: 31200, ebitdaMargin: 18.6,
    labour: 31.5, labourTarget: 30, gp: 68.2, gpTarget: 67,
    covers: 4820, coversChange: 5.2, alerts: 1, staff: 12,
  },
  {
    name: 'The Ivy Soho Brasserie', area: 'Soho, W1', status: 'green',
    revenue: 195000, revenueChange: 12.1, ebitda: 42900, ebitdaMargin: 22.0,
    labour: 28.3, labourTarget: 30, gp: 71.5, gpTarget: 68,
    covers: 5640, coversChange: 8.8, alerts: 0, staff: 15,
  },
  {
    name: 'The Ivy City Garden', area: 'City, EC2', status: 'amber',
    revenue: 142000, revenueChange: -2.1, ebitda: 18460, ebitdaMargin: 13.0,
    labour: 33.8, labourTarget: 30, gp: 64.1, gpTarget: 67,
    covers: 3980, coversChange: -4.5, alerts: 3, staff: 10,
  },
  {
    name: 'The Ivy Tower Bridge', area: 'SE1', status: 'red',
    revenue: 118000, revenueChange: -8.5, ebitda: 8260, ebitdaMargin: 7.0,
    labour: 36.2, labourTarget: 30, gp: 61.8, gpTarget: 67,
    covers: 3200, coversChange: -12.1, alerts: 5, staff: 9,
  },
  {
    name: 'The Ivy Kensington', area: 'Kensington, W8', status: 'green',
    revenue: 182000, revenueChange: 6.3, ebitda: 36400, ebitdaMargin: 20.0,
    labour: 29.1, labourTarget: 30, gp: 69.8, gpTarget: 67,
    covers: 5120, coversChange: 3.9, alerts: 0, staff: 13,
  },
]

const statusConfig = {
  green: { color: C.green, bg: C.greenBg, label: 'On Track', icon: CheckCircle },
  amber: { color: C.orange, bg: C.orangeBg, label: 'Watch', icon: AlertTriangle },
  red: { color: C.red, bg: C.redBg, label: 'Action Needed', icon: AlertTriangle },
}

const waterfallData = [
  { name: 'Revenue', value: 805000, total: 805000 },
  { name: 'COGS', value: -249550, total: 555450 },
  { name: 'Labour', value: -252770, total: 302680 },
  { name: 'Overheads', value: -165625, total: 137055 },
  { name: 'Net Profit', value: 137055, total: 137055 },
]

function KPI({ label, value, subtext, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
      <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || C.ink, letterSpacing: '-0.5px' }}>{value}</div>
      {subtext && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{subtext}</div>}
    </div>
  )
}

export default function VenueGrid() {
  const [selectedVenue, setSelectedVenue] = useState(null)

  const totalRevenue = venues.reduce((s, v) => s + v.revenue, 0)
  const totalEbitda = venues.reduce((s, v) => s + v.ebitda, 0)
  const avgLabour = (venues.reduce((s, v) => s + v.labour, 0) / venues.length).toFixed(1)
  const avgGP = (venues.reduce((s, v) => s + v.gp, 0) / venues.length).toFixed(1)
  const totalAlerts = venues.reduce((s, v) => s + v.alerts, 0)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Multi-Venue Command Centre
      </div>

      {/* Portfolio KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
        <KPI label="Portfolio Revenue" value={`\u00A3${(totalRevenue / 1000).toFixed(0)}k`} subtext="This month" color={C.ink} />
        <KPI label="Total EBITDA" value={`\u00A3${(totalEbitda / 1000).toFixed(0)}k`} subtext={`${(totalEbitda / totalRevenue * 100).toFixed(1)}% margin`} color={C.amber} />
        <KPI label="Avg Labour %" value={`${avgLabour}%`} subtext={parseFloat(avgLabour) > 30 ? 'Above target' : 'On target'} color={parseFloat(avgLabour) > 30 ? C.orange : C.green} />
        <KPI label="Avg GP %" value={`${avgGP}%`} subtext="Across all venues" color={parseFloat(avgGP) >= 67 ? C.green : C.red} />
        <KPI label="Active Alerts" value={totalAlerts.toString()} subtext={`${venues.filter(v => v.status === 'red').length} venue(s) in red`} color={totalAlerts > 3 ? C.red : C.orange} />
      </div>

      {/* Venue Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340, 1fr))', gap: 16, marginBottom: 20 }}>
        {venues.map((venue, i) => {
          const sc = statusConfig[venue.status]
          const StatusIcon = sc.icon
          const isSelected = selectedVenue === i
          return (
            <div
              key={i}
              onClick={() => setSelectedVenue(isSelected ? null : i)}
              style={{
                background: isSelected ? C.cardHover : C.card,
                border: `1px solid ${isSelected ? sc.color : C.border}`,
                borderRadius: 14, padding: 20, cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: `4px solid ${sc.color}`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{venue.name}</div>
                  <div style={{ fontSize: 11, color: C.textDim, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={10} />{venue.area}
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6,
                  background: sc.bg, fontSize: 11, fontWeight: 600, color: sc.color,
                }}>
                  <StatusIcon size={12} />{sc.label}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase' }}>Revenue</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{`\u00A3${(venue.revenue / 1000).toFixed(0)}k`}</div>
                  <div style={{ fontSize: 11, color: venue.revenueChange >= 0 ? C.green : C.red, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {venue.revenueChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {venue.revenueChange >= 0 ? '+' : ''}{venue.revenueChange}% MoM
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase' }}>EBITDA</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.amber }}>{`\u00A3${(venue.ebitda / 1000).toFixed(0)}k`}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{venue.ebitdaMargin}% margin</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase' }}>Labour %</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: venue.labour > venue.labourTarget ? C.red : C.green }}>{venue.labour}%</div>
                  <div style={{ height: 3, background: '#1E1E21', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(venue.labour / 40) * 100}%`, background: venue.labour > venue.labourTarget ? C.red : C.green, borderRadius: 2 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase' }}>GP %</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: venue.gp >= venue.gpTarget ? C.green : C.red }}>{venue.gp}%</div>
                  <div style={{ height: 3, background: '#1E1E21', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${venue.gp}%`, background: venue.gp >= venue.gpTarget ? C.green : C.red, borderRadius: 2 }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textDim }}>
                <span><Users size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />{venue.staff} staff</span>
                <span>{venue.covers.toLocaleString()} covers</span>
                {venue.alerts > 0 && (
                  <span style={{ color: C.red, fontWeight: 600 }}>
                    <AlertTriangle size={10} style={{ verticalAlign: 'middle', marginRight: 2 }} />{venue.alerts} alerts
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* P&L Waterfall */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Portfolio P&L Waterfall &mdash; March 2026</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={waterfallData} barSize={60}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
            <XAxis dataKey="name" stroke="#333" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} />
            <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00A3${Math.abs(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
              formatter={v => [`\u00A3${Math.abs(v).toLocaleString()}`, '']} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {waterfallData.map((entry, idx) => (
                <Cell key={idx} fill={entry.value >= 0 ? (idx === waterfallData.length - 1 ? C.amber : C.green) : C.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Venue Ranking */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Venue Performance Ranking</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Rank', 'Venue', 'Revenue', 'EBITDA', 'EBITDA %', 'Labour %', 'GP %', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...venues].sort((a, b) => b.ebitdaMargin - a.ebitdaMargin).map((v, i) => {
              const sc = statusConfig[v.status]
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px', color: C.amber, fontWeight: 700 }}>#{i + 1}</td>
                  <td style={{ padding: '10px', color: C.ink, fontWeight: 500 }}>{v.name}</td>
                  <td style={{ padding: '10px', color: C.text }}>{`\u00A3${(v.revenue / 1000).toFixed(0)}k`}</td>
                  <td style={{ padding: '10px', color: C.amber }}>{`\u00A3${(v.ebitda / 1000).toFixed(0)}k`}</td>
                  <td style={{ padding: '10px', color: v.ebitdaMargin >= 15 ? C.green : C.red }}>{v.ebitdaMargin}%</td>
                  <td style={{ padding: '10px', color: v.labour <= 30 ? C.green : v.labour <= 33 ? C.orange : C.red }}>{v.labour}%</td>
                  <td style={{ padding: '10px', color: v.gp >= 67 ? C.green : C.red }}>{v.gp}%</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
