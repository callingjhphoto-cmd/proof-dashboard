import { Brain, Target, TrendingUp, TrendingDown, Star, AlertTriangle, Zap, Calendar, AlertCircle, Info } from 'lucide-react'

const dailyBriefing = {
  priorities: [
    { severity: 'warning', text: 'Labour running hot at 34%. Consider cutting Sarah\'s evening shift to 21:00 or moving Anya to Thursday instead. Saving: £36.' },
    { severity: 'info', text: 'Wine GP dropped to 62% this week (target 68%). Malbec by-the-glass is the main drag — current cost £4.20/glass on a £11 sell. Recommend switching to Trivento Reserve (£3.10/glass) or increasing price to £12.50.' },
    { severity: 'success', text: 'Friday fully booked at 142 covers (18% above average). Ensure 4 bar staff + 3 floor. Pre-batch Espresso Martinis and Negronis — these account for 38% of Friday cocktail orders.' },
  ],
  insight: 'This week\'s data shows a clear pattern: cocktail sales peak between 20:00-21:30 on Thursday-Saturday, accounting for 62% of weekly spirits revenue. Your Espresso Martini alone generates £1,131/week at 82% GP — it\'s your single highest-margin item. Consider a “Martini Hour” promotion on slower nights (Mon-Wed) to shift demand.'
}

const menuMatrix = {
  stars: [
    { item: 'Espresso Martini', popularity: 95, profit: 82, revenue: 1131 },
    { item: 'Negroni', popularity: 78, profit: 79, revenue: 806 },
    { item: 'Old Fashioned', popularity: 72, profit: 81, revenue: 672 },
  ],
  plowhorses: [
    { item: 'House Lager', popularity: 85, profit: 55, revenue: 510 },
    { item: 'House White Wine', popularity: 70, profit: 58, revenue: 420 },
    { item: 'Coca-Cola', popularity: 60, profit: 52, revenue: 180 },
  ],
  puzzles: [
    { item: 'Whisky Flight', popularity: 25, profit: 88, revenue: 225 },
    { item: 'Champagne Cocktail', popularity: 18, profit: 85, revenue: 270 },
    { item: 'Mezcal Paloma', popularity: 15, profit: 80, revenue: 180 },
  ],
  dogs: [
    { item: 'Shandy', popularity: 8, profit: 45, revenue: 48 },
    { item: 'Non-Alc Mojito', popularity: 12, profit: 42, revenue: 72 },
    { item: 'Mulled Wine (seasonal)', popularity: 5, profit: 38, revenue: 25 },
  ],
}

const revenuePerCover = [
  { week: 'W1', rpc: 42.50 }, { week: 'W2', rpc: 44.20 }, { week: 'W3', rpc: 41.80 },
  { week: 'W4', rpc: 45.10 }, { week: 'W5', rpc: 43.60 }, { week: 'W6', rpc: 46.30 },
  { week: 'W7', rpc: 44.80 }, { week: 'W8', rpc: 47.20 }, { week: 'W9', rpc: 45.50 },
  { week: 'W10', rpc: 48.10 }, { week: 'W11', rpc: 46.90 }, { week: 'W12', rpc: 49.20 },
]

const weekForecast = [
  { day: 'Mon', predicted: 62, actual: 58, revenue: 3180, weather: 'Overcast' },
  { day: 'Tue', predicted: 68, actual: 72, revenue: 3420, weather: 'Clear' },
  { day: 'Wed', predicted: 75, actual: null, revenue: null, weather: 'Clear' },
  { day: 'Thu', predicted: 85, actual: null, revenue: null, weather: 'Rainy' },
  { day: 'Fri', predicted: 142, actual: null, revenue: null, weather: 'Clear' },
  { day: 'Sat', predicted: 155, actual: null, revenue: null, weather: 'Clear' },
  { day: 'Sun', predicted: 95, actual: null, revenue: null, weather: 'Overcast' },
]

const sevColors = { critical: '#EF4444', warning: '#F97316', info: '#3B82F6', success: '#22C55E' }
const sevBg = { critical: 'rgba(239,68,68,0.08)', warning: 'rgba(249,115,22,0.08)', info: 'rgba(59,130,246,0.08)', success: 'rgba(34,197,94,0.08)' }

