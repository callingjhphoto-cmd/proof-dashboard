import { useState } from "react"
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus, Calendar,
  Users, BarChart3, Brain, Award, AlertTriangle, CheckCircle, Zap
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line } from "recharts"

const C = {
  bg: "#0A0A0B", card: "#111113", border: "#1E1E21",
  amber: "#D4A853", amberBg: "rgba(212,168,83,0.08)",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.08)",
  red: "#EF4444", redBg: "rgba(239,68,68,0.08)",
  orange: "#F97316", orangeBg: "rgba(249,115,22,0.08)",
  blue: "#3B82F6",
  text: "#E5E5E5", textMuted: "#888", textDim: "#555", ink: "#fff",
}

const tw = { revenue: 28420, covers: 842, avgSpend: 33.75, labourPct: 31.2, labourCost: 8867, wetGP: 72.1, foodGP: 66.8, staffHours: 284, compliance: 96 }
const lw = { revenue: 30180, covers: 891, avgSpend: 33.87, labourPct: 29.8, labourCost: 8994, wetGP: 73.4, foodGP: 67.2, staffHours: 272, compliance: 98 }

function pctChange(a, b) { return ((a - b) / b * 100).toFixed(1) }

const dailyBreakdown = [
  { day: "Mon", rev: 3200, target: 3800, prevRev: 3600 },
  { day: "Tue", rev: 3842, target: 4200, prevRev: 4100 },
  { day: "Wed", rev: 3680, target: 4000, prevRev: 4050 },
  { day: "Thu", rev: 4420, target: 4600, prevRev: 4580 },
  { day: "Fri", rev: 5480, target: 5800, prevRev: 5820 },
  { day: "Sat", rev: 5960, target: 6200, prevRev: 6180 },
  { day: "Sun", rev: 1838, target: 3400, prevRev: 1850 },
]

const labourCurve = [
  { hour: "10", staff: 3, revPerHead: 40 }, { hour: "11", staff: 4, revPerHead: 70 },
  { hour: "12", staff: 6, revPerHead: 87 }, { hour: "13", staff: 7, revPerHead: 97 },
  { hour: "14", staff: 6, revPerHead: 68 }, { hour: "15", staff: 5, revPerHead: 44 },
  { hour: "16", staff: 4, revPerHead: 45 }, { hour: "17", staff: 5, revPerHead: 68 },
  { hour: "18", staff: 7, revPerHead: 83 }, { hour: "19", staff: 8, revPerHead: 90 },
  { hour: "20", staff: 8, revPerHead: 111 }, { hour: "21", staff: 8, revPerHead: 95 },
  { hour: "22", staff: 6, revPerHead: 80 }, { hour: "23", staff: 4, revPerHead: 53 },
]

const gpByCategory = [
  { category: "Draught Beer", w1: 68.2, w2: 67.8, w3: 66.5, w4: 65.1, target: 70, trend: "down" },
  { category: "Bottled Beer", w1: 72.1, w2: 72.4, w3: 71.8, w4: 72.0, target: 72, trend: "stable" },
  { category: "Spirits", w1: 78.5, w2: 79.1, w3: 78.2, w4: 77.8, target: 78, trend: "stable" },
  { category: "Cocktails", w1: 82.4, w2: 81.8, w3: 80.2, w4: 78.8, target: 80, trend: "down" },
  { category: "Wine by Glass", w1: 71.2, w2: 70.8, w3: 71.5, w4: 72.1, target: 72, trend: "up" },
  { category: "Wine by Bottle", w1: 65.8, w2: 66.2, w3: 66.0, w4: 66.4, target: 65, trend: "up" },
  { category: "Soft Drinks", w1: 74.0, w2: 73.8, w3: 74.2, w4: 74.1, target: 74, trend: "stable" },
  { category: "Food", w1: 67.2, w2: 66.8, w3: 66.4, w4: 66.8, target: 66, trend: "stable" },
]

