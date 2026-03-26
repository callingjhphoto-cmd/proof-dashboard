import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronDown, ChevronUp, Users, PoundSterling, Clock, TrendingUp, ArrowUpDown } from 'lucide-react'
import { CUSTOMERS, SEGMENTS } from '../../data/customers'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  orange: '#F97316',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const segmentConfig = {
  regular: { label: 'Regular', color: C.green, bg: C.greenBg },
  high_spender: { label: 'High Spender', color: C.amber, bg: C.amberBg },
  lapsed: { label: 'Lapsed', color: C.red, bg: C.redBg },
  new: { label: 'New', color: C.blue, bg: C.blueBg },
  normal: { label: 'Normal', color: C.textMuted, bg: 'rgba(136,136,136,0.08)' },
}

function SegmentBadge({ segment }) {
  const cfg = segmentConfig[segment]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}25`,
    }}>{cfg.label}</span>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} color={color || C.textMuted} />
        <span style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{value}</div>
    </div>
  )
}

export default function CustomerDirectory() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('lastVisit')
  const [sortDir, setSortDir] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = [...CUSTOMERS]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q))
    }
    if (segmentFilter !== 'all') {
      list = list.filter(c => c.segment === segmentFilter)
    }
    list.sort((a, b) => {
      let va, vb
      if (sortBy === 'name') { va = a.name; vb = b.name }
      else if (sortBy === 'visits') { va = a.totalVisits; vb = b.totalVisits }
      else if (sortBy === 'spend') { va = a.totalSpend; vb = b.totalSpend }
      else { va = a.lastVisit; vb = b.lastVisit }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [search, segmentFilter, sortBy, sortDir])

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
  }

  const totalCustomers = CUSTOMERS.length
  const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.totalSpend, 0)
  const avgLTV = Math.round(totalRevenue / totalCustomers)
  const activeThisMonth = CUSTOMERS.filter(c => c.lastVisit >= '2026-03-01').length

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Customer Directory</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Manage your customer relationships and track engagement</p>
      </div>

      {/* Stats */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <StatCard icon={Users} label="Total Customers" value={totalCustomers} color={C.amber} />
        <StatCard icon={PoundSterling} label="Total Revenue" value={`\u00a3${totalRevenue.toLocaleString()}`} color={C.green} />
        <StatCard icon={TrendingUp} label="Avg Lifetime Value" value={`\u00a3${avgLTV.toLocaleString()}`} color={C.blue} />
        <StatCard icon={Clock} label="Active This Month" value={activeThisMonth} color={C.amber} />
      </div>

      {/* Search & Filters */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16,
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
      }}>
        <div style={{
          flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8,
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px',
        }}>
          <Search size={16} color={C.textMuted} />
          <input
            type="text" placeholder="Search by name, email, or phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: C.ink, fontSize: 13, fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
          background: showFilters ? C.amberBg : 'transparent', border: `1px solid ${showFilters ? C.amber + '40' : C.border}`,
          color: showFilters ? C.amber : C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          <Filter size={14} /> Filters {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16,
          display: 'flex', flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 12, color: C.textMuted, alignSelf: 'center', marginRight: 4 }}>Segment:</span>
          {['all', 'regular', 'high_spender', 'lapsed', 'new', 'normal'].map(seg => {
            const active = segmentFilter === seg
            const cfg = seg === 'all' ? { label: 'All', color: C.amber, bg: C.amberBg } : segmentConfig[seg]
            return (
              <button key={seg} onClick={() => setSegmentFilter(seg)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: active ? 600 : 400,
                border: `1px solid ${active ? cfg.color + '60' : C.border}`,
                background: active ? cfg.bg : 'transparent',
                color: active ? cfg.color : C.textMuted, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>{cfg.label} {seg !== 'all' && `(${CUSTOMERS.filter(c => c.segment === seg).length})`}</button>
            )
          })}
        </div>
      )}

      {/* Customer Table — Desktop */}
      <div className="customer-table-desktop" style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {[
                { key: 'name', label: 'Customer' },
                { key: 'segment', label: 'Segment' },
                { key: 'visits', label: 'Visits' },
                { key: 'spend', label: 'Total Spend' },
                { key: 'avgSpend', label: 'Avg Spend' },
                { key: 'lastVisit', label: 'Last Visit' },
                { key: 'favourite', label: 'Favourite' },
              ].map(col => (
                <th key={col.key} onClick={() => col.key !== 'segment' && col.key !== 'favourite' && toggleSort(col.key === 'avgSpend' ? 'spend' : col.key)}
                  style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                    color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px',
                    cursor: col.key !== 'segment' && col.key !== 'favourite' ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.key !== 'segment' && col.key !== 'favourite' && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => navigate(`/customers/${c.id}`)}
                style={{ borderBottom: `1px solid ${C.border}`, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: C.ink, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{c.email}</div>
                </td>
                <td style={{ padding: '14px 16px' }}><SegmentBadge segment={c.segment} /></td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{c.totalVisits}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{'\u00a3'}{c.totalSpend.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{'\u00a3'}{c.avgSpend}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.text }}>{c.lastVisit}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.textMuted }}>{c.favouriteItem}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontSize: 14 }}>No customers match your search</div>
        )}
      </div>

      {/* Mobile cards — shown via CSS */}
      <style>{`
        .customer-table-desktop table thead, .customer-table-desktop table tbody { display: table; width: 100%; }
        .customer-mobile-cards { display: none; }
        @media (max-width: 768px) {
          .customer-table-desktop { display: none !important; }
          .customer-mobile-cards { display: flex !important; flex-direction: column; gap: 10px; }
        }
      `}</style>
      <div className="customer-mobile-cards" style={{ display: 'none' }}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => navigate(`/customers/${c.id}`)} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 600, color: C.ink, fontSize: 14 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{c.email}</div>
              </div>
              <SegmentBadge segment={c.segment} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.textDim }}>Visits</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{c.totalVisits}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.textDim }}>Spend</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{'\u00a3'}{c.totalSpend.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.textDim }}>Last Visit</div>
                <div style={{ fontSize: 12, color: C.text }}>{c.lastVisit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: C.textDim, textAlign: 'right' }}>
        Showing {filtered.length} of {CUSTOMERS.length} customers
      </div>
    </div>
  )
}
