import { Coffee, Wine, AlertTriangle, Star } from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  blue: '#3B82F6', orange: '#F97316',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const cocktailOfTheDay = {
  name: 'Smoked Maple Old Fashioned',
  spirit: 'Woodford Reserve Bourbon',
  ingredients: ['60ml Woodford Reserve', '10ml maple syrup', '2 dashes Angostura', 'Orange peel', 'Smoked with applewood'],
  price: '\u00a315.50',
  gp: '79%',
  upsellTip: 'Recommend to anyone ordering an Old Fashioned or Whiskey Sour. Mention the smoke presentation as a talking point.',
}

const menuChanges = [
  { type: 'new', item: 'Sakura Spritz', note: 'Cherry blossom liqueur, prosecco, elderflower tonic. \u00a313.00' },
  { type: 'new', item: 'Mezcal Paloma (v2)', note: 'Updated recipe: now uses grapefruit oleo saccharum. \u00a314.00' },
  { type: 'price', item: 'Espresso Martini', note: 'Price increased from \u00a312.50 to \u00a313.00. New Oatly foam spec.' },
  { type: 'removed', item: 'Mulled Wine', note: 'Removed from menu for spring season.' },
]

const eightySixed = [
  { item: 'Champagne (House)', reason: 'Delivery delayed. Expected tomorrow AM.', since: '14:00' },
  { item: 'Fresh Raspberries', reason: 'Quality issue with delivery. Substituting frozen.', since: '11:00' },
]

const wineByTheGlass = [
  { name: 'Cloudy Bay Sauvignon Blanc', region: 'Marlborough', glass: '\u00a312.50', btl: '\u00a354' },
  { name: 'Chablis Premier Cru', region: 'Burgundy', glass: '\u00a315.00', btl: '\u00a365' },
  { name: 'Malbec, Catena Zapata', region: 'Mendoza', glass: '\u00a311.50', btl: '\u00a348' },
  { name: 'Ros\u00e9, Ch\u00e2teau d\'Esclans', region: 'Provence', glass: '\u00a313.00', btl: '\u00a356' },
]

const typeConfig = {
  new: { color: C.green, label: 'NEW' },
  price: { color: C.amber, label: 'PRICE CHANGE' },
  removed: { color: C.red, label: 'REMOVED' },
}

export default function TodaysSpecials() {
  return (
    <div className="animate-in">
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        Today&apos;s Specials
      </div>

      {/* 86'd Items Alert */}
      {eightySixed.length > 0 && (
        <div style={{
          background: C.redBg, border: `1px solid ${C.red}30`, borderRadius: 12, padding: 16, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AlertTriangle size={16} color={C.red} />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.red }}>86&apos;d Items</span>
          </div>
          {eightySixed.map((item, i) => (
            <div key={i} style={{
              padding: '8px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.06)', marginBottom: i < eightySixed.length - 1 ? 6 : 0,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{item.item}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{item.reason} (Since {item.since})</div>
            </div>
          ))}
        </div>
      )}

      {/* Cocktail of the Day */}
      <div style={{
        background: `linear-gradient(135deg, ${C.amber}12, ${C.amber}05)`,
        border: `1px solid ${C.amber}40`, borderRadius: 14, padding: 24, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Star size={18} color={C.amber} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.amber, textTransform: 'uppercase', letterSpacing: '1px' }}>Cocktail of the Day</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{cocktailOfTheDay.name}</div>
        <div style={{ fontSize: 13, color: C.amber, marginBottom: 12 }}>{cocktailOfTheDay.spirit} &bull; {cocktailOfTheDay.price}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {cocktailOfTheDay.ingredients.map((ing, i) => (
            <span key={i} style={{
              padding: '4px 10px', borderRadius: 6, background: C.amberBg, fontSize: 12, color: C.text,
              border: `1px solid ${C.amber}20`,
            }}>{ing}</span>
          ))}
        </div>
        <div style={{
          padding: '10px 14px', borderRadius: 8, background: 'rgba(212,168,83,0.08)',
          borderLeft: `3px solid ${C.amber}`, fontSize: 12, color: C.text, lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600, color: C.amber }}>Upsell tip:</span> {cocktailOfTheDay.upsellTip}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Menu Changes */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Coffee size={16} color={C.blue} /> Menu Changes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {menuChanges.map((change, i) => {
              const tc = typeConfig[change.type]
              return (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${tc.color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{change.item}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: tc.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tc.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{change.note}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Wine by the Glass */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wine size={16} color={C.amber} /> Wines by the Glass
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wineByTheGlass.map((wine, i) => (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{wine.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11 }}>
                  <span style={{ color: C.textDim }}>{wine.region}</span>
                  <span>
                    <span style={{ color: C.amber, fontWeight: 600 }}>{wine.glass}</span>
                    <span style={{ color: C.textDim }}> / {wine.btl} btl</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
