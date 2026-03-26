import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, SkipForward, Zap } from 'lucide-react'
import { ROLES } from '../context/RoleContext'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  teal: '#14B8A6', tealBg: 'rgba(20,184,166,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  green: '#22C55E', red: '#EF4444',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const TOUR_STEPS = {
  [ROLES.OWNER]: [
    {
      target: null,
      title: 'Welcome to Proof',
      description: 'Your AI operations intelligence platform. In 60 seconds, we\'ll show you how Proof replaces expensive ops managers with real-time data intelligence across all your venues.',
      position: 'center',
    },
    {
      target: '[data-tour="sidebar"]',
      title: 'Navigation',
      description: 'Your command centre. Every tool you need is in the sidebar — from venue performance to AI insights, CRM, and scheduling.',
      position: 'right',
    },
    {
      target: '[data-tour="business-loop"]',
      title: 'The Business Loop',
      description: 'See how every part of your venue connects — POS feeds CRM, CRM drives marketing, marketing boosts bookings, bookings inform staffing. It\'s a closed-loop system.',
      position: 'bottom',
    },
    {
      target: '[data-tour="header"]',
      title: 'Live Trading',
      description: 'Real-time revenue, staff performance, and top sellers. Know exactly how tonight\'s service is going without picking up the phone.',
      position: 'bottom',
    },
    {
      target: '[data-tour="crm-section"]',
      title: 'CRM Intelligence',
      description: 'Your customers, their habits, and how to bring them back. Automated segmentation, loyalty tracking, and campaign tools built for hospitality.',
      position: 'right',
    },
    {
      target: '[data-tour="ops-section"]',
      title: 'Ops Intelligence',
      description: 'Morning briefing, alerts, and venue health score. Your AI ops director surfaces what matters before you even ask.',
      position: 'right',
    },
    {
      target: '[data-tour="expansion-link"]',
      title: 'Expansion Planning',
      description: 'Find your next location with real market data. Compare scenarios, model financials, and make confident expansion decisions.',
      position: 'right',
    },
    {
      target: null,
      title: 'You\'re All Set!',
      description: 'Start exploring your venues. Proof learns from your data every day — the more you use it, the smarter it gets. Click any page in the sidebar to begin.',
      position: 'center',
    },
  ],
  [ROLES.GM]: [
    {
      target: null,
      title: 'Welcome to Proof',
      description: 'Your venue operations hub. We\'ll walk you through the tools that keep your service running smoothly every single shift.',
      position: 'center',
    },
    {
      target: '[data-tour="sidebar"]',
      title: 'Your Dashboard',
      description: 'The Pass gives you a live snapshot of today — covers, revenue, weather impact, and anything that needs your attention right now.',
      position: 'right',
    },
    {
      target: '[data-tour="live-trading"]',
      title: 'Live Trading',
      description: 'Watch revenue roll in real-time. See hourly breakdowns, top sellers, and staff performance as the shift unfolds.',
      position: 'right',
    },
    {
      target: '[data-tour="rota-link"]',
      title: 'Rota & Scheduling',
      description: 'AI-optimised rotas that balance labour cost with demand forecasting. Drag, drop, and let Proof fill the gaps.',
      position: 'right',
    },
    {
      target: '[data-tour="stock-link"]',
      title: 'Stock Management',
      description: 'Count stock faster with smart entry. Proof tracks theoretical vs actual usage and flags variances before they eat your GP.',
      position: 'right',
    },
    {
      target: '[data-tour="checklist-link"]',
      title: 'Daily Checklist',
      description: 'Opening and closing checks, incident logging, and compliance — all digitised. No more paper checklists lost behind the bar.',
      position: 'right',
    },
    {
      target: null,
      title: 'You\'re All Set!',
      description: 'Your venue is ready to run smarter. Head to The Pass for today\'s overview, or check Live Trading to see how service is going.',
      position: 'center',
    },
  ],
  [ROLES.EMPLOYEE]: [
    {
      target: null,
      title: 'Welcome to Proof',
      description: 'Everything you need for your shifts in one place. Let\'s take a quick look at what\'s available to you.',
      position: 'center',
    },
    {
      target: '[data-tour="sidebar"]',
      title: 'My Shifts',
      description: 'See your upcoming shifts, swap requests, and estimated earnings all in one calendar view.',
      position: 'right',
    },
    {
      target: '[data-tour="clock-link"]',
      title: 'Clock In / Out',
      description: 'Tap to clock in when you arrive. GPS and WiFi verification keeps everything accurate and fair.',
      position: 'right',
    },
    {
      target: '[data-tour="specials-link"]',
      title: 'Today\'s Specials',
      description: '86\'d items, cocktail of the day, and menu changes. Know what\'s on and what\'s off before guests ask.',
      position: 'right',
    },
    {
      target: null,
      title: 'You\'re All Set!',
      description: 'Check your shifts, clock in on time, and stay updated with specials. That\'s all you need to have a great service.',
      position: 'center',
    },
  ],
}

