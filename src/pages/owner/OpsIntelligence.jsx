import { useState } from "react"
import {
  TrendingUp, TrendingDown, AlertTriangle, Users,
  Zap, ChevronDown, ChevronUp, BarChart3,
  CloudRain, ArrowUpRight, ArrowDownRight, Minus,
  Brain, Target, Activity, Heart
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell } from "recharts"

const C = {
  bg: "#0A0A0B", card: "#111113", cardHover: "#161618", border: "#1E1E21",
  amber: "#D4A853", amberDark: "#A67C2E", amberBg: "rgba(212,168,83,0.08)",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.08)",
  red: "#EF4444", redBg: "rgba(239,68,68,0.08)",
  orange: "#F97316", orangeBg: "rgba(249,115,22,0.08)",
  blue: "#3B82F6", blueBg: "rgba(59,130,246,0.08)",
  text: "#E5E5E5", textMuted: "#888", textDim: "#555", ink: "#fff",
}

const today = new Date()
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const dayOfWeek = dayNames[today.getDay()]
const dateStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

const flash = {
  revenue: { actual: 3842, target: 4200, pctOfTarget: 91.5 },
  covers: { actual: 128, target: 145, avgForDay: 139 },
  avgSpend: { actual: 30.02, target: 28.97, trend: 3.6 },
  labour: { pct: 33.8, target: "28-32%", cost: 1299, status: "amber" },
  wetGP: { pct: 71.2, target: "73-75%", status: "amber" },
  foodGP: { pct: 66.4, target: "65-68%", status: "green" },
  cashVariance: { amount: -14.20, status: "green" },
  compliance: {
    tempChecks: { done: 3, required: 4, status: "amber" },
    openingChecklist: { status: "green" },
    closingChecklist: { status: "green" },
    allergenLog: { status: "green" },
  },
  weather: { condition: "Overcast / Light Rain", temp: 9 },
  aiInsight: `Revenue was 8.1% below your ${dayOfWeek} average (\u00A34,180). Weather was overcast with light rain \u2014 historically your rainy ${dayOfWeek} trade drops 10-12%. No action needed. Average spend was up 3.6% at \u00A330.02, suggesting the covers you did get were higher quality. Focus tonight on maximising per-head spend rather than chasing volume.`,
}

const venueHealth = {
  score: 74, trend: "declining", trendDelta: -4,
  components: [
    { name: "Revenue Trend", score: 72, weight: 20, status: "amber", detail: "3-week declining, down 6% vs prior month" },
    { name: "Labour Efficiency", score: 64, weight: 20, status: "amber", detail: "33.8%, 1.8% above upper target" },
    { name: "Gross Profit %", score: 71, weight: 20, status: "amber", detail: "Wet GP 71.2% (target 73%). Food GP 66.4% OK" },
    { name: "Customer Satisfaction", score: 82, weight: 15, status: "green", detail: "Google 4.3, TripAdvisor 4.5. 2 negative reviews (slow service)" },
    { name: "Compliance", score: 78, weight: 15, status: "green", detail: "1 missed temp check. 98% rate this month" },
    { name: "Team Stability", score: 80, weight: 10, status: "green", detail: "No leavers in 4 weeks. 1 new starter (Anya, Week 2)" },
  ],
  aiNarrative: "Venue health declined 4pts this week, driven by GP% falling to 71.2% on wet side \u2014 check draught beer wastage and pour measures. Labour running hot at 33.8% due to Tuesday/Wednesday overstaffing. Revenue trend soft but weather-related. Customer satisfaction strong. Action: focus on GP recovery, review Tue/Wed rota.",
}

const radarData = venueHealth.components.map(c => ({ metric: c.name, score: c.score }))

