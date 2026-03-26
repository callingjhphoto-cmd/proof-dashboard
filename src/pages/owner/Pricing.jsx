import { useState } from 'react'
import { Check, X, ArrowRight, Building2, Building, Sparkles, Calculator } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const PLANS = [
  {
    name: 'Single Venue',
    price: 299,
    period: '/mo',
    icon: Building2,
    description: 'Everything you need to run one venue with AI-powered intelligence.',
    highlight: false,
    features: [
      { text: '1 venue', included: true },
      { text: 'All dashboards (P&L, Cash Flow, Labour, Stock)', included: true },
      { text: 'AI Insights & Morning Briefing', included: true },
      { text: 'Live Trading view', included: true },
      { text: 'Competitor Watch (5 competitors)', included: true },
      { text: 'Scheduling AI', included: true },
      { text: 'CRM & Loyalty (up to 2,000 customers)', included: true },
      { text: 'Menu Engineering', included: true },
      { text: 'Bookings integration', included: true },
      { text: 'All 3 role views (Owner, GM, Employee)', included: true },
      { text: 'Email support', included: true },
      { text: 'Multi-venue League Table', included: false },
      { text: 'Expansion Modelling', included: false },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Multi-Site',
    price: 599,
    period: '/mo',
    icon: Building,
    description: 'For operators running 2\u20135 venues who need portfolio-level intelligence.',
    highlight: true,
    features: [
      { text: 'Up to 5 venues', included: true },
      { text: 'Everything in Single Venue', included: true },
      { text: 'Multi-Venue League Table', included: true },
      { text: 'Cross-venue benchmarking', included: true },
      { text: 'Expansion Modelling & Lease Calculator', included: true },
      { text: 'Competitor Watch (15 competitors)', included: true },
      { text: 'CRM & Loyalty (up to 10,000 customers)', included: true },
      { text: 'Weekly Ops Review (automated)', included: true },
      { text: 'Ops Intelligence (cross-venue patterns)', included: true },
      { text: 'Priority support (24hr response)', included: true },
      { text: 'POS integration (Square, Lightspeed)', included: true },
      { text: 'Dedicated account manager', included: false },
      { text: 'Custom AI models', included: false },
      { text: 'White-label reporting', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    period: '',
    icon: Sparkles,
    description: 'For groups with 6+ venues. Custom pricing, dedicated support, bespoke integrations.',
    highlight: false,
    features: [
      { text: 'Unlimited venues', included: true },
      { text: 'Everything in Multi-Site', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom AI models trained on your data', included: true },
      { text: 'White-label reporting & dashboards', included: true },
      { text: 'Bespoke POS/ERP integrations', included: true },
      { text: 'CRM & Loyalty (unlimited customers)', included: true },
      { text: 'API access', included: true },
      { text: 'On-site onboarding & training', included: true },
      { text: 'SLA with 4hr response time', included: true },
      { text: 'Custom competitor analysis', included: true },
      { text: 'Board-ready reporting packs', included: true },
    ],
  },
]

function ROICalculator() {
  const [venues, setVenues] = useState(3)
  const [avgRevenue, setAvgRevenue] = useState(150000)
  const [labourPct, setLabourPct] = useState(32)

  const currentLabourCost = venues * avgRevenue * 12 * (labourPct / 100)
  const optimisedLabourPct = Math.max(labourPct - 3, 25)
  const optimisedLabourCost = venues * avgRevenue * 12 * (optimisedLabourPct / 100)
  const labourSaving = currentLabourCost - optimisedLabourCost
  const wasteSaving = venues * avgRevenue * 12 * 0.02
  const revenueLift = venues * avgRevenue * 12 * 0.015
  const totalAnnualValue = labourSaving + wasteSaving + revenueLift
  const proofCost = venues <= 1 ? 299 * 12 : venues <= 5 ? 599 * 12 : 999 * 12
  const roi = Math.round(((totalAnnualValue - proofCost) / proofCost) * 100)

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Calculator size={20} color={C.amber} />
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>ROI Calculator</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Number of Venues: {venues}
          </label>
          <input type="range" min={1} max={20} value={venues} onChange={e => setVenues(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: C.amber }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Avg Monthly Revenue: {'\u00a3'}{avgRevenue.toLocaleString()}
          </label>
          <input type="range" min={50000} max={500000} step={10000} value={avgRevenue} onChange={e => setAvgRevenue(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: C.amber }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Labour %: {labourPct}%
          </label>
          <input type="range" min={20} max={45} value={labourPct} onChange={e => setLabourPct(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: C.amber }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Labour Optimisation', value: labourSaving, note: `${labourPct}% \u2192 ${optimisedLabourPct}%` },
          { label: 'Waste Reduction', value: wasteSaving, note: '~2% of revenue' },
          { label: 'Revenue Uplift', value: revenueLift, note: '~1.5% from AI insights' },
          { label: 'Total Annual Value', value: totalAnnualValue, highlight: true },
          { label: 'Proof Annual Cost', value: proofCost, negative: true },
          { label: 'ROI', value: roi, suffix: '%', highlight: true },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '14px 16px', borderRadius: 10,
            background: item.highlight ? C.amberBg : C.bg,
            border: `1px solid ${item.highlight ? C.amber + '40' : C.border}`,
          }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
            <div style={{
              fontSize: 20, fontWeight: 800, marginTop: 4,
              color: item.negative ? C.red : item.highlight ? C.amber : C.ink,
            }}>
              {item.suffix ? `${item.value}${item.suffix}` : `${item.negative ? '-' : ''}\u00a3${Math.abs(Math.round(item.value)).toLocaleString()}`}
            </div>
            {item.note && <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{item.note}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Pricing() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.ink, marginBottom: 8 }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 500, margin: '0 auto' }}>
          Choose the plan that fits your operation. All plans include a 14-day free trial.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
        {PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <div key={plan.name} style={{
              background: C.card, border: `1px solid ${plan.highlight ? C.amber : C.border}`,
              borderRadius: 16, padding: 28, position: 'relative',
              boxShadow: plan.highlight ? `0 0 30px ${C.amber}15` : 'none',
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                  background: C.amber, color: '#000', fontSize: 10, fontWeight: 700,
                  padding: '3px 14px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>Most Popular</div>
              )}

              <Icon size={24} color={plan.highlight ? C.amber : C.textMuted} style={{ marginBottom: 12 }} />

              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{plan.name}</h3>
              <div style={{ marginBottom: 12 }}>
                {plan.price ? (
                  <span style={{ fontSize: 36, fontWeight: 800, color: C.ink }}>{'\u00a3'}{plan.price}</span>
                ) : (
                  <span style={{ fontSize: 20, fontWeight: 700, color: C.amber }}>Custom</span>
                )}
                <span style={{ fontSize: 14, color: C.textMuted }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.6 }}>{plan.description}</p>

              <button style={{
                width: '100%', padding: '12px 0', borderRadius: 10,
                border: plan.highlight ? 'none' : `1px solid ${C.border}`,
                background: plan.highlight ? C.amber : 'transparent',
                color: plan.highlight ? '#000' : C.text,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginBottom: 20, transition: 'all 0.2s',
              }}>
                {plan.price ? 'Start Free Trial' : 'Contact Sales'} <ArrowRight size={14} />
              </button>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                {plan.features.map((feat, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
                    fontSize: 12, color: feat.included ? C.text : C.textDim,
                  }}>
                    {feat.included ? (
                      <Check size={14} color={C.green} />
                    ) : (
                      <X size={14} color={C.textDim} />
                    )}
                    <span style={{ textDecoration: feat.included ? 'none' : 'line-through' }}>{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <ROICalculator />

      <div style={{
        textAlign: 'center', marginTop: 40, padding: '24px 20px',
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
      }}>
        <p style={{ fontSize: 13, color: C.textMuted }}>
          All plans include a 14-day free trial. No credit card required to start.
          <br />Enterprise customers: <a href="mailto:james@huertas.co.uk" style={{ color: C.amber, textDecoration: 'none' }}>Contact us</a> for a custom demo and pricing.
        </p>
      </div>
    </div>
  )
}
