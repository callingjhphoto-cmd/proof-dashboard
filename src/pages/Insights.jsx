import { Brain, Target, TrendingUp, TrendingDown, Star, AlertTriangle, Zap } from 'lucide-react'

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
    </div>
  )
}
