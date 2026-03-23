import { useState } from 'react'
import { ArrowLeftRight, Check, X, Clock, User } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const myUpcoming = [
  { id: 1, day: 'Thu 20 Mar', shift: '16:00-23:00', hours: 7 },
  { id: 2, day: 'Fri 21 Mar', shift: '14:00-23:00', hours: 9 },
  { id: 3, day: 'Sat 22 Mar', shift: '14:00-23:00', hours: 9 },
  { id: 4, day: 'Sun 23 Mar', shift: '16:00-23:00', hours: 7 },
]

const availableStaff = [
  { name: 'Ben H.', role: 'Bartender', availableDays: ['Thu 20 Mar', 'Sun 23 Mar'] },
  { name: 'Priya P.', role: 'Server', availableDays: ['Thu 20 Mar', 'Fri 21 Mar'] },
  { name: 'Anya K.', role: 'Server', availableDays: ['Sat 22 Mar', 'Sun 23 Mar'] },
]

const swapHistory = [
  { date: 'Mon 10 Mar', original: '16:00-23:00', swappedWith: 'Ben H.', status: 'approved', approvedBy: 'Lily C.' },
  { date: 'Sat 1 Mar', original: '14:00-23:00', swappedWith: 'Priya P.', status: 'approved', approvedBy: 'Sarah M.' },
  { date: 'Thu 20 Feb', original: '16:00-23:00', swappedWith: 'Tom R.', status: 'declined', approvedBy: null },
]

const statusConfig = {
  approved: { color: C.green, bg: C.greenBg },
  pending: { color: C.amber, bg: C.amberBg },
  declined: { color: C.red, bg: C.redBg },
}

export default function ShiftSwap() {
  const [selectedShift, setSelectedShift] = useState(null)
  const [requestSent, setRequestSent] = useState(new Set())

  const sendRequest = (shiftId, staffName) => {
    setRequestSent(prev => new Set(prev).add(`${shiftId}-${staffName}`))
  }

  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Shift Swap
      </div>

      {/* Select shift to swap */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Select a shift to swap</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {myUpcoming.map(shift => {
            const isSelected = selectedShift === shift.id
            return (
              <div
                key={shift.id}
                onClick={() => setSelectedShift(isSelected ? null : shift.id)}
                style={{
                  padding: 14, borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                  background: isSelected ? C.blueBg : C.bg,
                  border: `1px solid ${isSelected ? C.blue : C.border}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? C.blue : C.ink }}>{shift.day}</div>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 6,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{shift.shift}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{shift.hours} hours</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Available staff */}
      {selectedShift && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>
            Available to cover {myUpcoming.find(s => s.id === selectedShift)?.day}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {availableStaff
              .filter(s => s.availableDays.includes(myUpcoming.find(sh => sh.id === selectedShift)?.day))
              .map((staff, i) => {
                const key = `${selectedShift}-${staff.name}`
                const sent = requestSent.has(key)
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: C.blue + '20',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: C.blue,
                      }}>{staff.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{staff.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{staff.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => sendRequest(selectedShift, staff.name)}
                      disabled={sent}
                      style={{
                        padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: sent ? 'default' : 'pointer',
                        background: sent ? C.greenBg : C.blue, border: `1px solid ${sent ? C.green : C.blue}`,
                        color: sent ? C.green : '#fff', display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      {sent ? <><Check size={14} /> Requested</> : <><ArrowLeftRight size={14} /> Request Swap</>}
                    </button>
                  </div>
                )
              })}
            {availableStaff.filter(s => s.availableDays.includes(myUpcoming.find(sh => sh.id === selectedShift)?.day)).length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', color: C.textDim, fontSize: 13 }}>
                No staff available for this day. Try requesting cover from your manager.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Swap History */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Swap History</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {swapHistory.map((swap, i) => {
            const sc = statusConfig[swap.status]
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{swap.date} &mdash; {swap.original}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                    Swapped with {swap.swappedWith}
                    {swap.approvedBy && ` \u2022 Approved by ${swap.approvedBy}`}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  color: sc.color, background: sc.bg, textTransform: 'capitalize',
                }}>{swap.status}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
