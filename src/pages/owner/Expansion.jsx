import { useState } from 'react'
import { Expand, MapPin, PoundSterling, TrendingUp, Building2, Calculator } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const scenarios = [
  {
    name: 'Venue #6: Notting Hill',
    location: 'Notting Hill, W11',
    type: 'Cocktail Bar & Restaurant',
    setupCost: 480000,
    monthlyRent: 18000,
    staffCount: 14,
    monthlyLabour: 58000,
    projectedRevenue: 175000,
    breakEvenMonth: 8,
    projectedEbitda: 28000,
    yearOneROI: -12,
    yearTwoROI: 22,
    risk: 'medium',
    notes: 'High footfall area, strong weekend trade. Competition from 3 existing cocktail bars within 500m.',
    projection: Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      revenue: Math.round(95000 + (i * 7500) + Math.random() * 10000),
      costs: Math.round(145000 - (i * 2000) + Math.random() * 5000),
    })),
  },
  {
    name: 'Venue #6: Shoreditch',
    location: 'Shoreditch, E1',
    type: 'Bar & Late-Night Venue',
    setupCost: 350000,
    monthlyRent: 14000,
    staffCount: 11,
    monthlyLabour: 44000,
    projectedRevenue: 155000,
    breakEvenMonth: 6,
    projectedEbitda: 32000,
    yearOneROI: 8,
    yearTwoROI: 35,
    risk: 'low',
    notes: 'Lower setup cost, strong late-night economy. Younger demographic with higher cocktail spend per head.',
    projection: Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      revenue: Math.round(85000 + (i * 6500) + Math.random() * 8000),
      costs: Math.round(115000 - (i * 2500) + Math.random() * 4000),
    })),
  },
  {
    name: 'Venue #6: Richmond',
    location: 'Richmond, TW9',
    type: 'Restaurant & Terrace Bar',
    setupCost: 550000,
    monthlyRent: 22000,
    staffCount: 16,
    monthlyLabour: 66000,
    projectedRevenue: 195000,
    breakEvenMonth: 10,
    projectedEbitda: 24000,
    yearOneROI: -18,
    yearTwoROI: 15,
    risk: 'high',
    notes: 'Premium location with seasonal terrace trade. High setup cost but strong brand alignment. Winter months challenging.',
    projection: Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      revenue: Math.round(100000 + (i * 8000) + Math.random() * 15000),
      costs: Math.round(165000 - (i * 1500) + Math.random() * 6000),
    })),
  },
]

const riskColors = { low: C.green, medium: C.orange, high: C.red }

export default function Expansion() {
  const [selectedScenario, setSelectedScenario] = useState(0)
  const scenario = scenarios[selectedScenario]

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 6, fontFamily: 'Georgia, serif' }}>
        Expansion Modelling
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>
        What would venue #6 look like? Compare scenarios side-by-side.
      </div>

      {/* Scenario Selector */}
      <div className="grid-kpi" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {scenarios.map((s, i) => (
          <div
            key={i}
            onClick={() => setSelectedScenario(i)}
            style={{
              background: selectedScenario === i ? C.amberBg : C.card,
              border: `1px solid ${selectedScenario === i ? C.amber : C.border}`,
              borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{s.name}</div>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                color: riskColors[s.risk], background: riskColors[s.risk] + '15', textTransform: 'uppercase',
              }}>{s.risk} risk</span>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <MapPin size={10} />{s.location} &bull; {s.type}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
              <div><span style={{ color: C.textDim }}>Setup:</span> <span style={{ color: C.ink, fontWeight: 600 }}>\u00a3{(s.setupCost / 1000).toFixed(0)}k</span></div>
              <div><span style={{ color: C.textDim }}>Break-even:</span> <span style={{ color: C.amber, fontWeight: 600 }}>Month {s.breakEvenMonth}</span></div>
              <div><span style={{ color: C.textDim }}>EBITDA:</span> <span style={{ color: C.green, fontWeight: 600 }}>\u00a3{(s.projectedEbitda / 1000).toFixed(0)}k/mo</span></div>
              <div><span style={{ color: C.textDim }}>Y2 ROI:</span> <span style={{ color: s.yearTwoROI > 0 ? C.green : C.red, fontWeight: 600 }}>{s.yearTwoROI}%</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      <div className="grid-2col" style={{ marginBottom: 16 }}>
        {/* Projection Chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>12-Month Revenue vs Costs Projection</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={scenario.projection}>
              <defs>
                <linearGradient id="expGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.green} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
              <XAxis dataKey="month" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00a3${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                formatter={v => [`\u00a3${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke={C.green} strokeWidth={2} fill="url(#expGreen)" name="Revenue" />
              <Area type="monotone" dataKey="costs" stroke={C.red} strokeWidth={2} fill="url(#expRed)" name="Costs" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: C.amber }}>
            Break-even projected at month {scenario.breakEvenMonth}
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Financial Model: {scenario.name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Total Setup Cost', value: `\u00a3${scenario.setupCost.toLocaleString()}`, icon: Building2 },
              { label: 'Monthly Rent', value: `\u00a3${scenario.monthlyRent.toLocaleString()}`, icon: PoundSterling },
              { label: 'Staff Required', value: `${scenario.staffCount} FTEs`, icon: Calculator },
              { label: 'Monthly Labour', value: `\u00a3${scenario.monthlyLabour.toLocaleString()}`, icon: Calculator },
              { label: 'Projected Monthly Revenue', value: `\u00a3${scenario.projectedRevenue.toLocaleString()}`, icon: TrendingUp },
              { label: 'Projected Monthly EBITDA', value: `\u00a3${scenario.projectedEbitda.toLocaleString()}`, icon: TrendingUp },
              { label: 'Year 1 ROI', value: `${scenario.yearOneROI}%`, icon: TrendingUp },
              { label: 'Year 2 ROI', value: `${scenario.yearTwoROI}%`, icon: TrendingUp },
            ].map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.textMuted }}>
                  <m.icon size={14} color={C.textDim} />{m.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, padding: '12px 14px', borderRadius: 8, background: C.amberBg,
            borderLeft: `3px solid ${C.amber}`, fontSize: 12, color: C.text, lineHeight: 1.5,
          }}>
            {scenario.notes}
          </div>
        </div>
      </div>
    </div>
  )
}
