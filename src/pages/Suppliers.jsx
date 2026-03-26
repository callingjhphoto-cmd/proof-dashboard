import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import {
  Truck, Package, Search, Plus, X, Phone, Mail, Clock, AlertTriangle,
  TrendingUp, TrendingDown, FileText, ChevronDown, ChevronUp, Zap,
  PoundSterling, Calendar, CheckCircle, ShoppingCart
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

const SUPPLIERS = [
  {
    id: 1, name: 'Matthew Clark', contact: 'David Pearson', role: 'Account Manager',
    phone: '0117 978 5500', email: 'dpearson@matthewclark.co.uk',
    products: ['Spirits', 'Wine', 'Beer', 'Soft Drinks'],
    paymentTerms: '30 days EOM', minOrder: 250, deliveryDays: ['Tuesday', 'Thursday'],
    lastOrder: '2026-03-24', nextDelivery: '2026-03-27',
    ytdSpend: 48200, monthlyAvg: 4015,
    rating: 4.5, onTimeRate: 94,
    orders: [
      { date: '2026-03-24', items: 12, total: 2840, status: 'delivered' },
      { date: '2026-03-17', items: 8, total: 1920, status: 'delivered' },
      { date: '2026-03-10', items: 15, total: 3650, status: 'delivered' },
      { date: '2026-03-03', items: 10, total: 2180, status: 'delivered' },
      { date: '2026-02-24', items: 9, total: 2060, status: 'delivered' },
    ],
    priceChanges: [
      { item: 'Hendricks Gin 70cl', oldPrice: 22.50, newPrice: 24.80, change: '+10.2%', date: '2026-03-01' },
      { item: 'Grey Goose 70cl', oldPrice: 28.00, newPrice: 29.50, change: '+5.4%', date: '2026-02-15' },
    ],
    monthlySpend: [
      { month: 'Oct', spend: 3800 }, { month: 'Nov', spend: 4200 }, { month: 'Dec', spend: 6800 },
      { month: 'Jan', spend: 3200 }, { month: 'Feb', spend: 3900 }, { month: 'Mar', spend: 4800 },
    ],
  },
  {
    id: 2, name: 'Enotria & Coe', contact: 'Maria Silva', role: 'Wine Specialist',
    phone: '020 3328 4600', email: 'msilva@enotriacoe.com',
    products: ['Fine Wine', 'Champagne', 'Spirits'],
    paymentTerms: '45 days', minOrder: 500, deliveryDays: ['Monday', 'Wednesday', 'Friday'],
    lastOrder: '2026-03-22', nextDelivery: '2026-03-26',
    ytdSpend: 32600, monthlyAvg: 2717,
    rating: 4.8, onTimeRate: 97,
    orders: [
      { date: '2026-03-22', items: 6, total: 4200, status: 'in-transit' },
      { date: '2026-03-15', items: 4, total: 2800, status: 'delivered' },
      { date: '2026-03-08', items: 5, total: 3100, status: 'delivered' },
      { date: '2026-03-01', items: 3, total: 1890, status: 'delivered' },
    ],
    priceChanges: [
      { item: 'Whispering Angel Rose', oldPrice: 9.80, newPrice: 10.40, change: '+6.1%', date: '2026-03-10' },
    ],
    monthlySpend: [
      { month: 'Oct', spend: 2400 }, { month: 'Nov', spend: 2800 }, { month: 'Dec', spend: 4500 },
      { month: 'Jan', spend: 2100 }, { month: 'Feb', spend: 2600 }, { month: 'Mar', spend: 3200 },
    ],
  },
  {
    id: 3, name: 'LWC Drinks', contact: 'James Wright', role: 'Regional Manager',
    phone: '0800 953 9111', email: 'jwright@lwc-drinks.co.uk',
    products: ['Beer', 'Cider', 'Soft Drinks', 'Spirits'],
    paymentTerms: '28 days', minOrder: 200, deliveryDays: ['Monday', 'Wednesday', 'Friday'],
    lastOrder: '2026-03-23', nextDelivery: '2026-03-26',
    ytdSpend: 28400, monthlyAvg: 2367,
    rating: 4.2, onTimeRate: 91,
    orders: [
      { date: '2026-03-23', items: 18, total: 1640, status: 'delivered' },
      { date: '2026-03-16', items: 14, total: 1380, status: 'delivered' },
      { date: '2026-03-09', items: 20, total: 1920, status: 'delivered' },
    ],
    priceChanges: [
      { item: 'Peroni Nastro Azzurro (case)', oldPrice: 24.00, newPrice: 26.40, change: '+10.0%', date: '2026-03-15' },
      { item: 'Camden Pale Ale (keg)', oldPrice: 85.00, newPrice: 89.00, change: '+4.7%', date: '2026-02-20' },
    ],
    monthlySpend: [
      { month: 'Oct', spend: 2200 }, { month: 'Nov', spend: 2500 }, { month: 'Dec', spend: 3800 },
      { month: 'Jan', spend: 1900 }, { month: 'Feb', spend: 2300 }, { month: 'Mar', spend: 2800 },
    ],
  },
  {
    id: 4, name: 'Bibendum Wine', contact: 'Charlotte Evans', role: 'Account Director',
    phone: '020 7449 4120', email: 'cevans@bibendum-wine.co.uk',
    products: ['Premium Wine', 'Champagne', 'Port', 'Sherry'],
    paymentTerms: '30 days', minOrder: 300, deliveryDays: ['Tuesday', 'Friday'],
    lastOrder: '2026-03-21', nextDelivery: '2026-03-28',
    ytdSpend: 18900, monthlyAvg: 1575,
    rating: 4.7, onTimeRate: 96,
    orders: [
      { date: '2026-03-21', items: 4, total: 2200, status: 'delivered' },
      { date: '2026-03-07', items: 3, total: 1680, status: 'delivered' },
    ],
    priceChanges: [],
    monthlySpend: [
      { month: 'Oct', spend: 1400 }, { month: 'Nov', spend: 1600 }, { month: 'Dec', spend: 2800 },
      { month: 'Jan', spend: 1200 }, { month: 'Feb', spend: 1500 }, { month: 'Mar', spend: 1800 },
    ],
  },
  {
    id: 5, name: 'Fever-Tree', contact: 'Tom Bradley', role: 'On-Trade Sales',
    phone: '020 7349 4922', email: 'tbradley@fever-tree.com',
    products: ['Tonic Water', 'Ginger Beer', 'Ginger Ale', 'Soda Water', 'Cola'],
    paymentTerms: '30 days', minOrder: 150, deliveryDays: ['Wednesday'],
    lastOrder: '2026-03-19', nextDelivery: '2026-03-26',
    ytdSpend: 8400, monthlyAvg: 700,
    rating: 4.9, onTimeRate: 99,
    orders: [
      { date: '2026-03-19', items: 8, total: 680, status: 'delivered' },
      { date: '2026-03-05', items: 10, total: 820, status: 'delivered' },
    ],
    priceChanges: [],
    monthlySpend: [
      { month: 'Oct', spend: 620 }, { month: 'Nov', spend: 680 }, { month: 'Dec', spend: 920 },
      { month: 'Jan', spend: 580 }, { month: 'Feb', spend: 650 }, { month: 'Mar', spend: 740 },
    ],
  },
  {
    id: 6, name: 'Brakes Food Service', contact: 'Richard Hughes', role: 'Account Manager',
    phone: '0345 606 1010', email: 'rhughes@brake.co.uk',
    products: ['Fresh Produce', 'Dairy', 'Meat', 'Dry Goods', 'Frozen'],
    paymentTerms: '14 days', minOrder: 100, deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    lastOrder: '2026-03-25', nextDelivery: '2026-03-26',
    ytdSpend: 42100, monthlyAvg: 3508,
    rating: 4.0, onTimeRate: 88,
    orders: [
      { date: '2026-03-25', items: 24, total: 1480, status: 'in-transit' },
      { date: '2026-03-22', items: 18, total: 1120, status: 'delivered' },
      { date: '2026-03-18', items: 22, total: 1340, status: 'delivered' },
    ],
    priceChanges: [
      { item: 'Organic Lemons (box)', oldPrice: 14.00, newPrice: 16.80, change: '+20.0%', date: '2026-03-20' },
      { item: 'Oat Milk (case 12)', oldPrice: 18.00, newPrice: 19.80, change: '+10.0%', date: '2026-03-10' },
      { item: 'Free Range Eggs (tray 30)', oldPrice: 8.50, newPrice: 9.20, change: '+8.2%', date: '2026-02-25' },
    ],
    monthlySpend: [
      { month: 'Oct', spend: 3200 }, { month: 'Nov', spend: 3400 }, { month: 'Dec', spend: 4800 },
      { month: 'Jan', spend: 2900 }, { month: 'Feb', spend: 3300 }, { month: 'Mar', spend: 3600 },
    ],
  },
  {
    id: 7, name: 'Speciality Drinks', contact: 'Anna Robertson', role: 'Brand Ambassador',
    phone: '020 7404 3232', email: 'arobertson@specialitydrinks.com',
    products: ['Craft Spirits', 'Rare Whisky', 'Artisan Liqueurs', 'Mezcal'],
    paymentTerms: '30 days', minOrder: 200, deliveryDays: ['Thursday'],
    lastOrder: '2026-03-20', nextDelivery: '2026-03-27',
    ytdSpend: 12800, monthlyAvg: 1067,
    rating: 4.6, onTimeRate: 93,
    orders: [
      { date: '2026-03-20', items: 5, total: 1840, status: 'delivered' },
      { date: '2026-03-06', items: 3, total: 960, status: 'delivered' },
    ],
    priceChanges: [
      { item: 'Clase Azul Reposado', oldPrice: 68.00, newPrice: 72.50, change: '+6.6%', date: '2026-03-01' },
    ],
    monthlySpend: [
      { month: 'Oct', spend: 900 }, { month: 'Nov', spend: 1100 }, { month: 'Dec', spend: 1800 },
      { month: 'Jan', spend: 800 }, { month: 'Feb', spend: 1000 }, { month: 'Mar', spend: 1200 },
    ],
  },
  {
    id: 8, name: 'Kegstar', contact: 'Mike O\'Brien', role: 'Logistics Coordinator',
    phone: '020 3488 0220', email: 'mobrien@kegstar.com',
    products: ['Keg Hire', 'Keg Collection', 'Draft Beer Equipment'],
    paymentTerms: '30 days', minOrder: 0, deliveryDays: ['Monday', 'Thursday'],
    lastOrder: '2026-03-18', nextDelivery: '2026-03-27',
    ytdSpend: 4200, monthlyAvg: 350,
    rating: 4.3, onTimeRate: 92,
    orders: [
      { date: '2026-03-18', items: 2, total: 380, status: 'delivered' },
      { date: '2026-03-04', items: 3, total: 420, status: 'delivered' },
    ],
    priceChanges: [],
    monthlySpend: [
      { month: 'Oct', spend: 300 }, { month: 'Nov', spend: 340 }, { month: 'Dec', spend: 480 },
      { month: 'Jan', spend: 280 }, { month: 'Feb', spend: 320 }, { month: 'Mar', spend: 380 },
    ],
  },
]

// AI Suggested Orders
const suggestedOrders = [
  { supplier: 'Matthew Clark', items: [
    { name: 'Hendricks Gin 70cl', current: 2, par: 8, usage: '1.2/day', urgency: 'critical' },
    { name: 'Tanqueray 10 70cl', current: 4, par: 6, usage: '0.8/day', urgency: 'medium' },
    { name: 'Absolut Vodka 70cl', current: 5, par: 10, usage: '1.5/day', urgency: 'medium' },
  ], estimatedTotal: 480 },
  { supplier: 'Brakes Food Service', items: [
    { name: 'Oat Milk (case 12)', current: 3, par: 8, usage: '2/day', urgency: 'critical' },
    { name: 'Organic Lemons (box)', current: 1, par: 4, usage: '1.5/day', urgency: 'critical' },
    { name: 'Fresh Mint (bunch)', current: 4, par: 6, usage: '1/day', urgency: 'low' },
  ], estimatedTotal: 220 },
  { supplier: 'Fever-Tree', items: [
    { name: 'Indian Tonic (case 24)', current: 6, par: 12, usage: '2/day', urgency: 'medium' },
    { name: 'Ginger Beer (case 24)', current: 3, par: 8, usage: '1.5/day', urgency: 'medium' },
  ], estimatedTotal: 340 },
]

const urgencyColors = { critical: C.red, medium: C.orange, low: C.green }

export default function Suppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggested, setShowSuggested] = useState(false)
  const [creatingPO, setCreatingPO] = useState(false)

  const totalYTDSpend = SUPPLIERS.reduce((s, sup) => s + sup.ytdSpend, 0)
  const totalPriceIncreases = SUPPLIERS.reduce((s, sup) => s + sup.priceChanges.length, 0)
  const avgOnTime = Math.round(SUPPLIERS.reduce((s, sup) => s + sup.onTimeRate, 0) / SUPPLIERS.length)

  const filtered = useMemo(() => {
    if (!searchTerm) return SUPPLIERS
    const term = searchTerm.toLowerCase()
    return SUPPLIERS.filter(s => s.name.toLowerCase().includes(term) || s.products.some(p => p.toLowerCase().includes(term)))
  }, [searchTerm])

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Truck size={22} color={C.amber} /> Supplier Management
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>Track suppliers, orders, pricing, and AI-suggested reorders</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowSuggested(!showSuggested)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
            background: showSuggested ? C.amberBg : 'transparent', border: `1px solid ${showSuggested ? C.amber : C.border}`,
            color: showSuggested ? C.amber : C.text, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            <Zap size={14} /> AI Suggested Orders
          </button>
          <button onClick={() => setCreatingPO(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
            background: `linear-gradient(135deg, ${C.amber}, #A67C2E)`, border: 'none',
            color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <FileText size={14} /> Create PO
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        {[
          { icon: Truck, label: 'Active Suppliers', value: SUPPLIERS.length },
          { icon: PoundSterling, label: 'YTD Spend', value: `\u00A3${(totalYTDSpend / 1000).toFixed(1)}k` },
          { icon: TrendingUp, label: 'Price Increases', value: totalPriceIncreases, sub: 'This quarter', color: C.red },
          { icon: Clock, label: 'Avg On-Time Rate', value: `${avgOnTime}%`, color: avgOnTime > 90 ? C.green : C.orange },
        ].map((k, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <k.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color || C.ink, marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
            {k.sub && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* AI Suggested Orders Panel */}
      {showSuggested && (
        <div style={{ background: C.card, border: `1px solid ${C.amber}30`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color={C.amber} />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.amber }}>AI Suggested Orders</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>Based on usage rate + current stock + lead time</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {suggestedOrders.map((so, i) => (
              <div key={i} style={{ background: C.bg, borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{so.supplier}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.amber }}>{'\u00A3'}{so.estimatedTotal} est.</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Item', 'Current', 'Par', 'Usage', 'Urgency'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {so.items.map((item, j) => (
                      <tr key={j}>
                        <td style={{ padding: '8px', fontSize: 12, color: C.ink }}>{item.name}</td>
                        <td style={{ padding: '8px', fontSize: 12, color: item.current <= 2 ? C.red : C.text, fontWeight: 600 }}>{item.current}</td>
                        <td style={{ padding: '8px', fontSize: 12, color: C.textMuted }}>{item.par}</td>
                        <td style={{ padding: '8px', fontSize: 12, color: C.textMuted }}>{item.usage}</td>
                        <td style={{ padding: '8px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                            background: urgencyColors[item.urgency] + '15', color: urgencyColors[item.urgency],
                            textTransform: 'uppercase',
                          }}>{item.urgency}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button style={{
                  marginTop: 10, padding: '8px 16px', borderRadius: 6, border: `1px solid ${C.amber}40`,
                  background: C.amberBg, color: C.amber, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Generate PO for {so.supplier}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} color={C.textDim} style={{ position: 'absolute', left: 12, top: 11 }} />
        <input
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search suppliers or products..."
          style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 13, outline: 'none' }}
        />
      </div>

      {/* Supplier Grid */}
      <div className="grid-2col" style={{ marginBottom: 20 }}>
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => setSelectedSupplier(selectedSupplier?.id === s.id ? null : s)}
            style={{
              background: C.card, border: `1px solid ${selectedSupplier?.id === s.id ? C.amber + '40' : C.border}`,
              borderRadius: 12, padding: 18, cursor: 'pointer', transition: 'border-color 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{s.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.contact} — {s.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: C.textDim }}>YTD Spend</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.amber }}>{'\u00A3'}{s.ytdSpend.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {s.products.map(p => (
                <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: C.bg, color: C.textMuted, border: `1px solid ${C.border}` }}>{p}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
              <span style={{ color: C.textMuted }}>Terms: <span style={{ color: C.text }}>{s.paymentTerms}</span></span>
              <span style={{ color: C.textMuted }}>On-time: <span style={{ color: s.onTimeRate > 90 ? C.green : C.orange, fontWeight: 600 }}>{s.onTimeRate}%</span></span>
              {s.priceChanges.length > 0 && (
                <span style={{ color: C.red, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={11} /> {s.priceChanges.length} price increase{s.priceChanges.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Expanded detail */}
            {selectedSupplier?.id === s.id && (
              <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.text }}>
                    <Phone size={12} color={C.textMuted} /> {s.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.text }}>
                    <Mail size={12} color={C.textMuted} /> {s.email}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 11 }}>
                  <span style={{ color: C.textMuted }}>Min order: <span style={{ color: C.text }}>{'\u00A3'}{s.minOrder}</span></span>
                  <span style={{ color: C.textMuted }}>Delivery: <span style={{ color: C.text }}>{s.deliveryDays.join(', ')}</span></span>
                  <span style={{ color: C.textMuted }}>Next: <span style={{ color: C.green }}>{s.nextDelivery}</span></span>
                </div>

                {/* Spend Chart */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Monthly Spend</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={s.monthlySpend}>
                      <XAxis dataKey="month" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00A3${v}`} />
                      <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 11 }} formatter={v => [`\u00A3${v.toLocaleString()}`, 'Spend']} />
                      <Bar dataKey="spend" fill={C.amber} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Orders */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Recent Orders</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Date', 'Items', 'Total', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, fontWeight: 600, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.orders.map((o, i) => (
                        <tr key={i}>
                          <td style={{ padding: '8px', fontSize: 12, color: C.text }}>{o.date}</td>
                          <td style={{ padding: '8px', fontSize: 12, color: C.text }}>{o.items}</td>
                          <td style={{ padding: '8px', fontSize: 12, color: C.amber, fontWeight: 600 }}>{'\u00A3'}{o.total.toLocaleString()}</td>
                          <td style={{ padding: '8px' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                              background: o.status === 'delivered' ? C.greenBg : C.orangeBg,
                              color: o.status === 'delivered' ? C.green : C.orange,
                              textTransform: 'capitalize',
                            }}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Changes */}
                {s.priceChanges.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={12} /> Price Increases
                    </div>
                    {s.priceChanges.map((pc, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontSize: 12, color: C.ink }}>{pc.item}</div>
                          <div style={{ fontSize: 10, color: C.textDim }}>{pc.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{pc.change}</div>
                          <div style={{ fontSize: 10, color: C.textDim }}>{'\u00A3'}{pc.oldPrice.toFixed(2)} → {'\u00A3'}{pc.newPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create PO Modal */}
      {creatingPO && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setCreatingPO(false) }}
        >
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>Create Purchase Order</h2>
              <button onClick={() => setCreatingPO(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Supplier</label>
                <select style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}>
                  <option value="">Select supplier...</option>
                  {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Delivery Date</label>
                <input type="date" defaultValue="2026-03-27" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Items (one per line)</label>
                <textarea placeholder="Hendricks Gin 70cl x 6&#10;Absolut Vodka 70cl x 4" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none', minHeight: 120, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Notes</label>
                <input type="text" placeholder="Urgent delivery needed" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }} />
              </div>
              <button style={{
                width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                background: `linear-gradient(135deg, ${C.amber}, #A67C2E)`, color: '#000',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }} onClick={() => { setCreatingPO(false); alert('Purchase Order created (mock)') }}>
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
