import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, Users, Plus, X, ChevronLeft, ChevronRight, Search,
  UserCheck, UserX, Gift, Wine, Phone, Mail, AlertTriangle, CheckCircle,
  PieChart as PieIcon, Eye
} from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberLight: '#E8C878', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const TABLES = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'Bar 1', 'Bar 2', 'Terrace 1', 'Terrace 2']
const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Date Night', 'Business', 'Celebration', 'Engagement', 'Hen/Stag']

// 20 realistic sample bookings
const SAMPLE_BOOKINGS = [
  { id: 1, name: 'James Henderson', party: 12, date: '2026-03-26', time: '19:30', table: 'T6', occasion: 'Birthday', notes: 'Birthday cake at 21:00. Daughter is coeliac — gluten-free options needed.', phone: '07700 900123', email: 'j.henderson@gmail.com', returning: true, visits: 8, preOrders: ['Champagne x2', 'Espresso Martini x4'], status: 'confirmed', noShowRisk: 'low' },
  { id: 2, name: 'Deloitte Corporate', party: 8, date: '2026-03-26', time: '12:30', table: 'T10', occasion: 'Business', notes: 'Client lunch. Need privacy. Bill to Deloitte account.', phone: '020 7936 3000', email: 'events@deloitte.co.uk', returning: true, visits: 14, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 3, name: 'Sophie Clark', party: 2, date: '2026-03-26', time: '19:00', table: 'T3', occasion: 'Anniversary', notes: 'Window seat preferred. Planning to propose!', phone: '07700 900456', email: 'sophie.c@outlook.com', returning: true, visits: 5, preOrders: ['Dom Perignon x1'], status: 'confirmed', noShowRisk: 'low' },
  { id: 4, name: 'Marcus Williams', party: 4, date: '2026-03-26', time: '20:00', table: 'T7', occasion: 'None', notes: '', phone: '07700 900789', email: '', returning: false, visits: 0, preOrders: [], status: 'confirmed', noShowRisk: 'medium' },
  { id: 5, name: 'Elena Petrov', party: 6, date: '2026-03-26', time: '18:30', table: 'T11', occasion: 'Celebration', notes: 'Just got promoted! Would love cocktail recommendations.', phone: '07700 900321', email: 'elena.p@proton.me', returning: true, visits: 3, preOrders: ['Negroni x2', 'Aperol Spritz x4'], status: 'confirmed', noShowRisk: 'low' },
  { id: 6, name: 'Tom & Kate Baker', party: 2, date: '2026-03-26', time: '19:30', table: 'T2', occasion: 'Date Night', notes: 'Regular couple. Usual table if possible.', phone: '07700 900654', email: 'tombaker@gmail.com', returning: true, visits: 22, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 7, name: 'Dr. Aisha Khan', party: 3, date: '2026-03-26', time: '13:00', table: 'T4', occasion: 'None', notes: 'One child (age 4). High chair needed.', phone: '07700 900987', email: 'aisha.khan@nhs.net', returning: true, visits: 6, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 8, name: 'Oliver Chen', party: 2, date: '2026-03-26', time: '20:30', table: 'Bar 1', occasion: 'None', notes: 'Bar seats preferred. Cocktail enthusiast.', phone: '07700 900111', email: 'oliver.c@gmail.com', returning: true, visits: 11, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 9, name: 'Rachel Green', party: 4, date: '2026-03-26', time: '18:00', table: 'T5', occasion: 'None', notes: 'One vegetarian, one vegan.', phone: '07700 900222', email: '', returning: false, visits: 0, preOrders: [], status: 'confirmed', noShowRisk: 'high' },
  { id: 10, name: 'No Name Given', party: 2, date: '2026-03-26', time: '21:00', table: 'T1', occasion: 'None', notes: 'Phone booking, no name left. Mobile only.', phone: '07700 900333', email: '', returning: false, visits: 0, preOrders: [], status: 'unconfirmed', noShowRisk: 'high' },
  { id: 11, name: 'Sarah & David Wright', party: 5, date: '2026-03-27', time: '19:00', table: 'T8', occasion: 'Birthday', notes: 'David turning 40. Surprise — Sarah booking.', phone: '07700 900444', email: 'sarahwright@yahoo.co.uk', returning: true, visits: 4, preOrders: ['Old Fashioned x3'], status: 'confirmed', noShowRisk: 'low' },
  { id: 12, name: 'Natasha Romanoff', party: 2, date: '2026-03-27', time: '20:00', table: 'T3', occasion: 'Date Night', notes: '', phone: '07700 900555', email: 'natasha.r@gmail.com', returning: false, visits: 0, preOrders: [], status: 'confirmed', noShowRisk: 'medium' },
  { id: 13, name: 'The Patel Family', party: 7, date: '2026-03-27', time: '12:00', table: 'T12', occasion: 'Celebration', notes: 'Son graduated from Imperial. Want to order champagne on arrival.', phone: '07700 900666', email: 'rpatel@hotmail.com', returning: true, visits: 9, preOrders: ['Veuve Clicquot x2'], status: 'confirmed', noShowRisk: 'low' },
  { id: 14, name: 'Mike Johnson', party: 2, date: '2026-03-27', time: '19:30', table: 'T2', occasion: 'None', notes: '', phone: '07700 900777', email: '', returning: false, visits: 0, preOrders: [], status: 'unconfirmed', noShowRisk: 'high' },
  { id: 15, name: 'Lisa & Co', party: 6, date: '2026-03-28', time: '19:00', table: 'T9', occasion: 'Hen/Stag', notes: 'Hen party. Cocktail masterclass interest. Loud and proud.', phone: '07700 900888', email: 'lisa.hen2026@gmail.com', returning: false, visits: 0, preOrders: ['Pornstar Martini x6'], status: 'confirmed', noShowRisk: 'low' },
  { id: 16, name: 'Charles Worthington', party: 4, date: '2026-03-28', time: '13:00', table: 'T6', occasion: 'Business', notes: 'Hosting investors. Discreet, premium service.', phone: '07700 900999', email: 'c.worthington@vc.com', returning: true, visits: 17, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 17, name: 'Emma & Friends', party: 3, date: '2026-03-28', time: '18:30', table: 'Terrace 1', occasion: 'None', notes: 'Prefer outdoor if weather is nice.', phone: '07700 901000', email: 'emma.jones@icloud.com', returning: true, visits: 2, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 18, name: 'Jordan Lee', party: 2, date: '2026-03-29', time: '20:00', table: 'Bar 2', occasion: 'None', notes: 'Wants to try the new spring cocktail menu.', phone: '07700 901111', email: 'jordanlee@gmail.com', returning: true, visits: 7, preOrders: [], status: 'confirmed', noShowRisk: 'low' },
  { id: 19, name: 'Anniversary Dinner — Anonymous', party: 2, date: '2026-03-29', time: '19:30', table: 'T3', occasion: 'Anniversary', notes: 'Ring hidden with maitre d. Deliver with dessert.', phone: '07700 901222', email: '', returning: false, visits: 0, preOrders: ['Champagne on arrival'], status: 'confirmed', noShowRisk: 'low' },
  { id: 20, name: 'Walk-in Waitlist', party: 2, date: '2026-03-26', time: '19:45', table: '', occasion: 'None', notes: 'Added to waitlist at door. ~20 min wait.', phone: '', email: '', returning: false, visits: 0, preOrders: [], status: 'waitlist', noShowRisk: 'low' },
]