const wins = [
  "Saturday hit \u00A35,960 revenue \u2014 96% of target despite 2 no-shows on large bookings",
  "Average spend increased to \u00A333.75, up from \u00A332.10 four weeks ago (+5.1%)",
  "Wine by glass GP% recovered to 72.1% after switching to Viognier at lower cost",
  "Zero compliance incidents on Friday/Saturday \u2014 busiest nights, highest risk",
  "New starter Anya completed Week 2 training ahead of schedule, positive peer feedback",
]

const concerns = [
  { text: "Revenue down 5.8% week-on-week (\u00A328,420 vs \u00A330,180). Weather and 2 cancelled corporate bookings main drivers", sev: "warning" },
  { text: "Labour at 31.2% \u2014 Tuesday and Wednesday overstaffed by estimated 1.5 heads (\u00A3204 excess cost)", sev: "critical" },
  { text: "Draught beer GP% in freefall: 68.2% \u2192 65.1% over 4 weeks. \u00A3340/week in estimated wastage", sev: "critical" },
  { text: "Cocktail GP% dropped from 82.4% to 78.8% \u2014 vanilla extract price increase and overpouring suspected", sev: "warning" },
  { text: "Sunday continues to underperform: \u00A31,838 vs \u00A33,400 target (54%). Consider reduced hours or targeted promo", sev: "warning" },
]

const actions = [
  { action: "Schedule draught line clean and bartender pour audit", impact: "Recovery: ~\u00A3340/week GP", priority: 1, effort: "Low" },
  { action: "Cut 1 staff from Tuesday (18-23) and Wednesday (18-22)", impact: "Saving: ~\u00A3204/week labour", priority: 2, effort: "Low" },
  { action: "Renegotiate vanilla extract or switch to Nielsen-Massey", impact: "Recovery: ~\u00A336/week on Espresso Martini", priority: 3, effort: "Medium" },
  { action: "Launch Christmas outbound campaign to 186 contacts", impact: "Potential: \u00A314,720 additional Dec revenue", priority: 4, effort: "Medium" },
  { action: "Trial Sunday brunch concept or close kitchen by 16:00", impact: "Increase Sunday rev 40%+ or save \u00A3400/week", priority: 5, effort: "High" },
]

function StatusDot({ status }) {
  const colors = { green: C.green, amber: C.orange, red: C.red }
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status] || C.textDim }} />
}

function SC({ title, icon: Icon, children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {title && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>{Icon && <Icon size={16} color={C.amber} />}<div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</div></div>}
      {children}
    </div>
  )
}

