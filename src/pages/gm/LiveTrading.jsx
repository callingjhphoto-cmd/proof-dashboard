import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, PoundSterling, Users, Clock, Zap, UtensilsCrossed, ArrowUpRight, ArrowDownRight, Award, Target } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316',
  blue: '#3B82F6', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

// ─── POS INTEGRATION ────────────────────────────────────────────────
// TODO: When Square account is available, replace mock data with live POS feed.
// Integration points: Square Web Payments SDK, Square Orders API, Square Inventory API.
// All data below is mock — ready to swap with real Square API responses.
// Env var: VITE_SQUARE_ACCESS_TOKEN (not yet set)

// ─── TIME PERIOD DATA ───────────────────────────────────────────────

const hourlyData = [
  { label: '10:00', revenue: 180, covers: 3 },
  { label: '11:00', revenue: 420, covers: 8 },
  { label: '12:00', revenue: 1180, covers: 22 },
  { label: '13:00', revenue: 1640, covers: 31 },
  { label: '14:00', revenue: 980, covers: 18 },
  { label: '15:00', revenue: 520, covers: 9 },
  { label: '16:00', revenue: 380, covers: 6 },
  { label: '17:00', revenue: 720, covers: 14 },
  { label: '18:00', revenue: 1450, covers: 28 },
  { label: '19:00', revenue: 2100, covers: 38 },
  { label: '20:00', revenue: 2480, covers: 42 },
  { label: '21:00', revenue: 2200, covers: 36 },
  { label: '22:00', revenue: 1650, covers: 26 },
  { label: '23:00', revenue: 870, covers: 14 },
]

// London bar/restaurant: ~£3-5K/day, weekends higher
const dailyData = [
  { label: 'Mon', revenue: 3180, covers: 62 },
  { label: 'Tue', revenue: 3420, covers: 68 },
  { label: 'Wed', revenue: 3750, covers: 74 },
  { label: 'Thu', revenue: 4210, covers: 82 },
  { label: 'Fri', revenue: 5640, covers: 108 },
  { label: 'Sat', revenue: 6280, covers: 124 },
  { label: 'Sun', revenue: 4950, covers: 96 },
]

// ~£20-35K/week
const weeklyData = [
  { label: 'W1', revenue: 28400, covers: 548 },
  { label: 'W2', revenue: 31200, covers: 604 },
  { label: 'W3', revenue: 26800, covers: 518 },
  { label: 'W4', revenue: 29600, covers: 572 },
]

// Dec highest, Jan lowest, realistic London venue
const monthlyData = [
  { label: 'Jan', revenue: 82400 },
  { label: 'Feb', revenue: 88600 },
  { label: 'Mar', revenue: 96200 },
  { label: 'Apr', revenue: 102800 },
  { label: 'May', revenue: 108400 },
  { label: 'Jun', revenue: 115200 },
  { label: 'Jul', revenue: 112600 },
  { label: 'Aug', revenue: 98400 },
  { label: 'Sep', revenue: 106800 },
  { label: 'Oct', revenue: 110200 },
  { label: 'Nov', revenue: 118600 },
  { label: 'Dec', revenue: 138400 },
]

const yearlyData = [
  { label: '2022', revenue: 1048000 },
  { label: '2023', revenue: 1124000 },
  { label: '2024', revenue: 1198000 },
  { label: '2025', revenue: 1278600 },
  { label: '2026', revenue: 1342000 },
]

// ─── PERIOD CONFIG ──────────────────────────────────────────────────

const PERIODS = [
  { key: 'hour', label: 'By Hour', data: hourlyData, periodLabel: 'Today', prevLabel: 'vs yesterday' },
  { key: 'day', label: 'By Day', data: dailyData, periodLabel: 'This Week', prevLabel: 'vs last week' },
  { key: 'week', label: 'By Week', data: weeklyData, periodLabel: 'This Month', prevLabel: 'vs last month' },
  { key: 'month', label: 'By Month', data: monthlyData, periodLabel: 'This Year', prevLabel: 'vs last year' },
  { key: 'year', label: 'By Year', data: yearlyData, periodLabel: 'All Time', prevLabel: 'vs previous year' },
]

// Previous period totals for comparison
const prevPeriodTotals = {
  hour: 14200,  // yesterday's total
  day: 28900,   // last week total
  week: 108400, // last month total
  month: 1178600, // last year total
  year: 1198000,  // 2024 total for comparison
}

