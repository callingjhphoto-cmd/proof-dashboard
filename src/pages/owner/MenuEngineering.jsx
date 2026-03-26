import { useState, useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  Star, TrendingUp, TrendingDown, Zap, PoundSterling, AlertTriangle,
  ChevronDown, ChevronUp, UtensilsCrossed, Coffee, Wine, Beer, Package
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

// Menu items with full data: 25 items
const MENU_ITEMS = [
  // COCKTAILS
  { id: 1, name: 'Espresso Martini', category: 'cocktails', price: 15.00, cost: 3.20, margin: 78.7, volume: 320, revenue: 4800, trend: 'up', quadrant: 'star' },
  { id: 2, name: 'Negroni', category: 'cocktails', price: 14.00, cost: 3.80, margin: 72.9, volume: 210, revenue: 2940, trend: 'stable', quadrant: 'star' },
  { id: 3, name: 'Old Fashioned', category: 'cocktails', price: 15.00, cost: 4.20, margin: 72.0, volume: 185, revenue: 2775, trend: 'up', quadrant: 'star' },
  { id: 4, name: 'Aperol Spritz', category: 'cocktails', price: 13.00, cost: 3.00, margin: 76.9, volume: 280, revenue: 3640, trend: 'up', quadrant: 'star' },
  { id: 5, name: 'Mojito', category: 'cocktails', price: 13.00, cost: 4.50, margin: 65.4, volume: 240, revenue: 3120, trend: 'down', quadrant: 'plowhorse' },
  { id: 6, name: 'Pornstar Martini', category: 'cocktails', price: 14.50, cost: 3.60, margin: 75.2, volume: 195, revenue: 2828, trend: 'up', quadrant: 'star' },
  { id: 7, name: 'Whisky Sour', category: 'cocktails', price: 14.00, cost: 3.40, margin: 75.7, volume: 95, revenue: 1330, trend: 'stable', quadrant: 'puzzle' },
  { id: 8, name: 'Daiquiri', category: 'cocktails', price: 13.50, cost: 3.20, margin: 76.3, volume: 75, revenue: 1013, trend: 'down', quadrant: 'puzzle' },
  { id: 9, name: 'Cosmopolitan', category: 'cocktails', price: 14.00, cost: 4.80, margin: 65.7, volume: 65, revenue: 910, trend: 'down', quadrant: 'dog' },
  { id: 10, name: 'Long Island', category: 'cocktails', price: 15.00, cost: 5.50, margin: 63.3, volume: 45, revenue: 675, trend: 'down', quadrant: 'dog' },

  // WINE
  { id: 11, name: 'House Sauvignon Blanc', category: 'wine', price: 8.50, cost: 2.20, margin: 74.1, volume: 180, revenue: 1530, trend: 'stable', quadrant: 'star' },
  { id: 12, name: 'Whispering Angel Rose', category: 'wine', price: 14.00, cost: 5.80, margin: 58.6, volume: 120, revenue: 1680, trend: 'up', quadrant: 'plowhorse' },
  { id: 13, name: 'House Malbec', category: 'wine', price: 8.50, cost: 2.40, margin: 71.8, volume: 145, revenue: 1233, trend: 'stable', quadrant: 'star' },
  { id: 14, name: 'Chablis', category: 'wine', price: 12.00, cost: 4.50, margin: 62.5, volume: 55, revenue: 660, trend: 'stable', quadrant: 'dog' },
  { id: 15, name: 'Champagne Flute', category: 'wine', price: 16.00, cost: 5.00, margin: 68.8, volume: 90, revenue: 1440, trend: 'up', quadrant: 'puzzle' },

  // BEER
  { id: 16, name: 'Peroni', category: 'beer', price: 6.50, cost: 1.80, margin: 72.3, volume: 320, revenue: 2080, trend: 'stable', quadrant: 'star' },
  { id: 17, name: 'Camden Pale Ale', category: 'beer', price: 7.00, cost: 2.20, margin: 68.6, volume: 140, revenue: 980, trend: 'up', quadrant: 'plowhorse' },
  { id: 18, name: 'Guinness', category: 'beer', price: 6.80, cost: 2.50, margin: 63.2, volume: 110, revenue: 748, trend: 'down', quadrant: 'plowhorse' },

  // SOFT
  { id: 19, name: 'Fever-Tree G&T (non-alc)', category: 'soft', price: 5.50, cost: 1.40, margin: 74.5, volume: 85, revenue: 468, trend: 'up', quadrant: 'puzzle' },
  { id: 20, name: 'Fresh Juices', category: 'soft', price: 4.50, cost: 1.80, margin: 60.0, volume: 95, revenue: 428, trend: 'stable', quadrant: 'plowhorse' },
  { id: 21, name: 'Seedlip & Tonic', category: 'soft', price: 8.00, cost: 3.20, margin: 60.0, volume: 35, revenue: 280, trend: 'down', quadrant: 'dog' },

  // FOOD
  { id: 22, name: 'Truffle Fries', category: 'food', price: 8.00, cost: 2.00, margin: 75.0, volume: 260, revenue: 2080, trend: 'up', quadrant: 'star' },
  { id: 23, name: 'Charcuterie Board', category: 'food', price: 18.00, cost: 7.50, margin: 58.3, volume: 85, revenue: 1530, trend: 'stable', quadrant: 'puzzle' },
  { id: 24, name: 'Fish & Chips', category: 'food', price: 16.50, cost: 5.80, margin: 64.8, volume: 120, revenue: 1980, trend: 'stable', quadrant: 'plowhorse' },
  { id: 25, name: 'Caesar Salad', category: 'food', price: 12.00, cost: 3.50, margin: 70.8, volume: 60, revenue: 720, trend: 'down', quadrant: 'dog' },
]

const quadrantLabels = {
  star: { name: 'Stars', desc: 'High profit + High volume', color: C.amber, icon: Star },
  plowhorse: { name: 'Plowhorses', desc: 'Low profit + High volume', color: C.blue, icon: TrendingDown },
  puzzle: { name: 'Puzzles', desc: 'High profit + Low volume', color: C.teal, icon: Zap },
  dog: { name: 'Dogs', desc: 'Low profit + Low volume', color: C.red, icon: AlertTriangle },
}

const quadrantColors = { star: C.amber, plowhorse: C.blue, puzzle: C.teal, dog: C.red }

const categories = ['all', 'cocktails', 'wine', 'beer', 'soft', 'food']
const categoryIcons = { cocktails: Coffee, wine: Wine, beer: Beer, soft: Package, food: UtensilsCrossed }

// AI Recommendations
const aiRecommendations = [
  {
    type: 'replace',
    text: 'Replace Mojito with Paloma',
    detail: 'Mojito has a 65.4% margin with high prep time and waste. Paloma uses similar citrus inventory but delivers a 78% margin. Based on current Mojito volume of 240/month, switching could add \u00A32,880/month in additional margin.',
    impact: '+\u00A32,880/mo',
  },
  {
    type: 'price',
    text: 'Increase Espresso Martini by \u00A31',
    detail: 'At 320 units/month with strong upward trend, price elasticity analysis suggests a \u00A31 increase would reduce volume by only ~5% (16 units) but increase revenue by \u00A3304/month. This is your most in-demand cocktail — customers will absorb the increase.',
    impact: '+\u00A33,648/yr',
  },
  {
    type: 'promote',
    text: 'Promote Whisky Sour from Puzzle to Star',
    detail: 'At 75.7% margin, the Whisky Sour is highly profitable but undersold (95/month). Adding it to the "Bartender\'s Pick" section and training staff to recommend it could increase volume by 40%. That\'s an additional \u00A31,064/month.',
    impact: '+\u00A31,064/mo',
  },
  {
    type: 'remove',
    text: 'Remove Long Island Iced Tea',
    detail: 'Lowest margin (63.3%), lowest volume (45/month), and declining trend. It uses 5 spirits per serve, ties up inventory, and slows bartender throughput. Replace with a signature highball at 80%+ margin.',
    impact: 'Save \u00A3248/mo waste',
  },
  {
    type: 'price',
    text: 'Price sensitivity: Aperol Spritz at \u00A314',
    detail: 'Aperol Spritz at \u00A313 sells 280/month with 76.9% margin. Increasing to \u00A314 (in line with competitors) would add \u00A3280/month. Seasonal demand is rising — now is the time to increase before summer peak.',
    impact: '+\u00A3280/mo',
  },
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, padding: 12, fontSize: 12 }}>
      <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: C.textMuted }}>Margin: <span style={{ color: C.amber }}>{d.margin}%</span></div>
      <div style={{ color: C.textMuted }}>Volume: <span style={{ color: C.text }}>{d.volume}/mo</span></div>
      <div style={{ color: C.textMuted }}>Revenue: <span style={{ color: C.green }}>{'\u00A3'}{d.revenue.toLocaleString()}</span></div>
      <div style={{ color: quadrantColors[d.quadrant], fontWeight: 600, marginTop: 4 }}>{quadrantLabels[d.quadrant].name}</div>
    </div>
  )
}

