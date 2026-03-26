import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Plug, Square, CheckCircle, XCircle,
  ExternalLink, Shield, Database, Wifi, WifiOff, RefreshCw,
  ChevronRight, Users, ShoppingCart, Package, Clock, Utensils, MapPin
} from 'lucide-react'
import { getConnectionStatus, setConnectionStatus, CONNECTION_STATUS } from '../../integrations/square'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6', tealBg: 'rgba(20,184,166,0.08)',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const INTEGRATIONS = [
  {
    id: 'square',
    name: 'Square POS',
    icon: Square,
    description: 'Point of sale, payments, customers, inventory, and labor management. The primary data source for Proof.',
    category: 'POS',
    status: 'available',
    tier: 'free',
    dataPoints: [
      { icon: ShoppingCart, label: 'Transactions & Orders', detail: 'Every sale, void, refund, and comp in real-time' },
      { icon: Users, label: 'Customer Profiles', detail: 'Visit frequency, spend patterns, preferences' },
      { icon: Package, label: 'Inventory Counts', detail: 'Stock levels, usage rates, reorder alerts' },
      { icon: Clock, label: 'Shifts & Labour', detail: 'Clock in/out, breaks, hourly rates, labour cost %' },
      { icon: Utensils, label: 'Menu / Catalog', detail: 'Items, pricing, variations, categories' },
      { icon: MapPin, label: 'Locations', detail: 'Multi-venue support, per-location data' },
    ],
  },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    icon: Plug,
    description: 'Full-service POS with advanced inventory and reporting. Partnership application in progress.',
    category: 'POS',
    status: 'coming_soon',
    tier: 'professional',
  },
  {
    id: 'toast',
    name: 'Toast',
    icon: Plug,
    description: 'Restaurant-focused POS with kitchen display and online ordering. Formal partnership required.',
    category: 'POS',
    status: 'coming_soon',
    tier: 'professional',
  },
  {
    id: 'rotacloud',
    name: 'RotaCloud',
    icon: Plug,
    description: 'UK staff scheduling, time tracking, and HR. Simple API key authentication.',
    category: 'HR & Scheduling',
    status: 'coming_soon',
    tier: 'starter',
  },
  {
    id: 'marketman',
    name: 'MarketMan',
    icon: Plug,
    description: 'Inventory management, recipe costing, and supplier ordering. Available via Square integration.',
    category: 'Inventory',
    status: 'coming_soon',
    tier: 'professional',
  },
]

