import { FileText, Download, Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316',
  blue: '#3B82F6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const febSummary = {
  highlights: [
    { label: 'Portfolio Revenue', value: '£742k', change: '+3.8%', dir: 'up', good: true },
    { label: 'Net Profit', value: '£74k', change: '+12.1%', dir: 'up', good: true },
    { label: 'Avg Labour %', value: '31.4%', change: '+1.2pts', dir: 'up', good: false },
    { label: 'Avg GP %', value: '67.2%', change: '+0.8pts', dir: 'up', good: true },
  ],
  topVenue: 'The Ivy Soho Brasserie',
  topVenueDetail: '22.0% EBITDA margin, highest in portfolio',
  watchVenue: 'The Ivy Tower Bridge',
  watchVenueDetail: 'Revenue down 8.5% MoM. Labour at 36.2%.',
  aiInsight: 'Cocktail revenue grew 14% across all venues, driven by Espresso Martini demand. Recommend standardising pre-batch protocols across all sites to capture this trend.',
}

const reports = [
  { title: 'March 2026 Board Report', type: 'Monthly', date: '18 Mar 2026', status: 'generating', pages: 12 },
  { title: 'February 2026 Board Report', type: 'Monthly', date: '01 Mar 2026', status: 'ready', pages: 14 },
  { title: 'Q4 2025 Quarterly Review', type: 'Quarterly', date: '15 Jan 2026', status: 'ready', pages: 28 },
  { title: 'January 2026 Board Report', type: 'Monthly', date: '01 Feb 2026', status: 'ready', pages: 13 },
  { title: 'Q3 2025 Quarterly Review', type: 'Quarterly', date: '15 Oct 2025', status: 'ready', pages: 26 },
  { title: 'December 2025 Board Report', type: 'Monthly', date: '01 Jan 2026', status: 'ready', pages: 15 },
]

const reportSections = [
  'Executive Summary',
  'Portfolio P&L Overview',
  'Venue-by-Venue Performance',
  'Labour Cost Analysis',
  'GP% by Category & Venue',
  'Stock & Wastage Report',
  'Cash Flow & Forecast',
  'AI Anomaly Summary',
  'Staff Metrics & Turnover',
  'Competitive Benchmarks',
  'Recommendations & Next Steps',
]

export default function Reports() {
  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Board-Ready Reports
      </div>

      {/* Current report preview */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>March 2026 Board Report</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Auto-generating... 78% complete</div>
          </div>
          <div style={{
            padding: '6px 14px', borderRadius: 8, background: C.amberBg, border: `1px solid ${C.amber}30`,
            color: C.amber, fontSize: 12, fontWeight: 600,
          }}>Generating</div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#1E1E21', borderRadius: 2, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: '100%', width: '78%', background: C.amber, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>

        {/* Report sections checklist */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Report Sections</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {reportSections.map((section, i) => {
            const done = i < 8
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6,
                background: done ? 'rgba(34,197,94,0.06)' : C.bg,
                fontSize: 12, color: done ? C.green : C.textDim,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4, border: `1px solid ${done ? C.green : C.border}`,
                  background: done ? C.green : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#fff',
                }}>{done ? '\u2713' : ''}</div>
                {section}
              </div>
            )
          })}
        </div>
      </div>

      {/* February Report Preview */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>February 2026 &mdash; Executive Summary</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Preview of last completed report</div>
          </div>
          <button
            onClick={() => alert('Downloading February 2026 Board Report (14 pages)...\n\nIn production, this generates a full PDF export.')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
              background: C.amber, border: 'none', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
            aria-label="Download February 2026 Board Report as PDF"
          >
            <Download size={14} /> Full PDF
          </button>
        </div>

        <div className="grid-kpi-4" style={{ marginBottom: 16 }}>
          {febSummary.highlights.map((h, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{h.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{h.value}</div>
              <div style={{ fontSize: 11, color: h.good ? C.green : C.red, marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                {h.dir === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {h.change} vs Jan
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2col" style={{ marginBottom: 12 }}>
          <div style={{ padding: '12px 16px', borderRadius: 8, background: C.greenBg, borderLeft: `3px solid ${C.green}` }}>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Top Performer</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{febSummary.topVenue}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{febSummary.topVenueDetail}</div>
          </div>
          <div style={{ padding: '12px 16px', borderRadius: 8, background: C.redBg, borderLeft: `3px solid ${C.red}` }}>
            <div style={{ fontSize: 11, color: C.red, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={10} /> Requires Attention
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{febSummary.watchVenue}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{febSummary.watchVenueDetail}</div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderRadius: 8, background: C.amberBg, borderLeft: `3px solid ${C.amber}`, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600, color: C.amber }}>AI Insight:</span> {febSummary.aiInsight}
        </div>
      </div>

      {/* Report history */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Report Archive</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reports.filter(r => r.status === 'ready').map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`,
              cursor: 'pointer', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8, background: C.amberBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={18} color={C.amber} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: C.textDim, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span><Calendar size={10} style={{ verticalAlign: 'middle' }} /> {r.date}</span>
                    <span>{r.pages} pages</span>
                    <span style={{ color: r.type === 'Quarterly' ? C.blue : C.textDim }}>{r.type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading ${r.title} (${r.pages} pages)...\n\nIn production, this generates a PDF export.`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 6,
                  border: `1px solid ${C.border}`, background: 'transparent', color: C.textMuted,
                  fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.amber; e.currentTarget.style.color = C.amber }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted }}
                aria-label={`Download ${r.title} as PDF`}
              >
                <Download size={14} /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
