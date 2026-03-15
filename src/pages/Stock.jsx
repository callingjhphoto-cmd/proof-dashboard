import { Package, AlertTriangle, TrendingUp, ShoppingCart } from 'lucide-react'

const lowStock = [
  { item: "Hendrick's Gin", par: 6, current: 2, unit: 'bottles', urgency: 'critical' },
  { item: 'Fever-Tree Tonic', par: 48, current: 12, unit: 'bottles', urgency: 'warning' },
  { item: 'Angostura Bitters', par: 4, current: 1, unit: 'bottles', urgency: 'critical' },
  { item: 'Patron Silver', par: 5, current: 2, unit: 'bottles', urgency: 'warning' },
  { item: 'Champagne (House)', par: 12, current: 4, unit: 'bottles', urgency: 'warning' },
  { item: 'Lime (fresh)', par: 60, current: 15, unit: 'pcs', urgency: 'critical' },
]

const topSellers = [
  { item: 'Espresso Martini', sold: 87, revenue: 1131, gp: 82 },
  { item: 'Negroni', sold: 62, revenue: 806, gp: 79 },
  { item: 'Margarita', sold: 54, revenue: 756, gp: 78 },
  { item: 'G&T (Hendricks)', sold: 51, revenue: 612, gp: 76 },
  { item: 'Old Fashioned', sold: 48, revenue: 672, gp: 81 },
  { item: 'Aperol Spritz', sold: 45, revenue: 540, gp: 74 },
  { item: 'Pornstar Martini', sold: 42, revenue: 546, gp: 80 },
  { item: 'Whiskey Sour', sold: 38, revenue: 494, gp: 77 },
  { item: 'Mojito', sold: 35, revenue: 420, gp: 72 },
  { item: 'Cosmopolitan', sold: 31, revenue: 403, gp: 79 },
]

const autoOrder = [
  { item: "Hendrick's Gin 70cl", qty: 4, supplier: 'Matthew Clark', est: '\u00A3104.00', reason: 'Below par (2/6) + Friday 142 covers' },
  { item: 'Fever-Tree Indian Tonic 200ml (x24)', qty: 2, supplier: 'Matthew Clark', est: '\u00A338.40', reason: 'Below par (12/48) + high G&T sales' },
  { item: 'Fresh Limes (box 100)', qty: 1, supplier: 'Total Produce', est: '\u00A318.50', reason: 'Critical (15/60) + cocktail demand' },
  { item: 'Angostura Bitters 200ml', qty: 3, supplier: 'Matthew Clark', est: '\u00A327.60', reason: 'Critical (1/4) + Old Fashioned demand' },
  { item: 'Patron Silver 70cl', qty: 3, supplier: 'Enotria & Coe', est: '\u00A389.70', reason: 'Below par (2/5) + Margarita trend' },
]

const wastage = [
  { date: '15 Mar', item: 'House Red (opened 3 days)', qty: '2 glasses', value: '\u00A37.40', reason: 'Oxidised' },
  { date: '14 Mar', item: 'Fresh Mint', qty: '1 bunch', value: '\u00A31.80', reason: 'Wilted' },
  { date: '13 Mar', item: 'Champagne (flat)', qty: '3 glasses', value: '\u00A318.00', reason: 'Left open' },
]

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

export default function Stock({ C }) {
  const totalWastageValue = wastage.reduce((s, w) => s + parseFloat(w.value.replace('\u00A3', '')), 0)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Stock Intelligence
      </div>

      {/* Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20,
      }}>
        {[
          { label: 'Stock Value', value: '\u00A314,280', icon: Package, color: C.ink },
          { label: 'Below Par Items', value: '6', icon: AlertTriangle, color: C.red },
          { label: 'Wastage This Week', value: `\u00A3${totalWastageValue.toFixed(2)}`, icon: TrendingUp, color: C.orange },
          { label: 'Auto-Order Value', value: '\u00A3278.20', icon: ShoppingCart, color: C.amber },
        ].map((kpi, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <kpi.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color, marginTop: 8 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Low Stock Alerts */}
        <Card title="Below Par Level" icon={AlertTriangle} C={C}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lowStock.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px',
                borderRadius: 8, background: item.urgency === 'critical' ? C.redBg : 'rgba(249,115,22,0.06)',
                borderLeft: `3px solid ${item.urgency === 'critical' ? C.red : C.orange}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{item.item}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{item.current}/{item.par} {item.unit}</div>
                </div>
                <div style={{
                  width: 40, height: 4, background: '#1E1E21', borderRadius: 2, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${(item.current / item.par) * 100}%`, borderRadius: 2,
                    background: item.urgency === 'critical' ? C.red : C.orange,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Sellers */}
        <Card title="Top 10 Sellers This Week" icon={TrendingUp} C={C}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['#', 'Item', 'Sold', 'Revenue', 'GP%'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topSellers.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '8px', color: C.textDim }}>{i + 1}</td>
                  <td style={{ padding: '8px', color: C.ink, fontWeight: 500 }}>{s.item}</td>
                  <td style={{ padding: '8px', color: C.text }}>{s.sold}</td>
                  <td style={{ padding: '8px', color: C.amber }}>\u00A3{s.revenue}</td>
                  <td style={{ padding: '8px', color: s.gp >= 78 ? C.green : C.text }}>{s.gp}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Auto-Order Suggestions */}
      <Card title="AI Auto-Order Suggestions" icon={ShoppingCart} C={C} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, padding: '8px 12px', background: C.amberBg, borderRadius: 8, borderLeft: `3px solid ${C.amber}` }}>
          Based on current stock levels, Friday's 142-cover booking, and this week's sales velocity:
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Item', 'Qty', 'Supplier', 'Est. Cost', 'Reason'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {autoOrder.map((o, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '8px', color: C.ink, fontWeight: 500 }}>{o.item}</td>
                <td style={{ padding: '8px', color: C.text }}>{o.qty}</td>
                <td style={{ padding: '8px', color: C.textMuted }}>{o.supplier}</td>
                <td style={{ padding: '8px', color: C.amber }}>{o.est}</td>
                <td style={{ padding: '8px', color: C.textDim, fontSize: 11 }}>{o.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Wastage */}
      <Card title="Wastage Log" C={C}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Date', 'Item', 'Qty', 'Value', 'Reason'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wastage.map((w, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '8px', color: C.textMuted }}>{w.date}</td>
                <td style={{ padding: '8px', color: C.ink }}>{w.item}</td>
                <td style={{ padding: '8px', color: C.text }}>{w.qty}</td>
                <td style={{ padding: '8px', color: C.red }}>{w.value}</td>
                <td style={{ padding: '8px', color: C.textDim }}>{w.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
