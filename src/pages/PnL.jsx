import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const monthlyPnL = [
  { month: 'Oct', revenue: 158000, cogs: 50560, labour: 49980, overheads: 31600, net: 25860 },
  { month: 'Nov', revenue: 172000, cogs: 53320, labour: 53320, overheads: 32200, net: 33160 },
  { month: 'Dec', revenue: 210000, cogs: 63000, labour: 63000, overheads: 33800, net: 50200 },
  { month: 'Jan', revenue: 142000, cogs: 46860, labour: 46860, overheads: 31200, net: 17080 },
  { month: 'Feb', revenue: 155000, cogs: 49600, labour: 50375, overheads: 31400, net: 23625 },
  { month: 'Mar*', revenue: 168000, cogs: 52080, labour: 52920, overheads: 31800, net: 31200 },
]

const gpByCategory = [
  { category: 'Spirits', gp: 78, target: 75 },
  { category: 'Wine', gp: 65, target: 68 },
  { category: 'Beer', gp: 62, target: 65 },
  { category: 'Cocktails', gp: 82, target: 80 },
  { category: 'Food', gp: 68, target: 70 },
  { category: 'Soft Drinks', gp: 85, target: 80 },
]

const labourTrend = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`, labour: 28 + Math.random() * 8, target: 30,
}))

function Card({ title, children, C, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

function Metric({ label, value, vs, upIsGood, C }) {
  const diff = vs ? ((value - vs) / vs * 100).toFixed(1) : null
  const isUp = diff > 0
  // For costs (COGS, Labour, Overheads), going UP is bad (red). For revenue, going UP is good (green).
  const isGood = upIsGood ? isUp : !isUp
  const diffColor = diff == 0 ? C.textDim : (isGood ? C.green : C.red)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>£{(value / 1000).toFixed(0)}k</div>
      {diff && <div style={{ fontSize: 11, color: diffColor, marginTop: 2 }}>{isUp ? '+' : ''}{diff}% vs last month</div>}
    </div>
  )
}

export default function PnL({ C }) {
  const current = monthlyPnL[monthlyPnL.length - 1]
  const prev = monthlyPnL[monthlyPnL.length - 2]

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Profit &amp; Loss
      </div>

      {/* Summary KPIs */}
      <div className="grid-kpi-5" style={{
        marginBottom: 20,
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px',
      }}>
        <Metric label="Revenue" value={current.revenue} vs={prev.revenue} upIsGood={true} C={C} />
        <Metric label="COGS" value={current.cogs} vs={prev.cogs} upIsGood={false} C={C} />
        <Metric label="Labour" value={current.labour} vs={prev.labour} upIsGood={false} C={C} />
        <Metric label="Overheads" value={current.overheads} vs={prev.overheads} upIsGood={false} C={C} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Net Profit</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.amber }}>£{(current.net / 1000).toFixed(0)}k</div>
          <div style={{ fontSize: 11, color: (current.net - prev.net) >= 0 ? C.green : C.red, marginTop: 2 }}>{(current.net - prev.net) >= 0 ? '+' : ''}{((current.net - prev.net) / prev.net * 100).toFixed(1)}% vs last month</div>
        </div>
      </div>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        {/* Monthly Revenue Breakdown */}
        <Card title="Monthly Revenue & Costs" C={C}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyPnL} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
              <XAxis dataKey="month" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `${(v/1000)}k`} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} formatter={v => [`£${v.toLocaleString()}`, '']} />
              <Bar dataKey="revenue" fill="#D4A853" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="cogs" fill="#555" radius={[4, 4, 0, 0]} name="COGS" />
              <Bar dataKey="labour" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Labour" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* GP% by Category */}
        <Card title="Gross Profit % by Category" C={C}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {gpByCategory.map((cat, i) => {
              const aboveTarget = cat.gp >= cat.target
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.text }}>{cat.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: aboveTarget ? C.green : C.red }}>
                      {cat.gp}% <span style={{ color: C.textDim, fontWeight: 400 }}>/ {cat.target}% target</span>
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#1E1E21', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      height: '100%', width: `${cat.gp}%`, borderRadius: 3,
                      background: aboveTarget ? C.green : C.red, transition: 'width 0.5s',
                    }} />
                    <div style={{
                      position: 'absolute', left: `${cat.target}%`, top: -2, width: 2, height: 10,
                      background: C.amber, borderRadius: 1,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Labour Trend */}
      <Card title="Labour % \u2014 Last 12 Weeks" C={C}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={labourTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
            <XAxis dataKey="week" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
            <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} domain={[25, 40]} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} formatter={v => [`${v.toFixed(1)}%`, '']} />
            <Line type="monotone" dataKey="target" stroke="#D4A853" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
            <Line type="monotone" dataKey="labour" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6' }} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