// ─── EXISTING DATA ──────────────────────────────────────────────────

const recentTransactions = [
  { time: '20:14', table: 'T12', items: 'Espresso Martini x2, Negroni', amount: 39.00, staff: 'Marcus T.' },
  { time: '20:12', table: 'T8', items: 'G&T (Hendricks), House Red x2', amount: 35.50, staff: 'Anya K.' },
  { time: '20:09', table: 'T15', items: 'Old Fashioned, Whiskey Sour', amount: 27.00, staff: 'Marcus T.' },
  { time: '20:06', table: 'T3', items: 'Champagne (btl), Espresso Martini x3', amount: 98.00, staff: 'Sarah M.' },
  { time: '20:02', table: 'Bar', items: 'House Lager x4, Aperol Spritz x2', amount: 46.00, staff: 'Ben H.' },
  { time: '19:58', table: 'T6', items: 'Margarita x2, Cosmopolitan', amount: 42.00, staff: 'Tom R.' },
]

const topSelling = [
  { item: 'Espresso Martini', count: 14, revenue: 182 },
  { item: 'Negroni', count: 9, revenue: 117 },
  { item: 'G&T (Hendricks)', count: 8, revenue: 96 },
  { item: 'House Lager', count: 12, revenue: 72 },
  { item: 'Old Fashioned', count: 7, revenue: 98 },
]

// ─── TOP SELLERS — FULL PROFIT BREAKDOWN ────────────────────────────
// Labour: £12/hr, avg 2 min per drink = £0.40 per drink
// Fixed costs: £500/day across ~300 items = £1.67 per item
const LABOUR_PER_ITEM = 0.40
const FIXED_PER_ITEM = 1.67

const topSellersData = {
  today: [
    { item: 'Espresso Martini', qty: 47, price: 12.00, cogsUnit: 2.80 },
    { item: 'Margarita', qty: 38, price: 12.00, cogsUnit: 3.00 },
    { item: 'Negroni', qty: 31, price: 12.00, cogsUnit: 2.88 },
    { item: 'Old Fashioned', qty: 28, price: 13.00, cogsUnit: 3.25 },
    { item: 'Aperol Spritz', qty: 26, price: 11.00, cogsUnit: 2.75 },
    { item: 'G&T', qty: 24, price: 10.00, cogsUnit: 2.50 },
    { item: 'House Wine (glass)', qty: 22, price: 8.00, cogsUnit: 2.40 },
    { item: 'Pint of Lager', qty: 35, price: 6.50, cogsUnit: 2.27 },
    { item: 'Mojito', qty: 19, price: 12.00, cogsUnit: 3.60 },
    { item: 'Soft Drink', qty: 30, price: 3.50, cogsUnit: 0.70 },
  ],
  week: [
    { item: 'Espresso Martini', qty: 312, price: 12.00, cogsUnit: 2.80 },
    { item: 'Pint of Lager', qty: 278, price: 6.50, cogsUnit: 2.27 },
    { item: 'Margarita', qty: 245, price: 12.00, cogsUnit: 3.00 },
    { item: 'Negroni', qty: 198, price: 12.00, cogsUnit: 2.88 },
    { item: 'G&T', qty: 187, price: 10.00, cogsUnit: 2.50 },
    { item: 'Old Fashioned', qty: 176, price: 13.00, cogsUnit: 3.25 },
    { item: 'Soft Drink', qty: 210, price: 3.50, cogsUnit: 0.70 },
    { item: 'Aperol Spritz', qty: 165, price: 11.00, cogsUnit: 2.75 },
    { item: 'House Wine (glass)', qty: 154, price: 8.00, cogsUnit: 2.40 },
    { item: 'Mojito', qty: 132, price: 12.00, cogsUnit: 3.60 },
  ],
  month: [
    { item: 'Espresso Martini', qty: 1340, price: 12.00, cogsUnit: 2.80 },
    { item: 'Pint of Lager', qty: 1180, price: 6.50, cogsUnit: 2.27 },
    { item: 'Margarita', qty: 1050, price: 12.00, cogsUnit: 3.00 },
    { item: 'Negroni', qty: 890, price: 12.00, cogsUnit: 2.88 },
    { item: 'G&T', qty: 820, price: 10.00, cogsUnit: 2.50 },
    { item: 'Old Fashioned', qty: 760, price: 13.00, cogsUnit: 3.25 },
    { item: 'Soft Drink', qty: 910, price: 3.50, cogsUnit: 0.70 },
    { item: 'Aperol Spritz', qty: 710, price: 11.00, cogsUnit: 2.75 },
    { item: 'House Wine (glass)', qty: 680, price: 8.00, cogsUnit: 2.40 },
    { item: 'Mojito', qty: 580, price: 12.00, cogsUnit: 3.60 },
  ],
}

