import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, LayoutDashboard, BarChart3, Users, Brain, TrendingUp, Zap } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', red: '#EF4444',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const STEPS = [
  {
    icon: Zap,
    title: 'Welcome to Proof',
    subtitle: 'Your AI-powered hospitality operations platform',
    body: 'Proof gives you real-time intelligence across your entire venue portfolio. Revenue tracking, labour analysis, stock management, and competitor monitoring \u2014 all in one place.',
    highlight: 'This 60-second tour shows you the key features.',
  },
  {
    icon: LayoutDashboard,
    title: 'Business Loop',
    subtitle: 'Your daily command centre',
    body: 'The Business Loop is your default landing page. It surfaces the most critical metrics, alerts, and actions across all venues in a single view. Start every morning here.',
    highlight: 'Navigate: Business Loop (homepage)',
  },
  {
    icon: TrendingUp,
    title: 'Live Trading & P&L',
    subtitle: 'Real-time revenue tracking',
    body: 'Track live revenue against targets, monitor covers per hour, and see your P&L in real time. GMs use Live Trading during service; Owners use P&L for the big picture.',
    highlight: 'Navigate: Live Trading (GM) / P&L (Owner)',
  },
  {
    icon: Users,
    title: 'Labour & Scheduling',
    subtitle: 'Your biggest cost, optimised',
    body: 'Labour Trends shows historical staffing costs as a percentage of revenue. The Scheduling AI builds optimal rotas based on predicted demand. Target: keep labour under 30% of revenue.',
    highlight: 'Navigate: Labour Trends / Scheduling AI',
  },
  {
    icon: Brain,
    title: 'AI Insights & Competitor Watch',
    subtitle: 'Intelligence that drives decisions',
    body: 'AI Insights surfaces anomalies, trends, and recommendations from your data. Competitor Watch tracks nearby venues\u2019 Google ratings, pricing, and review sentiment \u2014 Owner-only access.',
    highlight: 'Navigate: AI Insights / Competitor Watch (Owner)',
  },
  {
    icon: BarChart3,
    title: 'You\u2019re all set',
    subtitle: 'Start exploring Proof',
    body: 'Use the sidebar to navigate between features. Switch roles (Owner / GM / Employee) from the bottom of the sidebar to see different views. Each role sees only what they need.',
    highlight: 'Tip: The Morning Briefing gives you a daily summary at a glance.',
  },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('proof_onboarding_complete')
    if (!seen) setVisible(true)
  }, [])

  const handleComplete = () => {
    localStorage.setItem('proof_onboarding_complete', '1')
    setVisible(false)
    if (onComplete) onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!visible) return null

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        maxWidth: 480, width: '100%', position: 'relative', overflow: 'hidden',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: C.border }}>
          <div style={{
            height: '100%', background: C.amber, transition: 'width 0.3s ease',
            width: `${((step + 1) / STEPS.length) * 100}%`,
          }} />
        </div>

        {/* Close / Skip */}
        <button onClick={handleSkip} style={{
          position: 'absolute', top: 12, right: 12, background: 'transparent',
          border: 'none', color: C.textDim, cursor: 'pointer', padding: 4,
        }}>
          <X size={18} />
        </button>

        {/* Content */}
        <div style={{ padding: '32px 28px 24px' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: C.amberBg, border: `1px solid ${C.amber}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Icon size={22} color={C.amber} />
          </div>

          <div style={{ fontSize: 10, fontWeight: 600, color: C.amber, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{current.title}</h2>
          <p style={{ fontSize: 13, color: C.amber, fontWeight: 500, marginBottom: 12 }}>{current.subtitle}</p>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 16 }}>{current.body}</p>
          <div style={{
            fontSize: 11, color: C.textMuted, padding: '8px 12px', borderRadius: 8,
            background: C.bg, border: `1px solid ${C.border}`,
          }}>
            {current.highlight}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 28px 20px', borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
              background: 'transparent', color: step === 0 ? C.textDim : C.text,
              cursor: step === 0 ? 'default' : 'pointer', fontSize: 12, fontWeight: 500,
              opacity: step === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <div style={{ display: 'flex', gap: 4 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === step ? C.amber : C.border,
                transition: 'background 0.2s',
              }} />
            ))}
          </div>

          {isLast ? (
            <button onClick={handleComplete} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: C.amber, color: '#000', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
            }}>
              Get Started
            </button>
          ) : (
            <button onClick={() => setStep(s => s + 1)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.amber}`,
              background: C.amberBg, color: C.amber, cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
            }}>
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
