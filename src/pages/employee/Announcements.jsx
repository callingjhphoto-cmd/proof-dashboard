import { Megaphone, Calendar, User, Pin } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  orange: '#F97316',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const announcements = [
  {
    id: 1, pinned: true,
    title: 'Spring Menu Launch \u2014 Wednesday 19 March',
    from: 'Sarah Mitchell (Bar Lead)',
    date: '17 Mar 2026',
    body: 'The new spring cocktail menu goes live on Wednesday. All bar staff MUST review the new specs before your first shift. Key changes: Sakura Spritz (new), Mezcal Paloma (updated recipe), Mulled Wine (removed). Training module is live \u2014 please complete it before Wednesday.',
    category: 'Menu',
  },
  {
    id: 2, pinned: true,
    title: 'Friday 21 March \u2014 142 Cover Booking',
    from: 'Lily Chen (Floor Manager)',
    date: '17 Mar 2026',
    body: 'We have a large corporate booking on Friday. All hands on deck. Please confirm your availability ASAP if you have not already. Shift times may extend by 30 minutes. Pre-batch Espresso Martinis and Negronis will be prepared from 12:00.',
    category: 'Operations',
  },
  {
    id: 3, pinned: false,
    title: 'New POS System Update',
    from: 'Lily Chen (Floor Manager)',
    date: '15 Mar 2026',
    body: 'The POS system has been updated to v3.2. Key changes: faster card processing, new split bill feature, and updated tip prompt (now shows 10%, 12.5%, 15%). If you encounter any issues, report to the manager on shift.',
    category: 'Systems',
  },
  {
    id: 4, pinned: false,
    title: 'Staff Social \u2014 Monday 24 March',
    from: 'Sarah Mitchell (Bar Lead)',
    date: '14 Mar 2026',
    body: 'Team drinks at The Dove, Hammersmith after close on Monday 24th. Everyone welcome. First round on the house (within reason).',
    category: 'Social',
  },
  {
    id: 5, pinned: false,
    title: 'Holiday Request Deadline: Easter',
    from: 'Lily Chen (Floor Manager)',
    date: '10 Mar 2026',
    body: 'All Easter holiday requests must be submitted by Friday 21 March. Easter weekend (18-21 April) is blackout for new requests \u2014 all staff are expected to be available unless already approved.',
    category: 'HR',
  },
]

const categoryColors = {
  Menu: C.amber,
  Operations: C.blue,
  Systems: C.green,
  Social: '#A855F7',
  HR: C.orange,
}

export default function Announcements() {
  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Team Announcements
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {announcements.map(a => {
          const catColor = categoryColors[a.category] || C.textMuted
          return (
            <div key={a.id} style={{
              background: a.pinned ? `${catColor}08` : C.card,
              border: `1px solid ${a.pinned ? catColor + '40' : C.border}`,
              borderRadius: 14, padding: 20,
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {a.pinned && <Pin size={14} color={catColor} />}
                  <span style={{
                    padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    color: catColor, background: catColor + '15', textTransform: 'uppercase',
                  }}>{a.category}</span>
                </div>
                <span style={{ fontSize: 11, color: C.textDim }}>{a.date}</span>
              </div>

              {/* Title */}
              <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{a.title}</div>

              {/* From */}
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={10} /> {a.from}
              </div>

              {/* Body */}
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{a.body}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