function MetricRow({ label, curr, prev, fmt, target, invert }) {
  const d = parseFloat(pctChange(curr, prev))
  const good = invert ? d <= 0 : d >= 0
  const atTarget = target !== undefined ? (invert ? curr <= target : curr >= target) : null
  const fmtVal = (v) => fmt === "currency" ? `\u00A3${v.toLocaleString()}` : fmt === "pct" ? `${v}%` : v
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ flex: 1, fontSize: 12, color: C.text }}>{label}</div>
      <div style={{ width: 90, fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{fmtVal(curr)}</div>
      <div style={{ width: 90, fontSize: 12, color: C.textMuted, textAlign: "right" }}>{fmtVal(prev)}</div>
      <div style={{ width: 70, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
        {Math.abs(d) < 0.5 ? <Minus size={12} color={C.orange} /> : good ? <ArrowUpRight size={12} color={C.green} /> : <ArrowDownRight size={12} color={C.red} />}
        <span style={{ fontSize: 11, color: good ? C.green : C.red, fontFamily: "'JetBrains Mono', monospace" }}>{d >= 0 ? "+" : ""}{d}%</span>
      </div>
      {target !== undefined && <div style={{ width: 20, display: "flex", justifyContent: "flex-end" }}><StatusDot status={atTarget ? "green" : "amber"} /></div>}
    </div>
  )
}

export default function OpsWeekly() {
  return (
    <div className="animate-in">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>Weekly Ops Report</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Week 12 (18-24 Mar 2026) vs Week 11 (11-17 Mar 2026)</div>
      </div>

      <SC title="Week-on-Week Comparison" icon={BarChart3} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 40, marginBottom: 8 }}>
          <div style={{ flex: 1 }} />
          <div style={{ width: 90, fontSize: 10, fontWeight: 600, color: C.amber, textAlign: "right", textTransform: "uppercase", letterSpacing: "0.5px" }}>This Week</div>
          <div style={{ width: 90, fontSize: 10, fontWeight: 600, color: C.textDim, textAlign: "right", textTransform: "uppercase", letterSpacing: "0.5px" }}>Last Week</div>
          <div style={{ width: 70, fontSize: 10, fontWeight: 600, color: C.textDim, textAlign: "right", textTransform: "uppercase", letterSpacing: "0.5px" }}>Change</div>
          <div style={{ width: 20 }} />
        </div>
        <MetricRow label="Total Revenue" curr={tw.revenue} prev={lw.revenue} fmt="currency" />
        <MetricRow label="Total Covers" curr={tw.covers} prev={lw.covers} />
        <MetricRow label="Avg Spend / Head" curr={tw.avgSpend} prev={lw.avgSpend} fmt="currency" />
        <MetricRow label="Labour %" curr={tw.labourPct} prev={lw.labourPct} fmt="pct" target={32} invert />
        <MetricRow label="Labour Cost" curr={tw.labourCost} prev={lw.labourCost} fmt="currency" invert />
        <MetricRow label="Staff Hours" curr={tw.staffHours} prev={lw.staffHours} invert />
        <MetricRow label="Wet GP%" curr={tw.wetGP} prev={lw.wetGP} fmt="pct" target={73} />
        <MetricRow label="Food GP%" curr={tw.foodGP} prev={lw.foodGP} fmt="pct" target={66} />
        <MetricRow label="Compliance %" curr={tw.compliance} prev={lw.compliance} fmt="pct" target={95} />
      </SC>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        <SC title="Daily Revenue: This Week vs Last Week" icon={Calendar}>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <ComposedChart data={dailyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="day" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${(v/1000).toFixed(1)}k`} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} labelStyle={{ color: C.ink }} formatter={(v) => [v ? `\u00A3${v.toLocaleString()}` : "-", ""]} />
                <Bar dataKey="target" fill={C.border} radius={[2, 2, 0, 0]} name="Target" barSize={16} />
                <Bar dataKey="prevRev" fill={C.textDim} radius={[2, 2, 0, 0]} name="Last Week" barSize={16} />
                <Bar dataKey="rev" fill={C.amber} radius={[2, 2, 0, 0]} name="This Week" barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>Underperformance concentrated Mon-Wed. Thu-Sat within 6% of target. Sunday remains structurally weak at 54%.</div>
        </SC>

        <SC title="Labour Hours vs Revenue/Head" icon={Users}>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <ComposedChart data={labourCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="hour" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="staff" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <YAxis yAxisId="rev" orientation="right" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${v}`} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} labelStyle={{ color: C.ink }} labelFormatter={l => `${l}:00`} />
                <Bar yAxisId="staff" dataKey="staff" fill={C.blue + "40"} name="Staff Count" radius={[2, 2, 0, 0]} />
                <Line yAxisId="rev" type="monotone" dataKey="revPerHead" stroke={C.amber} strokeWidth={2} dot={false} name="Rev/Staff" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}><span style={{ color: C.red, fontWeight: 600 }}>Overstaffed 14:00-17:00:</span> Rev per staff drops to &pound;44-45 (target: &pound;70+). Stagger starts to shift labour into peak hours.</div>
        </SC>
      </div>

      <SC title={"GP% by Category \u2014 4 Week Trend"} icon={TrendingUp} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Category", "W9", "W10", "W11", "W12", "Target", "Trend", ""].map(h => <th key={h} style={{ textAlign: h === "Category" ? "left" : "right", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
            <tbody>
              {gpByCategory.map((cat, i) => {
                const ok = cat.w4 >= cat.target
                return (
                  <tr key={i}>
                    <td style={{ padding: "10px", fontSize: 12, color: C.text, borderBottom: `1px solid ${C.border}` }}>{cat.category}</td>
                    {[cat.w1, cat.w2, cat.w3, cat.w4].map((v, j) => <td key={j} style={{ padding: "10px", fontSize: 12, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: j === 3 ? (ok ? C.green : C.red) : C.textMuted, fontWeight: j === 3 ? 600 : 400, borderBottom: `1px solid ${C.border}` }}>{v}%</td>)}
                    <td style={{ padding: "10px", fontSize: 12, textAlign: "right", color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{cat.target}%</td>
                    <td style={{ padding: "10px", textAlign: "right", borderBottom: `1px solid ${C.border}` }}>{cat.trend === "up" ? <ArrowUpRight size={14} color={C.green} /> : cat.trend === "down" ? <ArrowDownRight size={14} color={C.red} /> : <Minus size={14} color={C.orange} />}</td>
                    <td style={{ padding: "10px", textAlign: "right", borderBottom: `1px solid ${C.border}` }}><StatusDot status={ok ? "green" : "amber"} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: C.bg, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: C.amber }}>AI: </span>
          Draught beer GP is your biggest problem &mdash; down 3.1% over 4 weeks (68.2% to 65.1%), now 4.9% below target. At current volumes, that&apos;s &pound;340/week in lost margin. Cocktail GP also sliding due to input cost increases. Wine by glass recovered after the Viognier switch. Focus this week: draught lines and cocktail costs.
        </div>
      </SC>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        <SC title="Top 5 Wins" icon={Award}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {wins.map((w, i) => <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: C.greenBg, borderLeft: `3px solid ${C.green}`, fontSize: 12, color: C.text, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 8 }}><CheckCircle size={14} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} /><span>{w}</span></div>)}
          </div>
        </SC>
        <SC title="Top 5 Concerns" icon={AlertTriangle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {concerns.map((c, i) => { const col = c.sev === "critical" ? C.red : C.orange; const bg = c.sev === "critical" ? C.redBg : C.orangeBg; return <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: bg, borderLeft: `3px solid ${col}`, fontSize: 12, color: C.text, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 8 }}><AlertTriangle size={14} color={col} style={{ flexShrink: 0, marginTop: 2 }} /><span>{c.text}</span></div> })}
          </div>
        </SC>
      </div>

      <SC title={"Recommended Actions \u2014 Prioritised by Impact"} icon={Zap} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {actions.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: i === 0 ? C.amberBg : C.bg, border: `1px solid ${i === 0 ? C.amber + "30" : C.border}`, borderRadius: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: i === 0 ? C.amber : C.border, color: i === 0 ? "#000" : C.textMuted, fontSize: 12, fontWeight: 700 }}>{a.priority}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{a.action}</div><div style={{ fontSize: 11, color: C.textMuted }}>{a.impact}</div></div>
              <div style={{ padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: a.effort === "Low" ? C.greenBg : a.effort === "Medium" ? C.orangeBg : C.redBg, color: a.effort === "Low" ? C.green : a.effort === "Medium" ? C.orange : C.red, textTransform: "uppercase" }}>{a.effort}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: "linear-gradient(135deg, rgba(212,168,83,0.06), rgba(212,168,83,0.02))", border: "1px solid rgba(212,168,83,0.15)", fontSize: 12, color: C.text, lineHeight: 1.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Brain size={14} color={C.amber} /><span style={{ fontWeight: 600, color: C.amber }}>AI Weekly Summary</span></div>
          Softer week driven by weather and 2 cancelled corporate bookings. The underlying metrics matter more: labour efficiency is slipping (Tuesday/Wednesday overstaffing), and wet GP is eroding through draught wastage and input cost increases. Average spend is trending right (+5.1% over 4 weeks). The two urgent fixes &mdash; draught line clean and rota cuts &mdash; would recover an estimated &pound;544/week (&pound;28,288/year) in combined savings. Low-effort, high-impact. Do them this week.
        </div>
      </SC>
    </div>
  )
}