function calcRow(item) {
  const revenue = item.qty * item.price
  const cogs = item.qty * item.cogsUnit
  const labour = item.qty * LABOUR_PER_ITEM
  const fixed = item.qty * FIXED_PER_ITEM
  const profit = revenue - cogs - labour - fixed
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0
  return { ...item, revenue, cogs, labour, fixed, profit, margin }
}

function marginColor(m) {
  if (m > 55) return C.green
  if (m >= 40) return C.orange
  return C.red
}

function SortIcon({ column, sortCol, sortDir }) {
  if (sortCol !== column) return <span style={{ opacity: 0.2, marginLeft: 4, fontSize: 10 }}>{'↕'}</span>
  return <span style={{ marginLeft: 4, fontSize: 10 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
}

const SELLER_PERIOD_LABELS = { today: 'Today', week: 'This Week', month: 'This Month' }

const SELLER_COLUMNS = [
  { key: 'rank', label: '#', sortable: false },
  { key: 'item', label: 'Item', sortable: true },
  { key: 'qty', label: 'Qty Sold', sortable: true },
  { key: 'revenue', label: 'Revenue', sortable: true },
  { key: 'cogs', label: 'COGS', sortable: true },
  { key: 'labour', label: 'Labour', sortable: true },
  { key: 'fixed', label: 'Fixed Costs', sortable: true },
  { key: 'profit', label: 'Profit', sortable: true },
  { key: 'margin', label: 'Margin %', sortable: true },
]

// ─── COMPONENT ──────────────────────────────────────────────────────

export default function LiveTrading() {
  const [totalRevenue, setTotalRevenue] = useState(11870)
  const [liveCovers, setLiveCovers] = useState(216)
  const [pulse, setPulse] = useState(false)
  const [activePeriod, setActivePeriod] = useState('hour')
  const [sellersPeriod, setSellersPeriod] = useState('today')
  const [sortCol, setSortCol] = useState('qty')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalRevenue(prev => prev + Math.floor(Math.random() * 25 + 5))
      setPulse(true)
      setTimeout(() => setPulse(false), 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const rpc = (totalRevenue / liveCovers).toFixed(2)
  const targetRevenue = 14500
  const pctTarget = ((totalRevenue / targetRevenue) * 100).toFixed(0)

  const currentPeriod = PERIODS.find(p => p.key === activePeriod)
  const periodTotal = useMemo(() =>
    currentPeriod.data.reduce((sum, d) => sum + d.revenue, 0),
    [activePeriod]
  )
  const prevTotal = prevPeriodTotals[activePeriod]
  const periodChange = prevTotal ? ((periodTotal - prevTotal) / prevTotal * 100).toFixed(1) : null
  const isPositive = periodChange && parseFloat(periodChange) >= 0

  // ── Top Sellers computed data ──
  const sellersRows = useMemo(() => {
    const rows = topSellersData[sellersPeriod].map(calcRow)
    rows.sort((a, b) => {
      const valA = a[sortCol]
      const valB = b[sortCol]
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      return sortDir === 'asc' ? valA - valB : valB - valA
    })
    return rows
  }, [sellersPeriod, sortCol, sortDir])

  const sellersTotals = useMemo(() => {
    return sellersRows.reduce((acc, r) => ({
      qty: acc.qty + r.qty,
      revenue: acc.revenue + r.revenue,
      cogs: acc.cogs + r.cogs,
      labour: acc.labour + r.labour,
      fixed: acc.fixed + r.fixed,
      profit: acc.profit + r.profit,
    }), { qty: 0, revenue: 0, cogs: 0, labour: 0, fixed: 0, profit: 0 })
  }, [sellersRows])

  const totalMargin = sellersTotals.revenue > 0 ? (sellersTotals.profit / sellersTotals.revenue) * 100 : 0

  const avgPourProfit = sellersRows.length > 0
    ? sellersRows.reduce((sum, r) => sum + (r.profit / r.qty), 0) / sellersRows.length
    : 0

  const bestMarginItem = sellersRows.reduce((best, r) => r.margin > (best?.margin || 0) ? r : best, null)
  const highestVolumeItem = sellersRows.reduce((best, r) => r.qty > (best?.qty || 0) ? r : best, null)

  function handleSellerSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
  }

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, fontFamily: 'Georgia, serif' }}>
          Live Trading
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
          background: C.greenBg, border: `1px solid ${C.green}30`,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: C.green,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Big Revenue Number */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Today&apos;s Revenue</div>
        <div style={{
          fontSize: 52, fontWeight: 800, color: C.ink, letterSpacing: '-2px',
          fontFamily: "'JetBrains Mono', monospace",
          transition: 'color 0.3s',
          ...(pulse ? { color: C.teal } : {}),
        }}>
          {'£'}{totalRevenue.toLocaleString()}
        </div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 12 }}>
          <span style={{ color: C.textMuted }}>{liveCovers} covers</span>
          <span style={{ color: C.amber }}>{'£'}{rpc}/cover</span>
          <span style={{ color: parseInt(pctTarget) >= 80 ? C.green : C.amber }}>{pctTarget}% of {'£'}{targetRevenue.toLocaleString()} target</span>
        </div>
        <div style={{ height: 6, background: '#1E1E21', borderRadius: 3, overflow: 'hidden', marginTop: 14, maxWidth: 400, margin: '14px auto 0' }}>
          <div style={{
            height: '100%', width: `${Math.min(parseInt(pctTarget), 100)}%`, borderRadius: 3,
            background: `linear-gradient(90deg, ${C.teal}, ${C.green})`, transition: 'width 1s',
          }} />
        </div>
      </div>

      <div className="grid-2col-sidebar" style={{ marginBottom: 16 }}>
        {/* Revenue Chart with Time Period Selector */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Revenue by Period</div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{currentPeriod.periodLabel}</div>
            </div>
            {/* Period total + comparison */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>
                {'£'}{periodTotal.toLocaleString()}
              </div>
              {periodChange && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end',
                  fontSize: 11, fontWeight: 600, marginTop: 2,
                  color: isPositive ? C.green : C.red,
                }}>
                  {isPositive
                    ? <ArrowUpRight size={12} />
                    : <ArrowDownRight size={12} />
                  }
                  <span>{isPositive ? '+' : ''}{periodChange}% {currentPeriod.prevLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Time period tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto',
            WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none',
            padding: '2px',
          }}>
            {PERIODS.map(p => {
              const active = activePeriod === p.key
              return (
                <button
                  key={p.key}
                  onClick={() => setActivePeriod(p.key)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    background: active ? C.teal : 'transparent',
                    color: active ? '#000' : C.textMuted,
                    ...(active ? {} : { border: `1px solid ${C.border}` }),
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={currentPeriod.data}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.teal} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000000 ? `£${(v/1000000).toFixed(1)}M` : v >= 1000 ? `£${(v/1000).toFixed(0)}K` : `£${v}`}
              />
              <Tooltip
                contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                formatter={v => [`£${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke={C.teal} strokeWidth={2} fill="url(#tealGrad)"
                animationDuration={400} animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Top Selling Right Now</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topSelling.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{item.item}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{item.count} sold today</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{'£'}{item.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Revenue Leaderboard */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Staff Leaderboard &mdash; Today</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Sarah M.', role: 'Bar Lead', revenue: 3420, txns: 42, avg: 81.43, upsell: '28%' },
            { name: 'Marcus T.', role: 'Bartender', revenue: 2180, txns: 34, avg: 64.12, upsell: '22%' },
            { name: 'Tom R.', role: 'Server', revenue: 1840, txns: 28, avg: 65.71, upsell: '18%' },
            { name: 'Anya K.', role: 'Server', revenue: 1620, txns: 24, avg: 67.50, upsell: '15%' },
            { name: 'Ben H.', role: 'Bartender', revenue: 1480, txns: 22, avg: 67.27, upsell: '20%' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: 8, background: i === 0 ? `${C.teal}08` : C.bg,
              border: `1px solid ${i === 0 ? `${C.teal}30` : C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? C.teal : i === 1 ? C.amber : C.textDim + '30',
                  fontSize: 11, fontWeight: 700, color: i < 2 ? '#000' : C.textMuted,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>{s.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: C.teal, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{s.revenue.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>{s.txns} txns</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 50 }}>
                  <div style={{ color: C.textMuted }}>{s.upsell}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>upsell</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Recent Transactions</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Time', 'Table', 'Items', 'Amount', 'Staff'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px', color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{t.time}</td>
                <td style={{ padding: '10px', color: C.ink, fontWeight: 600 }}>{t.table}</td>
                <td style={{ padding: '10px', color: C.text }}>{t.items}</td>
                <td style={{ padding: '10px', color: C.teal, fontWeight: 600 }}>{'£'}{t.amount.toFixed(2)}</td>
                <td style={{ padding: '10px', color: C.textMuted }}>{t.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Top Sellers — Full Profit Breakdown ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        {/* Header + Period Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Top Sellers &mdash; Profit Breakdown</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Object.entries(SELLER_PERIOD_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setSellersPeriod(key)} style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: sellersPeriod === key ? `1px solid ${C.teal}` : `1px solid ${C.border}`,
                background: sellersPeriod === key ? `${C.teal}18` : 'transparent',
                color: sellersPeriod === key ? C.teal : C.textMuted,
                transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid-kpi-3" style={{ marginBottom: 16 }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
              <PoundSterling size={14} style={{ color: C.amber }} />
              <span style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Pour Profit</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>
              {'£'}{avgPourProfit.toFixed(2)}
            </div>
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
              <Award size={14} style={{ color: C.green }} />
              <span style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Margin</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.green, fontFamily: "'JetBrains Mono', monospace" }}>
              {bestMarginItem?.item}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{bestMarginItem?.margin.toFixed(1)}%</div>
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
              <Target size={14} style={{ color: C.teal }} />
              <span style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Highest Volume</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.teal, fontFamily: "'JetBrains Mono', monospace" }}>
              {highestVolumeItem?.item}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{highestVolumeItem?.qty} sold</div>
          </div>
        </div>

        {/* Sortable Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {SELLER_COLUMNS.map(col => (
                  <th key={col.key}
                    onClick={col.sortable ? () => handleSellerSort(col.key) : undefined}
                    style={{
                      padding: '8px 8px', textAlign: col.key === 'item' ? 'left' : 'right',
                      color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase',
                      cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}>
                    {col.label}{col.sortable && <SortIcon column={col.key} sortCol={sortCol} sortDir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sellersRows.map((r, i) => {
                const isHighestMargin = bestMarginItem && r.item === bestMarginItem.item
                const isHighestVolume = highestVolumeItem && r.item === highestVolumeItem.item
                return (
                  <tr key={r.item} style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: isHighestMargin ? `${C.green}08` : isHighestVolume ? `${C.teal}08` : 'transparent',
                  }}>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{i + 1}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'left', color: C.ink, fontWeight: 500 }}>
                      {r.item}
                      {isHighestMargin && <span style={{ marginLeft: 6, fontSize: 9, color: C.green, border: `1px solid ${C.green}40`, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>BEST MARGIN</span>}
                      {isHighestVolume && !isHighestMargin && <span style={{ marginLeft: 6, fontSize: 9, color: C.teal, border: `1px solid ${C.teal}40`, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>TOP VOLUME</span>}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{r.qty}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.ink, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{r.revenue.toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{r.cogs.toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{r.labour.toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{r.fixed.toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: C.green, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{r.profit.toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: marginColor(r.margin) }}>
                      {r.margin.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `2px solid ${C.border}`, background: `${C.teal}06` }}>
                <td style={{ padding: '10px 8px' }} />
                <td style={{ padding: '10px 8px', textAlign: 'left', color: C.ink, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Totals</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: C.ink, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{sellersTotals.qty}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: C.ink, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{sellersTotals.revenue.toFixed(2)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: C.red, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{sellersTotals.cogs.toFixed(2)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textMuted, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{sellersTotals.labour.toFixed(2)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textMuted, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{sellersTotals.fixed.toFixed(2)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: C.green, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{'£'}{sellersTotals.profit.toFixed(2)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: marginColor(totalMargin) }}>{totalMargin.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
