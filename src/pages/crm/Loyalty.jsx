import { useState } from 'react'
import { Award, Trophy, Settings, Gift, TrendingUp, Users, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { CUSTOMERS, LOYALTY_SETTINGS } from '../../data/customers'

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

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} color={color || C.textMuted} />
        <span style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function Loyalty() {
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({ ...LOYALTY_SETTINGS })

  // Loyalty calculations
  const totalRewards = CUSTOMERS.reduce((s, c) => s + c.rewardsRedeemed, 0)
  const customersWithProgress = CUSTOMERS.filter(c => c.loyaltyVisits > 0).length
  const closeToReward = CUSTOMERS.filter(c => c.loyaltyVisits >= 7).length

  // Leaderboard — top customers by total visits this month
  // (using totalVisits as proxy since we have demo data)
  const leaderboard = [...CUSTOMERS]
    .filter(c => c.lastVisit >= '2026-03-01')
    .sort((a, b) => b.totalVisits - a.totalVisits)
    .slice(0, 15)

  // Customer loyalty status list
  const loyaltyList = [...CUSTOMERS]
    .sort((a, b) => b.loyaltyVisits - a.loyaltyVisits || b.totalVisits - a.totalVisits)

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Loyalty Programme</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Visit-based rewards — every {settings.rewardThreshold}th visit earns a reward</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8,
          background: showSettings ? C.amberBg : 'transparent', border: `1px solid ${showSettings ? C.amber + '40' : C.border}`,
          color: showSettings ? C.amber : C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          <Settings size={16} /> Programme Settings
        </button>
      </div>

      {/* Stats */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <StatCard icon={Award} label="Total Rewards Redeemed" value={totalRewards} color={C.amber} />
        <StatCard icon={Users} label="Active in Programme" value={customersWithProgress} color={C.green} sub={`of ${CUSTOMERS.length} customers`} />
        <StatCard icon={Gift} label="Close to Reward" value={closeToReward} color={C.orange} sub="7+ visits toward next reward" />
        <StatCard icon={TrendingUp} label="Reward Threshold" value={`${settings.rewardThreshold} visits`} color={C.blue} />
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{
          background: C.card, border: `1px solid ${C.amber}30`, borderRadius: 12, padding: 24, marginBottom: 20,
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Programme Settings</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Reward Threshold</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="number" value={settings.rewardThreshold}
                  onChange={e => setSettings({ ...settings, rewardThreshold: parseInt(e.target.value) || 10 })}
                  style={{
                    width: 80, padding: '10px 14px', borderRadius: 8, background: C.bg,
                    border: `1px solid ${C.border}`, color: C.ink, fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
                    outline: 'none', textAlign: 'center',
                  }} />
                <span style={{ fontSize: 13, color: C.textMuted }}>visits</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Reward Type</label>
              <input type="text" value={settings.rewardType}
                onChange={e => setSettings({ ...settings, rewardType: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, background: C.bg,
                  border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
                }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Expiry</label>
              <input type="text" value={settings.expiry}
                onChange={e => setSettings({ ...settings, expiry: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, background: C.bg,
                  border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
                }} />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 20, borderRadius: 10, cursor: 'pointer', position: 'relative',
              background: settings.active ? C.green : C.border, transition: 'background 0.2s',
            }} onClick={() => setSettings({ ...settings, active: !settings.active })}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute',
                top: 2, left: settings.active ? 18 : 2, transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ fontSize: 13, color: settings.active ? C.green : C.textMuted }}>
              Programme {settings.active ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
      )}

      <div className="grid-2col-sidebar">
        {/* Leaderboard */}
        <div>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Trophy size={18} color={C.amber} />
              <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>Loyalty Leaderboard — March 2026</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {leaderboard.map((c, i) => {
                const seg = segmentConfig[c.segment]
                const medal = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : null
                return (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderBottom: `1px solid ${C.border}`,
                    background: i < 3 ? `${C.amber}08` : 'transparent',
                  }}>
                    {/* Rank */}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      background: medal ? medal : C.bg,
                      color: medal ? '#000' : C.textDim,
                      border: medal ? 'none' : `1px solid ${C.border}`,
                    }}>
                      {i + 1}
                    </div>
                    {/* Name */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: seg.color }}>{seg.label}</div>
                    </div>
                    {/* Visits */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{c.totalVisits}</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>visits</div>
                    </div>
                    {/* Rewards */}
                    <div style={{ textAlign: 'right', minWidth: 50 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                        <Award size={12} color={C.amber} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.amber, fontFamily: "'JetBrains Mono', monospace" }}>{c.rewardsRedeemed}</span>
                      </div>
                      <div style={{ fontSize: 10, color: C.textDim }}>rewards</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Customer Loyalty Status */}
        <div>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Star size={18} color={C.amber} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Progress Tracker</span>
            </div>
            <div style={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loyaltyList.filter(c => c.loyaltyVisits > 0).slice(0, 20).map(c => {
                const pct = (c.loyaltyVisits / settings.rewardThreshold) * 100
                const nearReward = c.loyaltyVisits >= 7
                return (
                  <div key={c.id} style={{
                    padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{c.name}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: nearReward ? C.green : C.textMuted,
                      }}>{c.loyaltyVisits}/{settings.rewardThreshold}</span>
                    </div>
                    <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3, width: `${Math.min(pct, 100)}%`,
                        background: nearReward ? `linear-gradient(90deg, ${C.amber}, ${C.green})` : C.amber,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    {nearReward && (
                      <div style={{ fontSize: 10, color: C.green, marginTop: 4 }}>
                        {settings.rewardThreshold - c.loyaltyVisits} visit{settings.rewardThreshold - c.loyaltyVisits !== 1 ? 's' : ''} away from reward!
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