const statusColors = { confirmed: C.green, unconfirmed: C.orange, waitlist: C.blue, cancelled: C.red, 'no-show': C.red }
const riskColors = { low: C.green, medium: C.orange, high: C.red }

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getWeekDates(baseDate) {
  const d = new Date(baseDate)
  const dayOfWeek = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    days.push(day.toISOString().split('T')[0])
  }
  return days
}

export default function Bookings() {
  const navigate = useNavigate()
  const [view, setView] = useState('week')
  const [baseDate, setBaseDate] = useState('2026-03-26')
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS)
  const [showForm, setShowForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newBooking, setNewBooking] = useState({
    name: '', party: 2, date: '2026-03-26', time: '19:00', table: '', occasion: 'None', notes: '', phone: '', email: '', preOrders: '',
  })

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate])
  const todayStr = '2026-03-26'

  const todayBookings = useMemo(() =>
    bookings.filter(b => b.date === todayStr).sort((a, b) => a.time.localeCompare(b.time)),
    [bookings]
  )

  const totalCoversToday = todayBookings.reduce((s, b) => s + b.party, 0)
  const walkIns = todayBookings.filter(b => b.status === 'waitlist').length
  const bookedCount = todayBookings.filter(b => b.status !== 'waitlist').length

  // KPIs
  const totalBookingsThisWeek = bookings.filter(b => weekDates.includes(b.date)).length
  const totalCoversThisWeek = bookings.filter(b => weekDates.includes(b.date)).reduce((s, b) => s + b.party, 0)
  const noShowRate = 4.2 // historical
  const avgPartySize = totalCoversThisWeek > 0 ? (totalCoversThisWeek / totalBookingsThisWeek).toFixed(1) : 0

  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings
    const term = searchTerm.toLowerCase()
    return bookings.filter(b => b.name.toLowerCase().includes(term) || b.phone.includes(term) || b.email.toLowerCase().includes(term))
  }, [bookings, searchTerm])

  function handleCreateBooking() {
    const newId = Math.max(...bookings.map(b => b.id)) + 1
    const created = {
      ...newBooking,
      id: newId,
      returning: false,
      visits: 0,
      preOrders: newBooking.preOrders ? newBooking.preOrders.split(',').map(s => s.trim()) : [],
      status: 'confirmed',
      noShowRisk: 'medium',
    }
    setBookings(prev => [...prev, created])
    setShowForm(false)
    setNewBooking({ name: '', party: 2, date: '2026-03-26', time: '19:00', table: '', occasion: 'None', notes: '', phone: '', email: '', preOrders: '' })
  }

  function shiftWeek(dir) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + dir * 7)
    setBaseDate(d.toISOString().split('T')[0])
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={22} color={C.amber} /> Bookings
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>Manage reservations, walk-ins, and pre-orders</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8,
          background: `linear-gradient(135deg, ${C.amber}, #A67C2E)`, border: 'none',
          color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* KPIs */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        {[
          { icon: Calendar, label: 'Today\'s Bookings', value: bookedCount, sub: `${totalCoversToday} covers` },
          { icon: UserCheck, label: 'Walk-in Ratio', value: `${walkIns > 0 ? Math.round((walkIns / (bookedCount + walkIns)) * 100) : 0}%`, sub: `${walkIns} walk-ins today` },
          { icon: UserX, label: 'No-Show Rate', value: `${noShowRate}%`, sub: 'Last 30 days', color: noShowRate > 5 ? C.red : C.green },
          { icon: Users, label: 'Avg Party Size', value: avgPartySize, sub: 'This week' },
        ].map((k, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <k.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color || C.ink, marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2col-sidebar">
        {/* Calendar / Main area */}
        <div>
          {/* View toggle + navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['week', 'month'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '6px 16px', borderRadius: 6, border: `1px solid ${view === v ? C.amber : C.border}`,
                  background: view === v ? C.amberBg : 'transparent', color: view === v ? C.amber : C.textMuted,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
                }}>{v}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => shiftWeek(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}><ChevronLeft size={18} /></button>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                {formatDate(weekDates[0])} — {formatDate(weekDates[6])}
              </span>
              <button onClick={() => shiftWeek(1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Week view */}
          {view === 'week' && (
            <div className="grid-7day">
              {weekDates.map(date => {
                const dayBookings = filteredBookings.filter(b => b.date === date)
                const isToday = date === todayStr
                const d = new Date(date + 'T00:00:00')
                return (
                  <div key={date} style={{
                    background: C.card, border: `1px solid ${isToday ? C.amber + '40' : C.border}`,
                    borderRadius: 10, padding: 10, minHeight: 180,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: isToday ? C.amber : C.textDim, textTransform: 'uppercase', marginBottom: 4 }}>
                      {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? C.amber : C.ink, marginBottom: 8 }}>
                      {d.getDate()}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6 }}>{dayBookings.length} bookings</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {dayBookings.slice(0, 4).map(b => (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBooking(b)}
                          style={{
                            padding: '4px 6px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
                            background: b.status === 'confirmed' ? C.greenBg : b.status === 'waitlist' ? C.blueBg : C.orangeBg,
                            color: statusColors[b.status],
                            borderLeft: `2px solid ${statusColors[b.status]}`,
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{b.time} — {b.name.substring(0, 12)}{b.name.length > 12 ? '...' : ''}</div>
                          <div style={{ color: C.textDim }}>{b.party}pax {b.table && `• ${b.table}`}</div>
                        </div>
                      ))}
                      {dayBookings.length > 4 && (
                        <div style={{ fontSize: 10, color: C.textDim, textAlign: 'center' }}>+{dayBookings.length - 4} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Month view */}
          {view === 'month' && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>March 2026</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} style={{ fontSize: 10, fontWeight: 600, color: C.textDim, textAlign: 'center', padding: 4 }}>{d}</div>
                ))}
                {/* March 2026 starts on Sunday, so 6 empty cells (Mon-Sat) */}
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={`empty-${i}`} style={{ padding: 8 }} />
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1
                  const dateStr = `2026-03-${String(day).padStart(2, '0')}`
                  const count = bookings.filter(b => b.date === dateStr).length
                  const isToday = dateStr === todayStr
                  return (
                    <div key={day} onClick={() => setBaseDate(dateStr)} style={{
                      padding: 8, borderRadius: 6, textAlign: 'center', cursor: 'pointer',
                      background: isToday ? C.amberBg : 'transparent',
                      border: `1px solid ${isToday ? C.amber + '40' : 'transparent'}`,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? C.amber : C.ink }}>{day}</div>
                      {count > 0 && <div style={{ fontSize: 9, color: C.amber, marginTop: 2 }}>{count} bkgs</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ marginTop: 16, position: 'relative' }}>
            <Search size={14} color={C.textDim} style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search bookings by name, phone, or email..."
              style={{
                width: '100%', padding: '10px 12px 10px 34px', borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.card, color: C.text, fontSize: 13, outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Today's Bookings Sidebar */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Today's Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {todayBookings.map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                  background: selectedBooking?.id === b.id ? C.amberBg : C.bg,
                  border: `1px solid ${selectedBooking?.id === b.id ? C.amber + '30' : C.border}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} color={C.textDim} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.amber }}>{b.time}</span>
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: statusColors[b.status] + '15', color: statusColors[b.status],
                    textTransform: 'uppercase',
                  }}>{b.status}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 4 }}>{b.name}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{b.party} guests</span>
                  {b.table && <span style={{ fontSize: 11, color: C.textDim }}>{b.table}</span>}
                  {b.occasion !== 'None' && (
                    <span style={{ fontSize: 10, color: C.amber, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Gift size={10} /> {b.occasion}
                    </span>
                  )}
                </div>
                {b.returning && (
                  <div style={{ fontSize: 10, color: C.green, marginTop: 3 }}>
                    Returning guest — {b.visits} previous visits
                  </div>
                )}
                {b.preOrders.length > 0 && (
                  <div style={{ fontSize: 10, color: C.teal, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Wine size={10} /> Pre-order: {b.preOrders.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Booking Detail */}
      {selectedBooking && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: 420, height: '100vh', background: C.card,
          borderLeft: `1px solid ${C.border}`, zIndex: 300, padding: 24, overflowY: 'auto',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>Booking Details</h2>
            <button onClick={() => setSelectedBooking(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted }}><X size={18} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{selectedBooking.name}</div>
              <div style={{
                display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 4,
                background: statusColors[selectedBooking.status] + '15', color: statusColors[selectedBooking.status],
                textTransform: 'uppercase',
              }}>{selectedBooking.status}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Date', value: formatDate(selectedBooking.date) },
                { label: 'Time', value: selectedBooking.time },
                { label: 'Party Size', value: `${selectedBooking.party} guests` },
                { label: 'Table', value: selectedBooking.table || 'Unassigned' },
                { label: 'Occasion', value: selectedBooking.occasion },
                { label: 'No-Show Risk', value: selectedBooking.noShowRisk, color: riskColors[selectedBooking.noShowRisk] },
              ].map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: f.color || C.ink }}>{f.value}</div>
                </div>
              ))}
            </div>

            {selectedBooking.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.text }}>
                <Phone size={14} color={C.textMuted} /> {selectedBooking.phone}
              </div>
            )}
            {selectedBooking.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.text }}>
                <Mail size={14} color={C.textMuted} /> {selectedBooking.email}
              </div>
            )}

            {selectedBooking.returning && (
              <div style={{ background: C.greenBg, border: `1px solid ${C.green}25`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 4 }}>Returning Guest</div>
                <div style={{ fontSize: 12, color: C.text }}>{selectedBooking.visits} previous visits</div>
              </div>
            )}

            {selectedBooking.preOrders.length > 0 && (
              <div style={{ background: C.amberBg, border: `1px solid ${C.amber}25`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.amber, marginBottom: 6 }}>Pre-Orders</div>
                {selectedBooking.preOrders.map((p, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.text, display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <Wine size={12} color={C.amber} /> {p}
                  </div>
                ))}
              </div>
            )}

            {selectedBooking.notes && (
              <div>
                <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Notes</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, background: C.bg, borderRadius: 8, padding: 12 }}>
                  {selectedBooking.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>New Booking</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Guest Name', key: 'name', type: 'text', placeholder: 'Full name' },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '07...' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input
                    type={f.type} value={newBooking[f.key]} placeholder={f.placeholder}
                    onChange={e => setNewBooking(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                  />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Party Size</label>
                  <input
                    type="number" min={1} max={30} value={newBooking.party}
                    onChange={e => setNewBooking(p => ({ ...p, party: parseInt(e.target.value) || 1 }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Date</label>
                  <input
                    type="date" value={newBooking.date}
                    onChange={e => setNewBooking(p => ({ ...p, date: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Time</label>
                  <input
                    type="time" value={newBooking.time}
                    onChange={e => setNewBooking(p => ({ ...p, time: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Table</label>
                  <select
                    value={newBooking.table}
                    onChange={e => setNewBooking(p => ({ ...p, table: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                  >
                    <option value="">Auto-assign</option>
                    {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Occasion</label>
                  <select
                    value={newBooking.occasion}
                    onChange={e => setNewBooking(p => ({ ...p, occasion: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                  >
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Pre-Orders (comma separated)</label>
                <input
                  value={newBooking.preOrders} placeholder="e.g. Champagne x1, Negroni x2"
                  onChange={e => setNewBooking(p => ({ ...p, preOrders: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Notes</label>
                <textarea
                  value={newBooking.notes} placeholder="Dietary requirements, seating preferences..."
                  onChange={e => setNewBooking(p => ({ ...p, notes: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, outline: 'none', minHeight: 80, resize: 'vertical' }}
                />
              </div>

              <button
                onClick={handleCreateBooking}
                disabled={!newBooking.name}
                style={{
                  width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                  background: newBooking.name ? `linear-gradient(135deg, ${C.amber}, #A67C2E)` : C.border,
                  color: newBooking.name ? '#000' : C.textDim, fontSize: 14, fontWeight: 600, cursor: newBooking.name ? 'pointer' : 'not-allowed',
                }}
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