const predictiveAlerts = [
  { severity: "critical", icon: Users, title: "Friday understaffed",
    detail: "Friday forecast: 182 covers (weather: clear + 14\u00B0C, 94 bookings confirmed, historical avg: 168). Current rota covers 150 max. Add 1 bartender 18:00-22:00 and 1 floor 19:00-23:00. Additional cost: \u00A3168. Revenue at risk: \u00A3960.",
    metric: "182 covers forecast", action: "Add 2 staff to Friday rota" },
  { severity: "warning", icon: TrendingDown, title: "Espresso Martini margin erosion",
    detail: "Margin dropped 3.2% this month (82% \u2192 78.8%). Vanilla extract supplier (Heilala) increased price 15%. This cocktail generates \u00A31,131/week \u2014 margin drop costs \u00A336/week (\u00A31,872/year). Switch to Nielsen-Massey (\u00A316.20/500ml) or increase sell price \u00A314 \u2192 \u00A314.50.",
    metric: "3.2% margin drop", action: "Switch vanilla supplier or increase price" },
  { severity: "warning", icon: AlertTriangle, title: "Staff turnover risk: Marcus T.",
    detail: "Marcus Thompson (Senior Bartender, 14 months) has not picked up extra shifts in 3 weeks (was averaging 2.1/week). Declined last 2 swap requests (previously 80% acceptance). Matches pre-resignation behaviour in 73% of cases. Replacement cost: \u00A34,000+ plus 4-6 weeks productivity loss.",
    metric: "0 extra shifts (was 2.1/week)", action: "Schedule 1:1 with Marcus this week" },
  { severity: "info", icon: Target, title: "Christmas bookings lagging",
    detail: "12 confirmed vs 20 at this point last year (\u221240%). Avg party spend: \u00A31,840. Revenue at risk: \u00A314,720. You have 186 corporate contacts. Last year first outbound email generated 8 bookings in 2 weeks.",
    metric: "40% below last year", action: "Launch Christmas outbound campaign" },
  { severity: "info", icon: Zap, title: "Draught beer wastage above threshold",
    detail: "4.8% wastage this month (target: 3%). Equates to \u00A3340/week lost. Peroni 6.1%, Guinness 5.2%, Camden Hells 4.4%. Last line clean: 9 days ago (target: 7). After line cleans wastage typically drops to 2.8%.",
    metric: "4.8% (target 3%)", action: "Schedule line clean + review pours" },
]

const hourlyRevenue = [
  { hour: "10", rev: 120 }, { hour: "11", rev: 280 }, { hour: "12", rev: 520 },
  { hour: "13", rev: 680 }, { hour: "14", rev: 410 }, { hour: "15", rev: 220 },
  { hour: "16", rev: 180 }, { hour: "17", rev: 340 }, { hour: "18", rev: 580 },
  { hour: "19", rev: 720 }, { hour: "20", rev: 890 }, { hour: "21", rev: 760 },
  { hour: "22", rev: 480 }, { hour: "23", rev: 210 },
]

const weekTrend = [
  { day: "Mon", rev: 3200, target: 3800 }, { day: "Tue", rev: 3842, target: 4200 },
  { day: "Wed", rev: null, target: 4000 }, { day: "Thu", rev: null, target: 4600 },
  { day: "Fri", rev: null, target: 5800 }, { day: "Sat", rev: null, target: 6200 },
  { day: "Sun", rev: null, target: 3400 },
]

function StatusDot({ status }) {
  const colors = { green: C.green, amber: C.orange, red: C.red }
  return <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[status] || C.textDim, boxShadow: `0 0 6px ${colors[status] || C.textDim}40` }} />
}