export default function Settings() {
  const [squareStatus, setSquareStatus] = useState(getConnectionStatus())
  const [expandedIntegration, setExpandedIntegration] = useState('square')
  const [connecting, setConnecting] = useState(false)

  const handleConnectSquare = () => {
    setConnecting(true)
    // Simulate OAuth redirect — in production this redirects to Square
    setTimeout(() => {
      const newStatus = setConnectionStatus({
        status: CONNECTION_STATUS.CONNECTED,
        merchantId: 'MLXXX_DEMO_MERCHANT',
        locationName: 'Ivy Chelsea Garden',
      })
      setSquareStatus(newStatus)
      setConnecting(false)
    }, 2000)
  }

  const handleDisconnect = () => {
    const newStatus = setConnectionStatus({
      status: CONNECTION_STATUS.NOT_CONNECTED,
      merchantId: null,
      locationName: null,
    })
    setSquareStatus(newStatus)
  }

  const isConnected = squareStatus.status === CONNECTION_STATUS.CONNECTED

  return (
    <div className="animate-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <SettingsIcon size={22} color={C.amber} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: 0 }}>Settings</h1>
        </div>
        <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>
          Manage integrations and connect your venue&apos;s data sources to Proof.
        </p>
      </div>

      {/* Integrations Section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Plug size={16} color={C.amber} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0 }}>Integrations</h2>
        </div>

        {/* Integration Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INTEGRATIONS.map(integration => {
            const isExpanded = expandedIntegration === integration.id
            const isSquare = integration.id === 'square'
            const Icon = integration.icon

            return (
              <div key={integration.id} style={{
                background: C.card,
                border: `1px solid ${isSquare && isConnected ? C.green + '40' : C.border}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}>
                {/* Card header */}
                <div
                  onClick={() => setExpandedIntegration(isExpanded ? null : integration.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: isSquare ? (isConnected ? C.greenBg : C.amberBg) : '#1a1a1f',
                    border: `1px solid ${isSquare ? (isConnected ? C.green + '30' : C.amber + '30') : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={20} color={isSquare ? (isConnected ? C.green : C.amber) : C.textDim} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{integration.name}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: integration.status === 'available' ? C.greenBg : C.orangeBg,
                        color: integration.status === 'available' ? C.green : C.orange,
                      }}>
                        {integration.status === 'available' ? 'Available' : 'Coming Soon'}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 4,
                        background: '#1a1a1f', color: C.textDim,
                      }}>
                        {integration.category}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{integration.description}</div>
                  </div>

                  {/* Status indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {isSquare ? (
                      isConnected ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Wifi size={14} color={C.green} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Connected</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <WifiOff size={14} color={C.textDim} />
                          <span style={{ fontSize: 12, color: C.textDim }}>Not Connected</span>
                        </div>
                      )
                    ) : (
                      <span style={{ fontSize: 11, color: C.textDim }}>Coming soon</span>
                    )}
                    <ChevronRight
                      size={16}
                      color={C.textDim}
                      style={{
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    padding: '0 20px 20px',
                    borderTop: `1px solid ${C.border}`,
                  }}>
                    {isSquare ? (
                      <>
                        {/* Connect / Disconnect button */}
                        <div style={{ padding: '20px 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          {isConnected ? (
                            <>
                              <button
                                onClick={handleDisconnect}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 8,
                                  padding: '10px 20px', borderRadius: 8,
                                  border: `1px solid ${C.red}40`, background: C.redBg,
                                  color: C.red, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = C.red + '20' }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.redBg }}
                              >
                                <XCircle size={16} /> Disconnect Square
                              </button>
                              <div style={{ fontSize: 12, color: C.textMuted }}>
                                Connected to <strong style={{ color: C.ink }}>{squareStatus.locationName}</strong>
                                {squareStatus.connectedAt && (
                                  <span> &middot; Since {new Date(squareStatus.connectedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </>
                          ) : (
                            <button
                              onClick={handleConnectSquare}
                              disabled={connecting}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '12px 24px', borderRadius: 8,
                                border: 'none',
                                background: connecting ? C.textDim : `linear-gradient(135deg, ${C.amber}, #A67C2E)`,
                                color: '#000', fontSize: 14, fontWeight: 700, cursor: connecting ? 'wait' : 'pointer',
                                transition: 'all 0.2s', opacity: connecting ? 0.7 : 1,
                                boxShadow: connecting ? 'none' : `0 4px 20px ${C.amber}30`,
                              }}
                              onMouseEnter={e => { if (!connecting) e.currentTarget.style.transform = 'translateY(-1px)' }}
                              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                              {connecting ? (
                                <><RefreshCw size={16} className="spin" /> Connecting...</>
                              ) : (
                                <><Square size={16} /> Connect Square POS</>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Connection status card */}
                        <div style={{
                          background: isConnected ? C.greenBg : '#0d0d0f',
                          border: `1px solid ${isConnected ? C.green + '20' : C.border}`,
                          borderRadius: 10, padding: 16, marginBottom: 16,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            {isConnected ? (
                              <CheckCircle size={16} color={C.green} />
                            ) : (
                              <Shield size={14} color={C.textDim} />
                            )}
                            <span style={{ fontSize: 13, fontWeight: 600, color: isConnected ? C.green : C.textMuted }}>
                              {isConnected ? 'Live Connection Active' : 'OAuth 2.0 Secure Connection'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
                            {isConnected
                              ? 'Proof is receiving real-time data from your Square account. Transactions, customers, inventory, and labour data are syncing continuously.'
                              : 'Clicking "Connect Square POS" will redirect you to Square\u2019s secure authorization page. Proof requests read-only access to your transactions, customers, inventory, and team data. Your credentials are never stored by Proof \u2014 we use OAuth tokens that you can revoke at any time from your Square Dashboard.'
                            }
                          </p>
                        </div>

                        {/* Data points */}
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 10 }}>
                          Data Proof receives from Square:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 8 }}>
                          {integration.dataPoints.map((dp, i) => {
                            const DpIcon = dp.icon
                            return (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                                background: '#0d0d0f', borderRadius: 8, border: `1px solid ${C.border}`,
                              }}>
                                <DpIcon size={14} color={C.amber} style={{ marginTop: 2, flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{dp.label}</div>
                                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{dp.detail}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Links */}
                        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                          <a
                            href="https://developer.squareup.com/docs/build-basics/access-tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              fontSize: 12, color: C.amber, textDecoration: 'none',
                            }}
                          >
                            <ExternalLink size={12} /> Square API Docs
                          </a>
                          <a
                            href="https://developer.squareup.com/apps"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              fontSize: 12, color: C.textMuted, textDecoration: 'none',
                            }}
                          >
                            <Database size={12} /> Developer Dashboard
                          </a>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: '16px 0' }}>
                        <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
                          This integration is on our roadmap. When available, you&apos;ll be able to connect {integration.name} with a single click, just like Square.
                        </p>
                        <div style={{
                          marginTop: 12, padding: '8px 14px', borderRadius: 8,
                          background: '#0d0d0f', border: `1px solid ${C.border}`,
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          fontSize: 12, color: C.textDim,
                        }}>
                          <Clock size={12} /> Estimated: {integration.tier === 'starter' ? 'Q2 2026' : 'Q3 2026'}
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

      {/* Integration roadmap */}
      <div style={{
        background: C.card, border: `1px solid ${C.amber}20`, borderRadius: 12, padding: 24,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Integration Roadmap</div>
        <p style={{ fontSize: 12, color: C.textMuted, margin: '0 0 16px', lineHeight: 1.6 }}>
          When a venue signs up for Proof, we flip the switch. One click to connect their POS, and the entire platform lights up with live data.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { phase: 'Phase 1', label: 'Square POS', status: 'Ready', color: C.green },
            { phase: 'Phase 1', label: 'RotaCloud HR', status: 'Q2 2026', color: C.orange },
            { phase: 'Phase 2', label: 'MarketMan', status: 'Q3 2026', color: C.textDim },
            { phase: 'Phase 2', label: 'Lightspeed', status: 'Q3 2026', color: C.textDim },
            { phase: 'Phase 3', label: 'Toast', status: 'Q4 2026', color: C.textDim },
            { phase: 'Phase 3', label: 'Deputy', status: 'Q4 2026', color: C.textDim },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
              background: '#0d0d0f', borderRadius: 6, border: `1px solid ${C.border}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 11, color: C.text }}>{item.label}</span>
              <span style={{ fontSize: 10, color: C.textDim }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
