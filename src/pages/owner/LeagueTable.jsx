import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import {
  Trophy, TrendingUp, TrendingDown, Minus, Star, Users, PoundSterling,
  Percent, ChevronDown, ChevronUp, Award, Target, Building2
} from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const VENUES = [
  {
    id: 1, name: 'The Ivy Chelsea Garden', gm: 'Sophie Mitchell',
    revenue: 195000, revTarget: 185000, revTrend: 'up',
    gp: 68.4, gpTarget: 67, gpTrend: 'up',
    labour: 29.2, labourTarget: 30, labourTrend: 'down',
    rating: 4.6, ratingTrend: 'up',
    retention: 89, retentionTarget: 85, retentionTrend: 'up',
    covers: 4200, ebitda: 22.1,
    composite: 92,
    insights: 'Strongest all-round performer. GP% consistently above target, labour well-controlled. Customer ratings improving month-on-month. Sarah Mitchell (Bar Lead) driving exceptional bar revenue.',
    monthlyRevenue: [
      { month: 'Oct', rev: 168000 }, { month: 'Nov', rev: 178000 }, { month: 'Dec', rev: 220000 },
      { month: 'Jan', rev: 155000 }, { month: 'Feb', rev: 172000 }, { month: 'Mar', rev: 195000 },
    ],
  },
  {
    id: 2, name: 'The Ivy Soho Brasserie', gm: 'James Carter',
    revenue: 182000, revTarget: 175000, revTrend: 'up',
    gp: 66.8, gpTarget: 67, gpTrend: 'down',
    labour: 31.5, labourTarget: 30, labourTrend: 'up',
    rating: 4.4, ratingTrend: 'stable',
    retention: 82, retentionTarget: 85, retentionTrend: 'down',
    covers: 3900, ebitda: 18.3,
    composite: 78,
    insights: 'Revenue above target but GP% slightly below and labour running hot at 31.5%. Staff retention declining — 3 departures in Q1. High foot traffic from Soho location compensating. Need to address labour scheduling.',
    monthlyRevenue: [
      { month: 'Oct', rev: 162000 }, { month: 'Nov', rev: 170000 }, { month: 'Dec', rev: 210000 },
      { month: 'Jan', rev: 148000 }, { month: 'Feb', rev: 165000 }, { month: 'Mar', rev: 182000 },
    ],
  },
  {
    id: 3, name: 'The Ivy City Garden', gm: 'Rachel Nguyen',
    revenue: 148000, revTarget: 155000, revTrend: 'down',
    gp: 65.2, gpTarget: 67, gpTrend: 'down',
    labour: 33.8, labourTarget: 30, labourTrend: 'up',
    rating: 4.2, ratingTrend: 'down',
    retention: 78, retentionTarget: 85, retentionTrend: 'down',
    covers: 3100, ebitda: 12.4,
    composite: 58,
    insights: 'Underperforming across all metrics. Revenue below target, GP% declining, labour 3.8pts above target. Customer ratings dropped from 4.4 to 4.2 over 3 months. Root cause appears to be GM capacity — Rachel is stretched thin managing both floor and admin. Recommend adding an Assistant GM.',
    monthlyRevenue: [
      { month: 'Oct', rev: 155000 }, { month: 'Nov', rev: 152000 }, { month: 'Dec', rev: 180000 },
      { month: 'Jan', rev: 138000 }, { month: 'Feb', rev: 142000 }, { month: 'Mar', rev: 148000 },
    ],
  },
  {
    id: 4, name: 'The Ivy Tower Bridge', gm: 'Daniel Park',
    revenue: 138000, revTarget: 140000, revTrend: 'stable',
    gp: 64.1, gpTarget: 67, gpTrend: 'down',
    labour: 32.1, labourTarget: 30, labourTrend: 'up',
    rating: 4.3, ratingTrend: 'stable',
    retention: 85, retentionTarget: 85, retentionTrend: 'stable',
    covers: 2800, ebitda: 9.8,
    composite: 65,
    insights: 'GP% is the main concern — dropping below 65% for first time. Ingredient costs rising faster than menu prices. Staff retention stable but labour % creeping up. Location delivers steady tourist foot traffic. Need menu price review urgently.',
    monthlyRevenue: [
      { month: 'Oct', rev: 132000 }, { month: 'Nov', rev: 135000 }, { month: 'Dec', rev: 168000 },
      { month: 'Jan', rev: 125000 }, { month: 'Feb', rev: 130000 }, { month: 'Mar', rev: 138000 },
    ],
  },
  {
    id: 5, name: 'The Ivy Kensington', gm: 'Laura Chen',
    revenue: 118000, revTarget: 120000, revTrend: 'down',
    gp: 67.8, gpTarget: 67, gpTrend: 'up',
    labour: 28.4, labourTarget: 30, labourTrend: 'down',
    rating: 4.5, ratingTrend: 'up',
    retention: 91, retentionTarget: 85, retentionTrend: 'up',
    covers: 2400, ebitda: 19.2,
    composite: 84,
    insights: 'Shoreditch is your best performer on GP% but worst on revenue. Laura runs a tight ship — labour below target, GP% above, ratings improving, best retention rate across all venues. The issue is purely top-line volume. Consider marketing push or events strategy to drive covers.',
    monthlyRevenue: [
      { month: 'Oct', rev: 110000 }, { month: 'Nov', rev: 115000 }, { month: 'Dec', rev: 145000 },
      { month: 'Jan', rev: 105000 }, { month: 'Feb', rev: 112000 }, { month: 'Mar', rev: 118000 },
    ],
  },
]

