import { PoundSterling, TrendingUp, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const weeklyTips = [
  { week: 'W1', tips: 185 },
  { week: 'W2', tips: 210 },
  { week: 'W3', tips: 168 },
  { week: 'W4', tips: 245 },
  { week: 'W5', tips: 192 },
  { week: 'W6', tips: 228 },
  { week: 'W7', tips: 205 },
  { week: 'W8', tips: 238 },
  { week: 'W9', tips: 215 },
  { week: 'W10', tips: 262 },
  { week: 'W11', tips: 248 },
  { week: 'W12', tips: 42 }, // current week partial
]

const dailyBreakdown = [
  { day: 'Mon 17', tips: 42.00, covers: 18, tpc: 2.33, shift: '16:00-23:00' },
]

const monthlyTotals = [
  { month: 'March (so far)', tips: 42.00, shifts: 1 },
  { month: 'February', tips: 862.00, shifts: 22 },
  { month: 'January', tips: 784.00, shifts: 20 },
  { month: 'December', tips: 1124.00, shifts: 24 },
  { month: 'November', tips: 748.00, shifts: 21 },
]

export default function TipTracker() {
  const totalThisYear = monthlyTotals.reduce((s, m) => s + m.tips, 0)
  const avgPerShift = (totalThisYear / monthlyTotals.reduce((s, m) => s + m.shifts, 0)).toFixed(2)
  const avgWeekly = (weeklyTips.slice(0, -1).reduce((s, w) => s + w.tips, 0) / (weeklyTips.length - 1)).toFixed(0)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        My Tips
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>This Week</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.blue }}>{'\u00a3'}42</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>1 shift so far</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Avg Per Week</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{'\u00a3'}{avgWeekly}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Last 11 weeks</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Avg Per Shift</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.amber }}>{'\u00a3'}{avgPerShift}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>This year</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Year Total</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.green }}>{'\u00a3'}{totalThisYear.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>2026 to date</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Weekly Tips &mdash; Last 12 Weeks</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyTips}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
            <XAxis dataKey="week" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
            <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00a3${v}`} />
            <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
              formatter={v => [`\u00a3${v}`, 'Tips']} />
            <Bar dataKey="tips" fill={C.blue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2col">
        {/* Daily Breakdown */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>This Week&apos;s Shifts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dailyBreakdown.map((d, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{d.day}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.blue }}>{'\u00a3'}{d.tips.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textDim }}>
                  {d.shift} &bull; {d.covers} covers &bull; {'\u00a3'}{d.tpc.toFixed(2)}/cover
                </div>
              </div>
            ))}
            <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: C.textDim }}>
              More shifts this week will appear here
            </div>
          </div>
        </div>

        {/* Monthly Totals */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Monthly Totals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {monthlyTotals.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{m.month}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{m.shifts} shifts</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? C.blue : C.ink }}>
                  {'\u00a3'}{m.tips.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
