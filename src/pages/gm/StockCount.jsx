import { useState } from 'react'
import { Package, AlertTriangle, CheckCircle, Search } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const initialStock = [
  { id: 1, name: "Hendrick's Gin 70cl", category: 'Spirits', par: 6, expected: 3, counted: null, price: 26.00 },
  { id: 2, name: 'Tanqueray No. Ten 70cl', category: 'Spirits', par: 5, expected: 4, counted: null, price: 24.50 },
  { id: 3, name: 'Patron Silver 70cl', category: 'Spirits', par: 5, expected: 2, counted: null, price: 29.90 },
  { id: 4, name: 'Maker\'s Mark 70cl', category: 'Spirits', par: 4, expected: 3, counted: null, price: 22.00 },
  { id: 5, name: 'Aperol 70cl', category: 'Spirits', par: 6, expected: 4, counted: null, price: 14.50 },
  { id: 6, name: 'Champagne (House) Brut NV', category: 'Wine', par: 12, expected: 5, counted: null, price: 18.00 },
  { id: 7, name: 'Malbec (House) 75cl', category: 'Wine', par: 8, expected: 6, counted: null, price: 5.80 },
  { id: 8, name: 'Sauvignon Blanc (House) 75cl', category: 'Wine', par: 8, expected: 5, counted: null, price: 5.40 },
  { id: 9, name: 'Fever-Tree Tonic 200ml', category: 'Mixers', par: 48, expected: 18, counted: null, price: 0.80 },
  { id: 10, name: 'Fever-Tree Ginger Beer 200ml', category: 'Mixers', par: 24, expected: 14, counted: null, price: 0.80 },
  { id: 11, name: 'Angostura Bitters 200ml', category: 'Bitters', par: 4, expected: 1, counted: null, price: 9.20 },
  { id: 12, name: 'Fresh Limes (each)', category: 'Garnish', par: 60, expected: 20, counted: null, price: 0.15 },
  { id: 13, name: 'Fresh Lemons (each)', category: 'Garnish', par: 40, expected: 28, counted: null, price: 0.12 },
  { id: 14, name: 'Peroni Nastro Azzurro 330ml', category: 'Beer', par: 48, expected: 22, counted: null, price: 1.10 },
]

export default function StockCount() {
  const [stock, setStock] = useState(initialStock)
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const categories = ['All', ...new Set(initialStock.map(s => s.category))]

  const updateCount = (id, value) => {
    setStock(prev => prev.map(s => s.id === id ? { ...s, counted: value === '' ? null : parseInt(value) || 0 } : s))
  }

  const filtered = stock.filter(s => {
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false
    if (filter && !s.name.toLowerCase().includes(filter.toLowerCase())) return false
    return true
  })

  const counted = stock.filter(s => s.counted !== null).length
  const variances = stock.filter(s => s.counted !== null && s.counted !== s.expected).length
  const belowPar = stock.filter(s => (s.counted ?? s.expected) < s.par * 0.5).length

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Stock Count
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Items Counted</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: counted === stock.length ? C.green : C.teal }}>{counted}/{stock.length}</div>
          <div style={{ height: 4, background: '#1E1E21', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(counted / stock.length) * 100}%`, background: C.teal, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Variances Found</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: variances > 0 ? C.red : C.green }}>{variances}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Below Par Level</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: belowPar > 0 ? C.orange : C.green }}>{belowPar}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Estimated Value</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>
            {'£'}{stock.reduce((s, i) => s + (i.counted ?? i.expected) * i.price, 0).toFixed(0)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8,
          background: C.card, border: `1px solid ${C.border}`,
        }}>
          <Search size={16} color={C.textDim} />
          <input
            type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search items..."
            style={{ flex: 1, background: 'transparent', border: 'none', color: C.text, fontSize: 13, outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: categoryFilter === cat ? C.teal + '20' : C.card,
              border: `1px solid ${categoryFilter === cat ? C.teal : C.border}`,
              color: categoryFilter === cat ? C.teal : C.textMuted,
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Item', 'Category', 'Par', 'Expected', 'Count', 'Variance', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.textDim, fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const variance = item.counted !== null ? item.counted - item.expected : null
              const level = (item.counted ?? item.expected)
              const belowHalf = level < item.par * 0.5
              return (
                <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px', color: C.ink, fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '10px', color: C.textMuted }}>{item.category}</td>
                  <td style={{ padding: '10px', color: C.textDim }}>{item.par}</td>
                  <td style={{ padding: '10px', color: C.textMuted }}>{item.expected}</td>
                  <td style={{ padding: '10px' }}>
                    <input
                      type="number" min="0"
                      value={item.counted ?? ''}
                      onChange={e => updateCount(item.id, e.target.value)}
                      placeholder="—"
                      style={{
                        width: 60, padding: '6px 8px', borderRadius: 6, textAlign: 'center',
                        background: C.bg, border: `1px solid ${item.counted !== null ? C.teal : C.border}`,
                        color: C.ink, fontSize: 13, fontWeight: 600, outline: 'none',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px', fontWeight: 600, color: variance === null ? C.textDim : variance === 0 ? C.green : C.red }}>
                    {variance === null ? '—' : variance === 0 ? '✓' : `${variance > 0 ? '+' : ''}${variance}`}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {belowHalf ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.red, fontSize: 11, fontWeight: 600 }}>
                        <AlertTriangle size={12} /> Low
                      </span>
                    ) : item.counted !== null ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.green, fontSize: 11 }}>
                        <CheckCircle size={12} /> Counted
                      </span>
                    ) : (
                      <span style={{ color: C.textDim, fontSize: 11 }}>Pending</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