const matrixColors = { stars: '#D4A853', plowhorses: '#3B82F6', puzzles: '#A855F7', dogs: '#555' }
const matrixIcons = { stars: Star, plowhorses: TrendingDown, puzzles: Zap, dogs: AlertTriangle }
const matrixLabels = { stars: 'Stars (High Pop + High Profit)', plowhorses: 'Plowhorses (High Pop + Low Profit)', puzzles: 'Puzzles (Low Pop + High Profit)', dogs: 'Dogs (Low Pop + Low Profit)' }
const matrixActions = {
  stars: 'Protect these. Keep quality consistent. Feature prominently.',
  plowhorses: 'Increase price or reduce cost. These sell well but underperform on margin.',
  puzzles: 'Promote harder. These are profitable but undersold. Perfect for upselling.',
  dogs: 'Consider removing or reworking. They take up menu space and staff time.',
}

function Card({ title, icon: Icon, children, C, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {Icon && <Icon size={16} color={C.amber} />}
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

export default function Insights({ C }) {
  const avgRpc = revenuePerCover.reduce((s, w) => s + w.rpc, 0) / revenuePerCover.length
  const latestRpc = revenuePerCover[revenuePerCover.length - 1].rpc
  const rpcTrend = ((latestRpc - avgRpc) / avgRpc * 100).toFixed(1)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        AI Operator Insights
      </div>

      {/* Daily Briefing */}
      <Card title="Today's Operator Briefing" icon={Brain} C={C} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {dailyBriefing.priorities.map((p, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 8, background: sevBg[p.severity],
              borderLeft: `3px solid ${sevColors[p.severity]}`, fontSize: 13, color: C.text, lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 600, color: C.ink }}>Priority {i + 1}:</span> {p.text}
            </div>
          ))}
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 8, background: 'rgba(212,168,83,0.06)',
          border: `1px solid rgba(212,168,83,0.15)`, fontSize: 13, color: C.text, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 600, color: C.amber, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} /> Weekly Insight
          </div>
          {dailyBriefing.insight}
        </div>
      </Card>

      {/* Ops Director Intelligence */}
      <Card title="Operations Director Intelligence" icon={Target} C={C} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
          Deep operational insights with severity rating, current performance vs target, and recommended actions.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { severity: 'critical', metric: 'Wage-to-Revenue Ratio', current: '34%', target: '28-32%', icon: AlertCircle,
              insight: 'Your wage-to-revenue ratio is 34% \u2014 2% above the upper target of 32%. Tuesday and Wednesday are overstaffed by an estimated 1.5 heads each day. Combined excess cost: \u00A3204/week (\u00A310,608/year).',
              action: 'Cut 1 staff member from Tuesday evening (18:00-23:00) and 1 from Wednesday (18:00-22:00). Review Sunday staffing \u2014 you are paying for 5 staff on a day that generates \u00A31,838 (39.2% labour cost).' },
            { severity: 'critical', metric: 'Spirits Stock Variance', current: '4.2%', target: '2%', icon: AlertTriangle,
              insight: 'Stock variance on spirits is 4.2% (target: 2%). At current spirit revenue (\u00A34,800/week), this equates to \u00A3201/week in unaccounted product. Over a year, that is \u00A310,452. Possible causes: overpouring (most likely \u2014 free-pour accounts for 60% of variance in comparable venues), miscounting (20%), or theft (20%).',
              action: 'Implement measured pours on premium spirits (\u00A38+ cost/unit). Install jiggers at all stations. Run a 2-week pour audit comparing POS sales to stock movement. Focus on: vodka (highest variance at 5.8%), gin (4.1%), and tequila (3.9%).' },
            { severity: 'warning', metric: 'Average Dwell Time', current: '1.8 hours', target: '2.2 hours', icon: TrendingDown,
              insight: 'Your average dwell time is 1.8 hours. Industry benchmark for a premium bar-restaurant of your type is 2.2 hours. Each additional 10 minutes of dwell time correlates with \u00A34.20 additional spend (based on your data). Closing the 24-minute gap would add approximately \u00A310.08 per cover.',
              action: 'Train staff to offer dessert/coffee/digestif menu proactively. Current upsell rate on dessert is 12% (industry top performers: 25-30%). Coffee upsell: 18% (target: 35%). Introduce a "To Finish" card presented with the bill showing digestif options (\u00A38-14 price point). At 140 avg covers/day, converting an extra 15% to a \u00A310 dessert/digestif = \u00A3210/day.' },
            { severity: 'warning', metric: 'Draught Beer Wastage', current: '4.8%', target: '3%', icon: AlertTriangle,
              insight: 'Draught wastage this month: 4.8% (target: 3%). This equates to \u00A3340/week in lost product. Peroni (6.1%), Guinness (5.2%), Camden Hells (4.4%). Line cleaning log shows last clean was 9 days ago (target: every 7 days). Historical data: wastage drops to 2.8% in weeks following a line clean.',
              action: 'Schedule line clean today. Review first-pour technique on Peroni (likely over-pouring). Consider switching Guinness to a smaller keg size if daily throughput does not justify 50L. Estimated recovery if wastage returns to 3%: \u00A3237/week (\u00A312,324/year).' },
            { severity: 'info', metric: 'Pre-Dinner Cocktail Capture', current: '36%', target: '50%', icon: Target,
              insight: 'Your pre-dinner cocktail capture rate is 36% \u2014 meaning only 36% of dining customers order a cocktail before their meal. Best-in-class London venues achieve 55-65% (Hawksmoor: est. 65%). Your cocktail average ticket is \u00A314.20. Closing the gap to 50% would add approximately 20 additional cocktails per day.',
              action: 'Present cocktail menu to every table within 90 seconds of seating (current avg: 3.2 minutes). Add 3 "To Start" cocktails to the food menu first page. Train hosts to suggest "drinks at the bar while your table is prepared" for walk-ins. Estimated revenue uplift: \u00A3284/day (\u00A31,988/week).' },
            { severity: 'info', metric: 'Google Review Response Rate', current: '42%', target: '90%', icon: Star,
              insight: 'You respond to 42% of Google reviews (target: 90%+). Venues that respond to 90%+ of reviews see an average 0.2-0.3 star improvement over 6 months. You currently have 14 unresponded reviews from the last 30 days, including 3 negative reviews (2-star or below). Unanswered negative reviews are visible to every potential customer searching for your venue.',
              action: 'Respond to all 14 outstanding reviews this week. Set up a daily 10-minute slot to respond to new reviews. For negative reviews: acknowledge, do not argue, invite back. For positive: thank specifically, mention something personal. Consider an automated alert for new reviews below 3 stars.' },
          ].map((insight, i) => {
            const Icon = insight.icon
            return (
              <div key={i} style={{
                background: insight.severity === 'critical' ? 'rgba(239,68,68,0.04)' : insight.severity === 'warning' ? 'rgba(249,115,22,0.04)' : C.bg,
                border: `1px solid ${sevColors[insight.severity]}20`,
                borderLeft: `3px solid ${sevColors[insight.severity]}`,
                borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={16} color={sevColors[insight.severity]} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{insight.metric}</span>
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: sevColors[insight.severity] + '20', color: sevColors[insight.severity], textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{insight.severity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: C.textDim }}>Current</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: sevColors[insight.severity], fontFamily: "'JetBrains Mono', monospace" }}>{insight.current}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: C.textDim }}>Target</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{insight.target}</div>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 10 }}>{insight.insight}</div>
                <div style={{ padding: '10px 14px', borderRadius: 8, background: sevColors[insight.severity] + '08', border: `1px solid ${sevColors[insight.severity]}15` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: sevColors[insight.severity], textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={10} /> Recommended Action
                  </div>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{insight.action}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
        {/* Menu Engineering Matrix */}
        <Card title="Menu Engineering Matrix" icon={Target} C={C}>
          {Object.entries(menuMatrix).map(([type, items]) => {
            const Icon = matrixIcons[type]
            return (
              <div key={type} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon size={14} color={matrixColors[type]} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: matrixColors[type], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {matrixLabels[type]}
                  </span>
                </div>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                    borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none', fontSize: 12,
                  }}>
                    <span style={{ color: C.text }}>{item.item}</span>
                    <span style={{ color: C.textMuted }}>
                      Pop: {item.popularity}% {'•'} GP: {item.profit}% {'•'} <span style={{ color: C.amber }}>£{item.revenue}/wk</span>
                    </span>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, fontStyle: 'italic' }}>
                  {'→'} {matrixActions[type]}
                </div>
              </div>
            )
          })}
        </Card>

        {/* Revenue Per Cover */}
        <Card title="Revenue Per Cover Trend" icon={TrendingUp} C={C}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.ink }}>£{latestRpc.toFixed(2)}</div>
            <div style={{ fontSize: 12, color: parseFloat(rpcTrend) >= 0 ? C.green : C.red, marginTop: 4 }}>{parseFloat(rpcTrend) >= 0 ? '+' : ''}{rpcTrend}% vs 12-week avg (£{avgRpc.toFixed(2)})</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', gap: 4, height: 160, padding: '0 8px' }}>
            {revenuePerCover.map((w, i) => {
              const max = Math.max(...revenuePerCover.map(x => x.rpc))
              const min = Math.min(...revenuePerCover.map(x => x.rpc))
              const height = ((w.rpc - min) / (max - min)) * 120 + 20
              const isLatest = i === revenuePerCover.length - 1
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, color: isLatest ? C.amber : 'transparent' }}>£{w.rpc.toFixed(0)}</div>
                  <div style={{
                    width: '100%', height, borderRadius: '4px 4px 0 0',
                    background: isLatest ? C.amber : w.rpc >= avgRpc ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)',
                    transition: 'height 0.3s',
                  }} />
                  <div style={{ fontSize: 9, color: C.textDim }}>{w.week}</div>
                </div>
              )
            })}
          </div>
          <div style={{
            marginTop: 16, padding: '10px 12px', borderRadius: 8, background: C.bg,
            fontSize: 12, color: C.textMuted, lineHeight: 1.5,
          }}>
            Revenue per cover has increased 15.7% over 12 weeks, driven by cocktail upselling and the introduction of premium spirit flights. Continue training staff on premium recommendations.
          </div>
        </Card>
      </div>

      {/* AI Demand Forecast */}
      <Card title="AI Demand Forecast — This Week" icon={Calendar} C={C} style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>
          Predicted covers based on historical patterns, bookings, weather, and local events
        </div>
        <div className="grid-7day">
          {weekForecast.map((d, i) => {
            const isPast = d.actual !== null
            const accuracy = isPast ? Math.round((1 - Math.abs(d.predicted - d.actual) / d.predicted) * 100) : null
            return (
              <div key={i} style={{
                padding: 14, borderRadius: 10, textAlign: 'center',
                background: isPast ? 'rgba(34,197,94,0.04)' : C.bg,
                border: `1px solid ${isPast ? C.green + '30' : C.border}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{d.day}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: '6px 0' }}>{d.predicted}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>predicted</div>
                {isPast && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginTop: 6 }}>{d.actual} actual</div>
                    <div style={{ fontSize: 10, color: accuracy >= 90 ? C.green : C.orange }}>{accuracy}% accurate</div>
                  </>
                )}
                {d.revenue && (
                  <div style={{ fontSize: 11, color: C.amber, marginTop: 4 }}>{'£'}{d.revenue.toLocaleString()}</div>
                )}
                <div style={{ fontSize: 9, color: C.textDim, marginTop: 4 }}>{d.weather}</div>
              </div>
            )
          })}
        </div>
        <div style={{
          marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(212,168,83,0.06)',
          border: `1px solid rgba(212,168,83,0.15)`, fontSize: 12, color: C.text, lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600, color: C.amber }}>Staffing recommendation:</span> Friday and Saturday both forecast 140+ covers. Ensure 4 bar staff and 3 floor minimum on both days. Thursday forecast increased due to rainfall driving walk-in traffic.
        </div>
      </Card>
    </div>
  )
}