function KPICard({ label, value, sub, status }) {
  const sc = { green: C.green, amber: C.orange, red: C.red }
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, borderLeft: `3px solid ${sc[status] || C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
        <StatusDot status={status} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function SC({ title, icon: Icon, children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>{Icon && <Icon size={16} color={C.amber} />}<div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</div></div>
      {children}
    </div>
  )
}

function AlertCard({ alert, expanded, onToggle }) {
  const sc = { critical: C.red, warning: C.orange, info: C.blue }
  const sb = { critical: C.redBg, warning: C.orangeBg, info: C.blueBg }
  const Icon = alert.icon
  return (
    <div style={{ background: expanded ? sb[alert.severity] : C.card, border: `1px solid ${expanded ? sc[alert.severity] + "30" : C.border}`, borderLeft: `3px solid ${sc[alert.severity]}`, borderRadius: 10, overflow: "hidden" }}>
      <div onClick={onToggle} style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={18} color={sc[alert.severity]} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{alert.title}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: sc[alert.severity] + "20", color: sc[alert.severity], textTransform: "uppercase", fontWeight: 600 }}>{alert.severity}</span>
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{alert.metric}</div>
        </div>
        {expanded ? <ChevronUp size={16} color={C.textDim} /> : <ChevronDown size={16} color={C.textDim} />}
      </div>
      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 12 }}>{alert.detail}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, background: sc[alert.severity] + "15", border: `1px solid ${sc[alert.severity]}30`, fontSize: 12, fontWeight: 600, color: sc[alert.severity] }}>
            <Zap size={12} /> {alert.action}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OpsIntelligence() {
  const [expandedAlert, setExpandedAlert] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? predictiveAlerts : predictiveAlerts.slice(0, 3)

  return (
    <div className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>AI Operations Hub</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{dayOfWeek}, {dateStr} &mdash; Morning Flash Report</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <CloudRain size={16} color={C.blue} />
          <span style={{ fontSize: 12, color: C.text }}>{flash.weather.temp}&deg;C</span>
          <span style={{ fontSize: 11, color: C.textDim }}>{flash.weather.condition}</span>
        </div>
      </div>

      <div className="grid-kpi-5" style={{ marginBottom: 16 }}>
        <KPICard label="Revenue Yesterday" value={`\u00A3${flash.revenue.actual.toLocaleString()}`} sub={`Target: \u00A3${flash.revenue.target.toLocaleString()} (${flash.revenue.pctOfTarget}%)`} status={flash.revenue.pctOfTarget >= 95 ? "green" : flash.revenue.pctOfTarget >= 85 ? "amber" : "red"} />
        <KPICard label="Covers" value={flash.covers.actual} sub={`Target: ${flash.covers.target} | Avg: ${flash.covers.avgForDay}`} status={flash.covers.actual >= flash.covers.target ? "green" : "amber"} />
        <KPICard label="Avg Spend / Head" value={`\u00A3${flash.avgSpend.actual.toFixed(2)}`} sub={`${flash.avgSpend.trend >= 0 ? "+" : ""}${flash.avgSpend.trend}% vs target`} status={flash.avgSpend.trend >= 0 ? "green" : "amber"} />
        <KPICard label="Labour Cost %" value={`${flash.labour.pct}%`} sub={`Target: ${flash.labour.target}`} status={flash.labour.status} />
        <KPICard label="Cash Variance" value={`\u00A3${Math.abs(flash.cashVariance.amount).toFixed(2)}`} sub={flash.cashVariance.amount < 0 ? "Under (banked < POS)" : "Over"} status={flash.cashVariance.status} />
      </div>

      <div className="grid-kpi-3" style={{ marginBottom: 16 }}>
        <KPICard label="Wet GP%" value={`${flash.wetGP.pct}%`} sub={`Target: ${flash.wetGP.target}`} status={flash.wetGP.status} />
        <KPICard label="Food GP%" value={`${flash.foodGP.pct}%`} sub={`Target: ${flash.foodGP.target}`} status={flash.foodGP.status} />
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", marginBottom: 10 }}>Compliance</div>
          {[["Temp Checks", flash.compliance.tempChecks.status, `${flash.compliance.tempChecks.done}/${flash.compliance.tempChecks.required}`],
            ["Opening Checklist", flash.compliance.openingChecklist.status, "Complete"],
            ["Closing Checklist", flash.compliance.closingChecklist.status, "Complete"],
            ["Allergen Log", flash.compliance.allergenLog.status, "Up to date"],
          ].map(([label, status, detail], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><StatusDot status={status} /><span style={{ fontSize: 12, color: C.text }}>{label}</span></div>
              <span style={{ fontSize: 11, color: C.textMuted }}>{detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderRadius: 10, marginBottom: 16, background: "linear-gradient(135deg, rgba(212,168,83,0.06), rgba(212,168,83,0.02))", border: "1px solid rgba(212,168,83,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Brain size={16} color={C.amber} /><span style={{ fontSize: 13, fontWeight: 600, color: C.amber }}>AI Morning Insight</span></div>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{flash.aiInsight}</div>
      </div>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        <SC title="Venue Health Score" icon={Heart}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={venueHealth.score >= 80 ? C.green : C.orange} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${venueHealth.score * 2.64} ${264 - venueHealth.score * 2.64}`} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{venueHealth.score}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <ArrowDownRight size={14} color={C.red} />
                  <span style={{ fontSize: 10, color: C.red }}>{venueHealth.trendDelta}pts</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {venueHealth.components.map((comp, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: i < venueHealth.components.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <StatusDot status={comp.status} />
                  <span style={{ fontSize: 11, color: C.text, flex: 1 }}>{comp.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.ink, fontFamily: "'JetBrains Mono', monospace", width: 30, textAlign: "right" }}>{comp.score}</span>
                  <span style={{ fontSize: 10, color: C.textDim, width: 25, textAlign: "right" }}>{comp.weight}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 200, marginBottom: 12 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: C.textMuted, fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke={C.amber} fill={C.amber} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 8, background: C.bg, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: C.amber }}>AI: </span>{venueHealth.aiNarrative}
          </div>
        </SC>

        <SC title="Predictive Alerts" icon={Zap}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {displayed.map((alert, i) => <AlertCard key={i} alert={alert} expanded={expandedAlert === i} onToggle={() => setExpandedAlert(expandedAlert === i ? -1 : i)} />)}
          </div>
          {predictiveAlerts.length > 3 && (
            <button onClick={() => setShowAll(!showAll)} style={{ marginTop: 10, padding: "8px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}>
              {showAll ? "Show fewer" : `Show all ${predictiveAlerts.length} alerts`}
            </button>
          )}
        </SC>
      </div>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        <SC title={"Yesterday\u2019s Revenue by Hour"} icon={BarChart3}>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={hourlyRevenue}>
                <XAxis dataKey="hour" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${v}`} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: C.ink }} formatter={v => [`\u00A3${v}`, "Revenue"]} labelFormatter={l => `${l}:00`} />
                <Bar dataKey="rev" radius={[3, 3, 0, 0]}>
                  {hourlyRevenue.map((e, i) => <Cell key={i} fill={e.rev >= 600 ? C.amber : e.rev >= 300 ? C.amberDark + "80" : C.border} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>Peak: 20:00 (&pound;890). Dead zone: 15:00-17:00 (&pound;180-220). Consider afternoon happy hour.</div>
        </SC>

        <SC title="This Week: Actual vs Target" icon={TrendingUp}>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={weekTrend}>
                <XAxis dataKey="day" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${(v/1000).toFixed(1)}k`} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: C.ink }} formatter={v => [v ? `\u00A3${v.toLocaleString()}` : "Pending", ""]} />
                <Bar dataKey="target" fill={C.border} radius={[3, 3, 0, 0]} name="Target" />
                <Bar dataKey="rev" fill={C.amber} radius={[3, 3, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>MTD: &pound;7,042 vs &pound;8,000 target (88%). &pound;958 behind. Friday/Saturday must perform.</div>
        </SC>
      </div>

      <SC title="Health Score Detail" icon={Activity} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Component", "Score", "Weight", "Weighted", "Status", "Detail"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
            <tbody>
              {venueHealth.components.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", fontSize: 12, color: C.text, borderBottom: `1px solid ${C.border}` }}>{c.name}</td>
                  <td style={{ padding: "10px", fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${C.border}` }}>{c.score}</td>
                  <td style={{ padding: "10px", fontSize: 12, color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>{c.weight}%</td>
                  <td style={{ padding: "10px", fontSize: 12, color: C.amber, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${C.border}` }}>{(c.score * c.weight / 100).toFixed(1)}</td>
                  <td style={{ padding: "10px", borderBottom: `1px solid ${C.border}` }}><StatusDot status={c.status} /></td>
                  <td style={{ padding: "10px", fontSize: 11, color: C.textMuted, borderBottom: `1px solid ${C.border}`, maxWidth: 300 }}>{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SC>
    </div>
  )
}
