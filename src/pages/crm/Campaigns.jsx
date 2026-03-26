import { useState } from 'react'
import { Send, Clock, FileText, PenTool, ChevronDown, ChevronUp, Mail, MessageSquare, Users, BarChart3, Target, Plus, Eye } from 'lucide-react'
import { CAMPAIGNS, TEMPLATES, CUSTOMERS, SEGMENTS } from '../../data/customers'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const statusConfig = {
  sent: { label: 'Sent', color: C.green, bg: C.greenBg, icon: Send },
  scheduled: { label: 'Scheduled', color: C.blue, bg: C.blueBg, icon: Clock },
  draft: { label: 'Draft', color: C.orange, bg: C.orangeBg, icon: FileText },
}

const segmentConfig = {
  regular: { label: 'Regular', color: C.green },
  high_spender: { label: 'High Spender', color: C.amber },
  lapsed: { label: 'Lapsed', color: C.red },
  new: { label: 'New', color: C.blue },
  all: { label: 'All Customers', color: C.textMuted },
  normal: { label: 'Normal', color: C.textMuted },
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} color={color || C.textMuted} />
        <span style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink }}>{value}</div>
    </div>
  )
}

export default function Campaigns() {
  const [expandedCampaign, setExpandedCampaign] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', segment: 'regular', channel: 'email', message: '' })
  const [showTemplates, setShowTemplates] = useState(false)

  const totalSent = CAMPAIGNS.filter(c => c.status === 'sent').reduce((s, c) => s + c.sent, 0)
  const totalOpened = CAMPAIGNS.filter(c => c.status === 'sent').reduce((s, c) => s + c.opened, 0)
  const totalRedeemed = CAMPAIGNS.filter(c => c.status === 'sent').reduce((s, c) => s + c.redeemed, 0)
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Campaigns</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Create and manage customer engagement campaigns</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8,
          background: showCreate ? C.card : C.amber, border: showCreate ? `1px solid ${C.border}` : 'none',
          color: showCreate ? C.textMuted : '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}>
          <Plus size={16} /> {showCreate ? 'Cancel' : 'New Campaign'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-kpi-4" style={{ marginBottom: 20 }}>
        <StatCard icon={Send} label="Total Campaigns" value={CAMPAIGNS.length} color={C.amber} />
        <StatCard icon={Users} label="Messages Sent" value={totalSent} color={C.blue} />
        <StatCard icon={Eye} label="Avg Open Rate" value={`${avgOpenRate}%`} color={C.green} />
        <StatCard icon={Target} label="Redemptions" value={totalRedeemed} color={C.amber} />
      </div>

      {/* Create Campaign */}
      {showCreate && (
        <div style={{
          background: C.card, border: `1px solid ${C.amber}30`, borderRadius: 12, padding: 24, marginBottom: 20,
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Create Campaign</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Campaign Name</label>
              <input
                type="text" placeholder="e.g. Spring Welcome Back"
                value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, background: C.bg,
                  border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Target Segment</label>
              <select value={createForm.segment} onChange={e => setCreateForm({ ...createForm, segment: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, background: C.bg,
                  border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
                }}>
                <option value="regular">Regular ({CUSTOMERS.filter(c => c.segment === 'regular').length})</option>
                <option value="high_spender">High Spender ({CUSTOMERS.filter(c => c.segment === 'high_spender').length})</option>
                <option value="lapsed">Lapsed ({CUSTOMERS.filter(c => c.segment === 'lapsed').length})</option>
                <option value="new">New ({CUSTOMERS.filter(c => c.segment === 'new').length})</option>
                <option value="normal">Normal ({CUSTOMERS.filter(c => c.segment === 'normal').length})</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Channel</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['email', 'sms'].map(ch => (
                  <button key={ch} onClick={() => setCreateForm({ ...createForm, channel: ch })} style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                    border: `1px solid ${createForm.channel === ch ? C.amber + '60' : C.border}`,
                    background: createForm.channel === ch ? C.amberBg : 'transparent',
                    color: createForm.channel === ch ? C.amber : C.textMuted, fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {ch === 'email' ? <Mail size={12} /> : <MessageSquare size={12} />} {ch.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</label>
              <button onClick={() => setShowTemplates(!showTemplates)} style={{
                fontSize: 11, color: C.amber, background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', textDecoration: 'underline',
              }}>Use Template</button>
            </div>
            <textarea
              placeholder="Write your message..."
              value={createForm.message} onChange={e => setCreateForm({ ...createForm, message: e.target.value })}
              rows={4}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, background: C.bg,
                border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontFamily: 'Inter, sans-serif',
                outline: 'none', resize: 'vertical',
              }}
            />
          </div>

          {/* Templates */}
          {showTemplates && (
            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Templates</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TEMPLATES.map(t => (
                  <div key={t.id} onClick={() => { setCreateForm({ ...createForm, message: t.message }); setShowTemplates(false) }}
                    style={{
                      padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.amber + '60'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>{t.message}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: C.textDim }}>For: {segmentConfig[t.targetSegment]?.label || t.targetSegment}</span>
                      <span style={{ fontSize: 10, color: C.textDim }}>Channel: {t.channel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '10px 20px', borderRadius: 8, background: C.amber, border: 'none',
              color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Send size={14} /> Send Now
            </button>
            <button style={{
              padding: '10px 20px', borderRadius: 8, background: 'transparent', border: `1px solid ${C.border}`,
              color: C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Clock size={14} /> Schedule
            </button>
            <button style={{
              padding: '10px 20px', borderRadius: 8, background: 'transparent', border: `1px solid ${C.border}`,
              color: C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <FileText size={14} /> Save Draft
            </button>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAMPAIGNS.map(camp => {
          const sc = statusConfig[camp.status]
          const segCfg = segmentConfig[camp.segment] || segmentConfig.all
          const expanded = expandedCampaign === camp.id
          const openRate = camp.sent > 0 ? Math.round((camp.opened / camp.sent) * 100) : 0
          const clickRate = camp.sent > 0 ? Math.round((camp.clicked / camp.sent) * 100) : 0
          const convRate = camp.sent > 0 ? Math.round((camp.redeemed / camp.sent) * 100) : 0

          return (
            <div key={camp.id} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              {/* Campaign header */}
              <div onClick={() => setExpandedCampaign(expanded ? null : camp.id)} style={{
                padding: '16px 20px', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{camp.name}</span>
                    <span style={{
                      padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                      color: sc.color, background: sc.bg, border: `1px solid ${sc.color}25`,
                    }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: C.textMuted }}>
                    <span style={{ color: segCfg.color }}>{segCfg.label}</span>
                    <span>{camp.channel === 'email' ? 'Email' : 'SMS'}</span>
                    {camp.sentDate && <span>{camp.sentDate}</span>}
                  </div>
                </div>

                {camp.status === 'sent' && (
                  <div style={{ display: 'flex', gap: 20 }}>
                    {[
                      { label: 'Open Rate', value: `${openRate}%`, color: openRate > 60 ? C.green : C.orange },
                      { label: 'Click Rate', value: `${clickRate}%`, color: clickRate > 30 ? C.green : C.orange },
                      { label: 'Conversions', value: camp.redeemed, color: C.amber },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                        <div style={{ fontSize: 10, color: C.textDim }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {expanded ? <ChevronUp size={16} color={C.textMuted} /> : <ChevronDown size={16} color={C.textMuted} />}
              </div>

              {/* Expanded details */}
              {expanded && (
                <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}` }}>
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ fontSize: 12, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Message</div>
                    <div style={{
                      padding: 14, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
                      fontSize: 13, color: C.text, lineHeight: 1.6,
                    }}>{camp.message}</div>
                  </div>

                  {camp.status === 'sent' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      {[
                        { label: 'Sent', value: camp.sent, color: C.blue },
                        { label: 'Opened', value: camp.opened, color: C.green },
                        { label: 'Clicked', value: camp.clicked, color: C.amber },
                        { label: 'Redeemed', value: camp.redeemed, color: C.amber },
                      ].map(m => (
                        <div key={m.label} style={{
                          padding: '12px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
                          textAlign: 'center',
                        }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                          <div style={{ fontSize: 11, color: C.textDim }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Funnel visualization for sent campaigns */}
                  {camp.status === 'sent' && camp.sent > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 12, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Conversion Funnel</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          { label: 'Sent', value: camp.sent, pct: 100 },
                          { label: 'Opened', value: camp.opened, pct: openRate },
                          { label: 'Clicked', value: camp.clicked, pct: clickRate },
                          { label: 'Redeemed', value: camp.redeemed, pct: convRate },
                        ].map(step => (
                          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 12, color: C.textMuted, width: 70 }}>{step.label}</span>
                            <div style={{ flex: 1, height: 20, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: 4, width: `${step.pct}%`,
                                background: `linear-gradient(90deg, ${C.amber}, ${C.amber}80)`,
                                transition: 'width 0.5s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                              }}>
                                {step.pct > 15 && <span style={{ fontSize: 10, fontWeight: 600, color: '#000' }}>{step.pct}%</span>}
                              </div>
                            </div>
                            <span style={{ fontSize: 12, color: C.ink, fontFamily: "'JetBrains Mono', monospace", width: 30, textAlign: 'right' }}>{step.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
