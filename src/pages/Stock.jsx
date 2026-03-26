import { Package, AlertTriangle, TrendingUp, ShoppingCart, Target, ArrowDownRight, ArrowUpRight } from 'lucide-react'

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
  { item: "Hendrick's Gin 70cl", qty: 4, supplier: 'Matthew Clark', est: '£104.00', reason: 'Below par (2/6) + Friday 142 covers' },
  { item: 'Fever-Tree Indian Tonic 200ml (x24)', qty: 2, supplier: 'Matthew Clark', est: '£38.40', reason: 'Below par (12/48) + high G&T sales' },
  { item: 'Fresh Limes (box 100)', qty: 1, supplier: 'Total Produce', est: '£18.50', reason: 'Critical (15/60) + cocktail demand' },
  { item: 'Angostura Bitters 200ml', qty: 3, supplier: 'Matthew Clark', est: '£27.60', reason: 'Critical (1/4) + Old Fashioned demand' },
  { item: 'Patron Silver 70cl', qty: 3, supplier: 'Enotria & Coe', est: '£89.70', reason: 'Below par (2/5) + Margarita trend' },
]

// Actual vs Theoretical GP — inspired by MarketMan's flagship feature
const actualVsTheoretical = [
  { category: 'Spirits', theoreticalGP: 78.0, actualGP: 74.2, variance: -3.8, reason: 'Over-pouring on free-pour spirits (+8ml avg)' },
  { category: 'Wine', theoreticalGP: 68.0, actualGP: 62.1, variance: -5.9, reason: 'Malbec by-the-glass wastage (oxidation after 2 days)' },
  { category: 'Beer', theoreticalGP: 65.0, actualGP: 63.8, variance: -1.2, reason: 'Minor — line cleaning wastage within tolerance' },
  { category: 'Cocktails', theoreticalGP: 82.0, actualGP: 78.8, variance: -3.2, reason: 'Vanilla extract price increase not reflected in recipe cost' },
  { category: 'Soft Drinks', theoreticalGP: 85.0, actualGP: 84.2, variance: -0.8, reason: 'Within tolerance' },
]

const supplierPriceChanges = [
  { item: 'Heilala Vanilla Extract 500ml', supplier: 'Sous Chef', was: 18.50, now: 21.28, change: 15.0, impact: '£36/week on Espresso Martini margin' },
  { item: 'Malbec (House) 75cl', supplier: 'Enotria & Coe', was: 5.40, now: 5.80, change: 7.4, impact: '£16/week across by-the-glass sales' },
  { item: 'Fever-Tree Tonic 200ml', supplier: 'Matthew Clark', was: 0.75, now: 0.80, change: 6.7, impact: '£12/week — high volume item' },
  { item: 'Fresh Limes (each)', supplier: 'Total Produce', was: 0.12, now: 0.15, change: 25.0, impact: '£9/week — seasonal price spike' },
]

const wastage = [
  { date: '15 Mar', item: 'House Red (opened 3 days)', qty: '2 glasses', value: '£7.40', reason: 'Oxidised' },
  { date: '14 Mar', item: 'Fresh Mint', qty: '1 bunch', value: '£1.80', reason: 'Wilted' },
  { date: '13 Mar', item: 'Champagne (flat)', qty: '3 glasses', value: '£18.00', reason: 'Left open' },
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
  const totalWastageValue = wastage.reduce((s, w) => s + parseFloat(w.value.replace('£', '')), 0)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Stock Intelligence
      </div>

      {/* Summary */}
      <div className="grid-kpi-4" style={{
        marginBottom: 20,
      }}>
        {[
          { label: 'Stock Value', value: '£14,280', icon: Package, color: C.ink },
          { label: 'Below Par Items', value: '6', icon: AlertTriangle, color: C.red },
          { label: 'Wastage This Week', value: `£${totalWastageValue.toFixed(2)}`, icon: TrendingUp, color: C.orange },
          { label: 'Auto-Order Value', value: '£278.20', icon: ShoppingCart, color: C.amber },
        ].map((kpi, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <kpi.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color, marginTop: 8 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2col" style={{ marginBottom: 16 }}>
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
                  <td style={{ padding: '8px', color: C.amber }}>£{s.revenue}</td>
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

      {/* Actual vs Theoretical GP */}
      <Card title="Actual vs Theoretical GP" icon={Target} C={C} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, padding: '8px 12px', background: C.redBg, borderRadius: 8, borderLeft: `3px solid ${C.red}` }}>
          Total GP variance this week: {actualVsTheoretical.reduce((s, v) => s + v.variance, 0).toFixed(1)}pts below theoretical — costing an estimated £73/week in lost margin
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Category', 'Theoretical GP', 'Actual GP', 'Variance', 'Root Cause'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actualVsTheoretical.map((v, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '8px', color: C.ink, fontWeight: 500 }}>{v.category}</td>
                <td style={{ padding: '8px', color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>{v.theoreticalGP}%</td>
                <td style={{ padding: '8px', color: Math.abs(v.variance) <= 1.5 ? C.green : C.red, fontFamily: "'JetBrains Mono', monospace" }}>{v.actualGP}%</td>
                <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ArrowDownRight size={12} color={Math.abs(v.variance) <= 1.5 ? C.textDim : C.red} />
                  <span style={{ color: Math.abs(v.variance) <= 1.5 ? C.textDim : C.red, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{v.variance}pts</span>
                </td>
                <td style={{ padding: '8px', color: C.textDim, fontSize: 11 }}>{v.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Supplier Price Changes */}
      <Card title="Supplier Price Alerts" icon={ArrowUpRight} C={C} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
          Price increases from suppliers in the last 30 days that affect your margins
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {supplierPriceChanges.map((s, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${s.change >= 15 ? C.red : C.orange}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{s.item}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>+{s.change}%</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.textDim }}>
                <span>{s.supplier}</span>
                <span>£{s.was.toFixed(2)} {'→'} £{s.now.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 11, color: C.orange, marginTop: 4 }}>Impact: {s.impact}</div>
            </div>
          ))}
        </div>
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