const STORAGE_KEY = 'proof_tour_completed'

function getTourCompleted(role) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return data[role] === true
  } catch { return false }
}

function setTourCompleted(role) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    data[role] = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

export function resetTour(role) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (role) {
      delete data[role]
    } else {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

export default function OnboardingTour({ role, forceShow = false, onComplete }) {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState(null)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const [arrowStyle, setArrowStyle] = useState({})
  const [arrowDirection, setArrowDirection] = useState('top')
  const tooltipRef = useRef(null)
  const animFrameRef = useRef(null)

  const steps = TOUR_STEPS[role] || []
  const currentStep = steps[step]
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  const roleColor = role === ROLES.OWNER ? C.amber : role === ROLES.GM ? C.teal : C.blue
  const roleBg = role === ROLES.OWNER ? C.amberBg : role === ROLES.GM ? C.tealBg : C.blueBg

  // Determine whether to show tour
  useEffect(() => {
    if (forceShow) {
      setActive(true)
      setStep(0)
      return
    }
    if (!getTourCompleted(role)) {
      // Small delay so the page renders first
      const t = setTimeout(() => {
        setActive(true)
        setStep(0)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [role, forceShow])

  // Position the tooltip relative to the highlighted element
  const positionTooltip = useCallback(() => {
    if (!currentStep || !active) return

    if (!currentStep.target || currentStep.position === 'center') {
      setHighlightRect(null)
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 440,
        width: '90vw',
      })
      setArrowStyle({ display: 'none' })
      return
    }

    const el = document.querySelector(currentStep.target)
    if (!el) {
      // Target not found — show centered
      setHighlightRect(null)
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 440,
        width: '90vw',
      })
      setArrowStyle({ display: 'none' })
      return
    }

    const rect = el.getBoundingClientRect()
    const pad = 8
    setHighlightRect({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
      borderRadius: 12,
    })

    // Calculate tooltip position
    const pos = currentStep.position || 'bottom'
    const tooltipW = 360
    const tooltipH = 220
    const gap = 16
    const vw = window.innerWidth
    const vh = window.innerHeight

    let style = { position: 'fixed', maxWidth: tooltipW, width: '90vw' }
    let aStyle = {}
    let aDir = 'top'

    if (pos === 'right') {
      const leftPos = rect.right + gap
      if (leftPos + tooltipW > vw) {
        // Fall back to bottom
        style.top = Math.min(rect.bottom + gap, vh - tooltipH - 20)
        style.left = Math.max(20, Math.min(rect.left, vw - tooltipW - 20))
        aDir = 'top'
        aStyle = { left: Math.min(40, rect.width / 2) }
      } else {
        style.left = leftPos
        style.top = Math.max(20, Math.min(rect.top, vh - tooltipH - 20))
        aDir = 'left'
        aStyle = { top: Math.min(30, rect.height / 2) }
      }
    } else if (pos === 'bottom') {
      style.top = Math.min(rect.bottom + gap, vh - tooltipH - 20)
      style.left = Math.max(20, Math.min(rect.left, vw - tooltipW - 20))
      aDir = 'top'
      aStyle = { left: Math.min(60, rect.width / 2) }
    } else if (pos === 'left') {
      style.right = vw - rect.left + gap
      style.top = Math.max(20, rect.top)
      aDir = 'right'
      aStyle = { top: 30 }
    } else if (pos === 'top') {
      style.bottom = vh - rect.top + gap
      style.left = Math.max(20, rect.left)
      aDir = 'bottom'
      aStyle = { left: 60 }
    }

    setTooltipStyle(style)
    setArrowStyle(aStyle)
    setArrowDirection(aDir)
  }, [currentStep, active, step])

  useEffect(() => {
    positionTooltip()
    window.addEventListener('resize', positionTooltip)
    window.addEventListener('scroll', positionTooltip, true)
    return () => {
      window.removeEventListener('resize', positionTooltip)
      window.removeEventListener('scroll', positionTooltip, true)
    }
  }, [positionTooltip])

  // Keyboard navigation
  useEffect(() => {
    if (!active) return
    function handleKey(e) {
      if (e.key === 'Escape') handleSkip()
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [active, step])

  const handleNext = () => {
    if (isLast) {
      handleFinish()
    } else {
      setStep(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) setStep(s => s - 1)
  }

  const handleSkip = () => {
    setTourCompleted(role)
    setActive(false)
    onComplete?.()
  }

  const handleFinish = () => {
    setTourCompleted(role)
    setActive(false)
    onComplete?.()
  }

  if (!active || !currentStep) return null

  const arrowSize = 10

  const arrowCSS = (() => {
    const base = {
      position: 'absolute',
      width: 0,
      height: 0,
      ...arrowStyle,
    }
    switch (arrowDirection) {
      case 'top':
        return {
          ...base,
          top: -arrowSize,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid ${C.card}`,
        }
      case 'bottom':
        return {
          ...base,
          bottom: -arrowSize,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${C.card}`,
        }
      case 'left':
        return {
          ...base,
          left: -arrowSize,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid ${C.card}`,
        }
      case 'right':
        return {
          ...base,
          right: -arrowSize,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid ${C.card}`,
        }
      default:
        return { ...base, display: 'none' }
    }
  })()

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
      {/* Overlay — uses clip-path to cut out highlighted area */}
      <div
        onClick={handleSkip}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          transition: 'clip-path 0.3s ease',
          ...(highlightRect ? {
            clipPath: `polygon(
              0% 0%, 100% 0%, 100% 100%, 0% 100%,
              0% ${highlightRect.top}px,
              ${highlightRect.left}px ${highlightRect.top}px,
              ${highlightRect.left}px ${highlightRect.top + highlightRect.height}px,
              0% ${highlightRect.top + highlightRect.height}px
            )`,
          } : {}),
        }}
      />

      {/* Highlighted area border glow */}
      {highlightRect && (
        <div style={{
          position: 'fixed',
          top: highlightRect.top,
          left: highlightRect.left,
          width: highlightRect.width,
          height: highlightRect.height,
          borderRadius: highlightRect.borderRadius,
          border: `2px solid ${roleColor}`,
          boxShadow: `0 0 20px ${roleColor}40, inset 0 0 20px ${roleColor}10`,
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          zIndex: 10001,
        }} />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          ...tooltipStyle,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 0,
          boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${roleColor}20`,
          zIndex: 10002,
          animation: 'tourFadeIn 0.3s ease',
        }}
      >
        {/* Arrow */}
        {arrowStyle.display !== 'none' && <div style={arrowCSS} />}

        {/* Top bar — step indicator + skip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px 0',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? roleColor : i < step ? `${roleColor}60` : C.border,
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
          <button
            onClick={handleSkip}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: C.textDim, display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, padding: '2px 4px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.textMuted}
            onMouseLeave={e => e.currentTarget.style.color = C.textDim}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 20px 12px' }}>
          {/* Icon for welcome / final steps */}
          {currentStep.position === 'center' && (
            <div style={{
              width: 48, height: 48, borderRadius: 12, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
              marginBottom: 16,
            }}>
              <Zap size={24} color="#000" />
            </div>
          )}
          <h3 style={{
            fontSize: 18, fontWeight: 700, color: C.ink, margin: '0 0 8px',
            letterSpacing: '-0.3px',
          }}>
            {currentStep.title}
          </h3>
          <p style={{
            fontSize: 13, lineHeight: 1.6, color: C.textMuted, margin: 0,
          }}>
            {currentStep.description}
          </p>
        </div>

        {/* Footer — navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 11, color: C.textDim }}>
            {step + 1} of {steps.length}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button
                onClick={handlePrev}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '7px 14px', borderRadius: 8,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.textMuted, fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = C.ink }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            {!isLast && (
              <button
                onClick={handleSkip}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.textDim, fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = C.textMuted }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim }}
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '7px 16px', borderRadius: 8,
                background: roleColor, border: 'none',
                color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {isLast ? 'Start Exploring' : 'Next'} {!isLast && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