function trafficLight(value, target, goodDir) {
  if (goodDir === 'up') {
    if (value >= target) return C.green
    if (value >= target * 0.95) return C.orange
    return C.red
  } else {
    if (value <= target) return C.green
    if (value <= target * 1.05) return C.orange
    return C.red
  }
}

function TrendArrow({ trend }) {
  if (trend === 'up') return <TrendingUp size={14} color={C.green} />
  if (trend === 'down') return <TrendingDown size={14} color={C.red} />
  return <Minus size={14} color={C.textDim} />
}

export default function LeagueTable() {
  const [expandedVenue, setExpandedVenue] = useState(null)
  const [sortBy, setSortBy] = useState('composite')

  const sorted = [...VENUES].sort((a, b) => {
    if (sortBy === 'composite') return b.composite - a.composite
    if (sortBy === 'revenue') return b.revenue - a.revenue
    if (sortBy === 'gp') return b.gp - a.gp
    if (sortBy === 'labour') return a.labour - b.labour
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'retention') return b.retention - a.retention
    return 0
  })

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={22} color={C.amber} /> Multi-Venue League Table
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>Rank and compare all venues across key performance metrics</p>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: C.textDim, padding: '6px 0', marginRight: 8 }}>Sort by:</span>
        {[
          { key: 'composite', label: 'Overall' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'gp', label: 'GP%' },
          { key: 'labour', label: 'Labour' },
          { key: 'rating', label: 'Rating' },
          { key: 'retention', label: 'Retention' },
        ].map(s => (
          <button key={s.key} onClick={() => setSortBy(s.key)} style={{
            padding: '6px 14px', borderRadius: 6, border: `1px solid ${sortBy === s.key ? C.amber : C.border}`,
            background: sortBy === s.key ? C.amberBg : 'transparent', color: sortBy === s.key ? C.amber : C.textMuted,
            fontSize: 12, cursor: 'pointer',
          }}>{s.label}</button>
        ))}
      </div>

      {/* League Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map((v, rank) => {
          const isExpanded = expandedVenue === v.id
          const medal = rank === 0 ? '\uD83E\uDD47' : rank === 1 ? '\uD83E\uDD48' : rank === 2 ? '\uD83E\uDD49' : ''
          return (
            <div key={v.id} style={{
              background: C.card, border: `1px solid ${isExpanded ? C.amber + '40' : C.border}`,
              borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s',
            }}>
              {/* Main row */}
              <div
                onClick={() => setExpandedVenue(isExpanded ? null : v.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                {/* Rank */}
                <div style={{ width: 40, textAlign: 'center' }}>
                  {medal ? (
                    <span style={{ fontSize: 24 }}>{medal}</span>
                  ) : (
                    <span style={{ fontSize: 20, fontWeight: 700, color: C.textDim }}>#{rank + 1}</span>
                  )}
                </div>

                {/* Name + Composite */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>GM: {v.gm}</div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: 24 }}>
                  {[
                    { label: 'Revenue', value: `\u00A3${(v.revenue / 1000).toFixed(0)}k`, color: trafficLight(v.revenue, v.revTarget, 'up'), trend: v.revTrend },
                    { label: 'GP%', value: `${v.gp}%`, color: trafficLight(v.gp, v.gpTarget, 'up'), trend: v.gpTrend },
                    { label: 'Labour', value: `${v.labour}%`, color: trafficLight(v.labour, v.labourTarget, 'down'), trend: v.labourTrend },
                    { label: 'Rating', value: v.rating, color: v.rating >= 4.5 ? C.green : v.rating >= 4.0 ? C.orange : C.red, trend: v.ratingTrend },
                    { label: 'Retention', value: `${v.retention}%`, color: trafficLight(v.retention, v.retentionTarget, 'up'), trend: v.retentionTrend },
                  ].map((m, i) => (
                    <div key={i} style={{ textAlign: 'center', minWidth: 70 }}>
                      <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 2 }}>{m.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</span>
                        <TrendArrow trend={m.trend} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Composite Score */}
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 2 }}>Score</div>
                  <div style={{
                    fontSize: 22, fontWeight: 800,
                    color: v.composite >= 80 ? C.green : v.composite >= 65 ? C.orange : C.red,
                  }}>{v.composite}</div>
                </div>

                <div>{isExpanded ? <ChevronUp size={16} color={C.textDim} /> : <ChevronDown size={16} color={C.textDim} />}</div>
              </div>

              {/* Expanded Deep Dive */}
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
                  <div className="grid-2col" style={{ marginTop: 16 }}>
                    {/* Revenue Chart */}
                    <div style={{ background: C.bg, borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Monthly Revenue</div>
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={v.monthlyRevenue}>
                          <XAxis dataKey="month" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={val => `\u00A3${(val/1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 11 }} formatter={val => [`\u00A3${val.toLocaleString()}`, 'Revenue']} />
                          <Bar dataKey="rev" fill={C.amber} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Key Stats */}
                    <div style={{ background: C.bg, borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Key Stats</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { label: 'Monthly Covers', value: v.covers.toLocaleString() },
                          { label: 'EBITDA', value: `${v.ebitda}%` },
                          { label: 'Rev vs Target', value: `${v.revenue >= v.revTarget ? '+' : ''}${(((v.revenue - v.revTarget) / v.revTarget) * 100).toFixed(1)}%`, color: v.revenue >= v.revTarget ? C.green : C.red },
                          { label: 'Labour Gap', value: `${v.labour <= v.labourTarget ? '' : '+'}${(v.labour - v.labourTarget).toFixed(1)}pts`, color: v.labour <= v.labourTarget ? C.green : C.red },
                        ].map((s, j) => (
                          <div key={j} style={{ padding: 10, background: C.card, borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase' }}>{s.label}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: s.color || C.ink, marginTop: 2 }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div style={{ marginTop: 14, background: C.amberBg, border: `1px solid ${C.amber}25`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.amber, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Target size={12} /> AI Analysis
                    </div>
                    <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: 0 }}>{v.insights}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
