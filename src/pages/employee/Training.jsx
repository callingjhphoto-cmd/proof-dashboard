import { useState } from 'react'
import { GraduationCap, BookOpen, CheckCircle, Clock, Star, ChevronRight, AlertTriangle } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  orange: '#F97316', purple: '#A855F7',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const modules = [
  {
    id: 1, title: 'Classic Cocktail Specs', category: 'Cocktails', duration: '15 min',
    status: 'completed', completedDate: '12 Mar 2026', score: 92,
    description: 'Old Fashioned, Negroni, Margarita, Daiquiri, Whiskey Sour — exact specs and techniques.',
  },
  {
    id: 2, title: 'Espresso Martini Masterclass', category: 'Cocktails', duration: '10 min',
    status: 'completed', completedDate: '10 Mar 2026', score: 88,
    description: 'Our signature serve: double shot, shaken hard, three coffee beans. Oatly foam variation.',
  },
  {
    id: 3, title: 'Wine List 2026', category: 'Wine', duration: '20 min',
    status: 'in-progress', progress: 60,
    description: 'Full wine list with tasting notes, food pairings, and upsell recommendations.',
  },
  {
    id: 4, title: 'Allergen Awareness (Required)', category: 'Compliance', duration: '25 min',
    status: 'required',
    description: 'Legal requirement. 14 allergens, cross-contamination, how to handle customer queries.',
  },
  {
    id: 5, title: 'Premium Spirits Upselling', category: 'Sales', duration: '12 min',
    status: 'available',
    description: 'How to guide guests from well spirits to premium. Techniques that feel natural, not pushy.',
  },
  {
    id: 6, title: 'Spring Menu Launch', category: 'Menu', duration: '8 min',
    status: 'new',
    description: 'New spring cocktails, updated garnish specs, and seasonal specials.',
  },
]

const allergenUpdates = [
  { date: '15 Mar', item: 'Sakura Spritz', allergen: 'Sulphites', note: 'New menu item. Contains sulphites from prosecco.' },
  { date: '12 Mar', item: 'Mezcal Paloma (v2)', allergen: 'None', note: 'Updated recipe. No allergen changes.' },
]

const statusConfig = {
  completed: { color: C.green, bg: C.greenBg, icon: CheckCircle, label: 'Completed' },
  'in-progress': { color: C.blue, bg: C.blueBg, icon: Clock, label: 'In Progress' },
  required: { color: C.red, bg: C.redBg, icon: AlertTriangle, label: 'Required' },
  available: { color: C.textMuted, bg: 'transparent', icon: BookOpen, label: 'Available' },
  new: { color: C.amber, bg: C.amberBg, icon: Star, label: 'New' },
}

export default function Training() {
  const completed = modules.filter(m => m.status === 'completed').length
  const avgScore = Math.round(modules.filter(m => m.score).reduce((s, m) => s + m.score, 0) / modules.filter(m => m.score).length)

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Training
      </div>

      {/* Stats */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Completed</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.green }}>{completed}/{modules.length}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Avg Score</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.blue }}>{avgScore}%</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Required</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.red }}>{modules.filter(m => m.status === 'required').length}</div>
          <div style={{ fontSize: 11, color: C.red }}>Overdue</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>New</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.amber }}>{modules.filter(m => m.status === 'new').length}</div>
        </div>
      </div>

      {/* Modules */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Training Modules</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {modules.map(mod => {
            const sc = statusConfig[mod.status]
            const StatusIcon = sc.icon
            return (
              <div key={mod.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`,
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: sc.bg || C.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${sc.color}30`,
                  }}>
                    <StatusIcon size={18} color={sc.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{mod.title}</span>
                      <span style={{
                        padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                        color: sc.color, background: sc.bg, textTransform: 'uppercase',
                      }}>{sc.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{mod.description}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: C.textDim }}>
                      <span>{mod.category}</span>
                      <span>{mod.duration}</span>
                      {mod.score && <span style={{ color: C.green }}>Score: {mod.score}%</span>}
                      {mod.completedDate && <span>Completed {mod.completedDate}</span>}
                    </div>
                    {mod.progress && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ height: 4, background: '#1E1E21', borderRadius: 2, overflow: 'hidden', maxWidth: 200 }}>
                          <div style={{ height: '100%', width: `${mod.progress}%`, background: C.blue, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 10, color: C.blue, marginTop: 2 }}>{mod.progress}% complete</div>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} color={C.textDim} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Allergen Updates */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} color={C.orange} /> Recent Allergen Updates
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allergenUpdates.map((u, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{u.item}</span>
                <span style={{ fontSize: 11, color: u.allergen !== 'None' ? C.orange : C.green, fontWeight: 600 }}>{u.allergen}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textDim }}>{u.date} &mdash; {u.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