export default function MenuEngineering() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedRec, setExpandedRec] = useState(null)

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return MENU_ITEMS
    return MENU_ITEMS.filter(i => i.category === selectedCategory)
  }, [selectedCategory])

  const avgMargin = (filteredItems.reduce((s, i) => s + i.margin, 0) / filteredItems.length).toFixed(1)
  const totalRevenue = filteredItems.reduce((s, i) => s + i.revenue, 0)
  const stars = filteredItems.filter(i => i.quadrant === 'star').length
  const dogs = filteredItems.filter(i => i.quadrant === 'dog').length

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <UtensilsCrossed size={22} color={C.amber} /> Menu Engineering
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>BCG matrix analysis — profitability vs popularity for every menu item</p>
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Avg Margin', value: `${avgMargin}%`, icon: PoundSterling },
          { label: 'Monthly Revenue', value: `\u00A3${(totalRevenue / 1000).toFixed(1)}k`, icon: TrendingUp },
          { label: 'Stars', value: stars, sub: 'Keep & promote', color: C.amber, icon: Star },
          { label: 'Dogs', value: dogs, sub: 'Review or remove', color: C.red, icon: AlertTriangle },
        ].map((k, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <k.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color || C.ink, marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
            {k.sub && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
            padding: '6px 14px', borderRadius: 6, border: `1px solid ${selectedCategory === cat ? C.amber : C.border}`,
            background: selectedCategory === cat ? C.amberBg : 'transparent',
            color: selectedCategory === cat ? C.amber : C.textMuted,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
          }}>{cat}</button>
        ))}
      </div>

      {/* Scatter Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>Menu Item Matrix</div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
          {Object.entries(quadrantLabels).map(([key, q]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: q.color }} />
              <span style={{ color: C.textMuted }}>{q.name}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <XAxis type="number" dataKey="volume" name="Volume" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Monthly Volume', position: 'bottom', fill: '#555', fontSize: 11 }} />
            <YAxis type="number" dataKey="margin" name="Margin %" domain={[55, 85]} stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Margin %', angle: -90, position: 'left', fill: '#555', fontSize: 11 }} />
            <ZAxis type="number" dataKey="revenue" range={[60, 300]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={filteredItems}>
              {filteredItems.map((item, i) => (
                <Cell key={i} fill={quadrantColors[item.quadrant]} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quadrant Breakdown */}
      <div className="grid-2col" style={{ marginBottom: 20 }}>
        {Object.entries(quadrantLabels).map(([key, q]) => {
          const items = filteredItems.filter(i => i.quadrant === key)
          const QIcon = q.icon
          return (
            <div key={key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <QIcon size={16} color={q.color} />
                <span style={{ fontSize: 14, fontWeight: 600, color: q.color }}>{q.name}</span>
                <span style={{ fontSize: 11, color: C.textDim }}>({q.desc})</span>
              </div>
              {items.length === 0 ? (
                <div style={{ fontSize: 12, color: C.textDim, padding: 8 }}>No items in this quadrant</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Item', 'Price', 'Cost', 'Margin', 'Vol/mo', 'Trend'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '8px', fontSize: 12, color: C.ink, fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: '8px', fontSize: 12, color: C.text }}>{'\u00A3'}{item.price.toFixed(2)}</td>
                        <td style={{ padding: '8px', fontSize: 12, color: C.textMuted }}>{'\u00A3'}{item.cost.toFixed(2)}</td>
                        <td style={{ padding: '8px', fontSize: 12, color: item.margin >= 70 ? C.green : item.margin >= 65 ? C.orange : C.red, fontWeight: 600 }}>{item.margin}%</td>
                        <td style={{ padding: '8px', fontSize: 12, color: C.text }}>{item.volume}</td>
                        <td style={{ padding: '8px' }}>
                          {item.trend === 'up' && <TrendingUp size={14} color={C.green} />}
                          {item.trend === 'down' && <TrendingDown size={14} color={C.red} />}
                          {item.trend === 'stable' && <span style={{ fontSize: 12, color: C.textDim }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )
        })}
      </div>

      {/* AI Recommendations */}
      <div style={{ background: C.card, border: `1px solid ${C.amber}20`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={16} color={C.amber} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.amber }}>AI Menu Recommendations</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {aiRecommendations.map((rec, i) => (
            <div key={i} style={{ background: C.bg, borderRadius: 10, overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedRec(expandedRec === i ? null : i)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    background: rec.type === 'replace' ? C.orangeBg : rec.type === 'price' ? C.greenBg : rec.type === 'promote' ? C.blueBg : C.redBg,
                    color: rec.type === 'replace' ? C.orange : rec.type === 'price' ? C.green : rec.type === 'promote' ? C.blue : C.red,
                    textTransform: 'uppercase',
                  }}>{rec.type}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{rec.text}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>{rec.impact}</span>
                  {expandedRec === i ? <ChevronUp size={14} color={C.textDim} /> : <ChevronDown size={14} color={C.textDim} />}
                </div>
              </div>
              {expandedRec === i && (
                <div style={{ padding: '0 16px 14px' }}>
                  <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: 0 }}>{rec.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
