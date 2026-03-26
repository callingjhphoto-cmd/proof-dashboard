// Proof CRM — Customer Data
// 50 realistic customers for a London bar (The Ivy Chelsea Garden)

const MENU_ITEMS = [
  'Espresso Martini', 'Negroni', 'G&T', 'Old Fashioned', 'Margarita',
  'Aperol Spritz', 'Pornstar Martini', 'Whisky Sour', 'Mojito', 'Daiquiri',
  'French 75', 'Moscow Mule', 'Penicillin', 'Manhattan', 'Tom Collins',
  'Cosmopolitan', 'Dark & Stormy', 'Paloma', 'Bellini', 'Champagne Flute',
  'House Red', 'House White', 'Sauvignon Blanc', 'Pinot Grigio', 'Malbec',
  'Peroni', 'Guinness', 'Craft IPA', 'Heineken', 'Camden Pale Ale',
]

const SEGMENTS = {
  REGULAR: { key: 'regular', label: 'Regular', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  HIGH_SPENDER: { key: 'high_spender', label: 'High Spender', color: '#D4A853', bg: 'rgba(212,168,83,0.1)' },
  LAPSED: { key: 'lapsed', label: 'Lapsed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  NEW: { key: 'new', label: 'New', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  NORMAL: { key: 'normal', label: 'Normal', color: '#888', bg: 'rgba(136,136,136,0.1)' },
}

function generateVisitHistory(segment, avgSpend) {
  const visits = []
  const now = new Date(2026, 2, 26) // March 26 2026
  let numVisits = 20

  const items = [...MENU_ITEMS].sort(() => Math.random() - 0.5)
  const favItems = items.slice(0, 5)

  for (let i = 0; i < numVisits; i++) {
    let daysAgo
    if (segment === 'regular') {
      daysAgo = Math.floor(i * 2.5) + Math.floor(Math.random() * 2)
    } else if (segment === 'high_spender') {
      daysAgo = Math.floor(i * 5) + Math.floor(Math.random() * 3)
    } else if (segment === 'lapsed') {
      daysAgo = 35 + Math.floor(i * 7) + Math.floor(Math.random() * 5)
    } else if (segment === 'new') {
      daysAgo = Math.floor(i * 8) + Math.floor(Math.random() * 4)
      if (i > 4) break
    } else {
      daysAgo = Math.floor(i * 10) + Math.floor(Math.random() * 5)
    }

    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    const spend = avgSpend + (Math.random() - 0.5) * avgSpend * 0.4
    const numItems = 2 + Math.floor(Math.random() * 3)
    const ordered = favItems.slice(0, numItems)

    visits.push({
      date: date.toISOString().split('T')[0],
      time: `${17 + Math.floor(Math.random() * 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      spend: Math.round(spend * 100) / 100,
      items: ordered,
    })
  }

  return visits
}

function generateMonthlySpend(segment, avgSpend) {
  const months = []
  const labels = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']
  for (let i = 0; i < 12; i++) {
    let base = avgSpend
    if (segment === 'regular') {
      base *= (3 + Math.random() * 2) // 3-5 visits/month
    } else if (segment === 'high_spender') {
      base *= (2 + Math.random() * 1.5)
    } else if (segment === 'lapsed') {
      base *= i < 6 ? (1 + Math.random()) : 0
    } else if (segment === 'new') {
      base *= i > 9 ? (1 + Math.random() * 0.5) : 0
    } else {
      base *= (0.5 + Math.random() * 1.5)
    }
    months.push({ month: labels[i], spend: Math.round(base) })
  }
  return months
}

const CUSTOMERS = [
  // ===== REGULARS (15) =====
  { id: 'c001', name: 'Oliver Thompson', email: 'oliver.t@gmail.com', phone: '+44 7700 100201', segment: 'regular', memberSince: '2024-03-15', totalVisits: 187, totalSpend: 8415, avgSpend: 45, lastVisit: '2026-03-25', favouriteItem: 'Espresso Martini', notes: ['Prefers table by window', 'Always orders espresso martini first'] },
  { id: 'c002', name: 'Charlotte Davies', email: 'charlotte.d@outlook.com', phone: '+44 7700 100202', segment: 'regular', memberSince: '2024-01-20', totalVisits: 210, totalSpend: 9870, avgSpend: 47, lastVisit: '2026-03-26', favouriteItem: 'Negroni', notes: ['Birthday: 14 May', 'Brings friends on Fridays'] },
  { id: 'c003', name: 'James Whitfield', email: 'j.whitfield@proton.me', phone: '+44 7700 100203', segment: 'regular', memberSince: '2024-06-10', totalVisits: 156, totalSpend: 7020, avgSpend: 45, lastVisit: '2026-03-24', favouriteItem: 'Old Fashioned', notes: ['Whisky enthusiast', 'Likes to sit at the bar'] },
  { id: 'c004', name: 'Amelia Foster', email: 'amelia.f@yahoo.co.uk', phone: '+44 7700 100204', segment: 'regular', memberSince: '2024-02-28', totalVisits: 198, totalSpend: 7920, avgSpend: 40, lastVisit: '2026-03-25', favouriteItem: 'Aperol Spritz', notes: ['Vegan — always ask about new vegan menu items'] },
  { id: 'c005', name: 'Harry Bennett', email: 'harry.b@gmail.com', phone: '+44 7700 100205', segment: 'regular', memberSince: '2023-11-05', totalVisits: 245, totalSpend: 12005, avgSpend: 49, lastVisit: '2026-03-26', favouriteItem: 'G&T', notes: ['Prefers Fever-Tree tonic', 'After-work regular, usually Mon/Wed/Fri'] },
  { id: 'c006', name: 'Isla Richardson', email: 'isla.r@gmail.com', phone: '+44 7700 100206', segment: 'regular', memberSince: '2024-05-18', totalVisits: 167, totalSpend: 6680, avgSpend: 40, lastVisit: '2026-03-24', favouriteItem: 'Margarita', notes: ['Allergic to nuts — CRITICAL'] },
  { id: 'c007', name: 'George Palmer', email: 'g.palmer@hotmail.co.uk', phone: '+44 7700 100207', segment: 'regular', memberSince: '2024-04-02', totalVisits: 178, totalSpend: 8010, avgSpend: 45, lastVisit: '2026-03-25', favouriteItem: 'Penicillin', notes: ['Craft cocktail lover', 'Interested in cocktail masterclasses'] },
  { id: 'c008', name: 'Freya Hughes', email: 'freya.h@me.com', phone: '+44 7700 100208', segment: 'regular', memberSince: '2024-07-12', totalVisits: 140, totalSpend: 5880, avgSpend: 42, lastVisit: '2026-03-23', favouriteItem: 'French 75', notes: ['Works nearby at Harrods', 'Prefers quieter side of the bar'] },
  { id: 'c009', name: 'William Cross', email: 'will.cross@gmail.com', phone: '+44 7700 100209', segment: 'regular', memberSince: '2023-09-01', totalVisits: 280, totalSpend: 11200, avgSpend: 40, lastVisit: '2026-03-26', favouriteItem: 'Guinness', notes: ['Rugby match days — always brings 4-6 mates', 'Tips generously'] },
  { id: 'c010', name: 'Sophie Patel', email: 'sophie.p@gmail.com', phone: '+44 7700 100210', segment: 'regular', memberSince: '2024-08-20', totalVisits: 125, totalSpend: 5625, avgSpend: 45, lastVisit: '2026-03-25', favouriteItem: 'Cosmopolitan', notes: ['Date night regular — usually Saturdays'] },
  { id: 'c011', name: 'Jack Morrison', email: 'jack.m@outlook.com', phone: '+44 7700 100211', segment: 'regular', memberSince: '2024-01-08', totalVisits: 215, totalSpend: 8600, avgSpend: 40, lastVisit: '2026-03-24', favouriteItem: 'Peroni', notes: ['Simple tastes', 'Usually quick 1-2 drinks after work'] },
  { id: 'c012', name: 'Emily Watson', email: 'emily.w@icloud.com', phone: '+44 7700 100212', segment: 'regular', memberSince: '2024-03-30', totalVisits: 184, totalSpend: 9200, avgSpend: 50, lastVisit: '2026-03-26', favouriteItem: 'Champagne Flute', notes: ['Celebrates everything with champagne', 'Birthday: 22 August'] },
  { id: 'c013', name: 'Daniel Okafor', email: 'daniel.o@gmail.com', phone: '+44 7700 100213', segment: 'regular', memberSince: '2024-06-25', totalVisits: 148, totalSpend: 6660, avgSpend: 45, lastVisit: '2026-03-23', favouriteItem: 'Whisky Sour', notes: ['Always asks for recommendations', 'Enjoys trying new menu items'] },
  { id: 'c014', name: 'Lucy Chang', email: 'lucy.c@proton.me', phone: '+44 7700 100214', segment: 'regular', memberSince: '2024-04-15', totalVisits: 172, totalSpend: 7740, avgSpend: 45, lastVisit: '2026-03-25', favouriteItem: 'Mojito', notes: ['Cocktail photographer — tags us on Instagram'] },
  { id: 'c015', name: 'Ethan Brooks', email: 'ethan.b@gmail.com', phone: '+44 7700 100215', segment: 'regular', memberSince: '2024-02-10', totalVisits: 200, totalSpend: 8000, avgSpend: 40, lastVisit: '2026-03-24', favouriteItem: 'Camden Pale Ale', notes: ['Prefers craft beer selection', 'Knows all the staff by name'] },

  // ===== HIGH SPENDERS (8) =====
  { id: 'c016', name: 'Alexander Hartley-Shaw', email: 'alex.hs@investcorp.co.uk', phone: '+44 7700 100216', segment: 'high_spender', memberSince: '2023-06-01', totalVisits: 92, totalSpend: 11960, avgSpend: 130, lastVisit: '2026-03-22', favouriteItem: 'Dom Perignon', notes: ['VIP — always gets the best table', 'Corporate entertaining 2-3x/month', 'Account at the bar'] },
  { id: 'c017', name: 'Victoria Ashworth', email: 'v.ashworth@sothebys.com', phone: '+44 7700 100217', segment: 'high_spender', memberSince: '2023-08-15', totalVisits: 78, totalSpend: 9360, avgSpend: 120, lastVisit: '2026-03-20', favouriteItem: 'Veuve Clicquot', notes: ['Art world connections', 'Hosts private dinners — enquire about event space'] },
  { id: 'c018', name: 'Sebastian Montague', email: 'seb.m@goldmansachs.com', phone: '+44 7700 100218', segment: 'high_spender', memberSince: '2024-01-10', totalVisits: 65, totalSpend: 8450, avgSpend: 130, lastVisit: '2026-03-21', favouriteItem: 'Macallan 18', notes: ['City trader', 'Friday after-work group — 6-8 people', 'Prefers scotch, no bourbon'] },
  { id: 'c019', name: 'Arabella Fitzgerald', email: 'arabella@fitzpr.com', phone: '+44 7700 100219', segment: 'high_spender', memberSince: '2023-10-22', totalVisits: 85, totalSpend: 8500, avgSpend: 100, lastVisit: '2026-03-23', favouriteItem: 'Espresso Martini', notes: ['PR agency owner', 'Brings clients — always needs impressive table', 'Mentions us on social media'] },
  { id: 'c020', name: 'Marcus Pemberton', email: 'm.pemberton@barrister.co.uk', phone: '+44 7700 100220', segment: 'high_spender', memberSince: '2024-03-05', totalVisits: 55, totalSpend: 6050, avgSpend: 110, lastVisit: '2026-03-19', favouriteItem: 'Manhattan', notes: ['Barrister — quiet corner preferred', 'Orders premium spirits only', 'Never uses phone at the bar'] },
  { id: 'c021', name: 'Priya Kapoor', email: 'priya.k@luxetravel.com', phone: '+44 7700 100221', segment: 'high_spender', memberSince: '2024-05-12', totalVisits: 48, totalSpend: 5760, avgSpend: 120, lastVisit: '2026-03-22', favouriteItem: 'Bellini', notes: ['Luxury travel consultant', 'Loves seasonal cocktails', 'Potential collab partner for events'] },
  { id: 'c022', name: 'Hugo Cavendish', email: 'hugo.c@private.email', phone: '+44 7700 100222', segment: 'high_spender', memberSince: '2023-04-18', totalVisits: 110, totalSpend: 11000, avgSpend: 100, lastVisit: '2026-03-24', favouriteItem: 'Negroni', notes: ['Family money', 'Generous tipper', 'Birthday: 30 November — always books large party'] },
  { id: 'c023', name: 'Diana Rothschild', email: 'd.rothschild@gmail.com', phone: '+44 7700 100223', segment: 'high_spender', memberSince: '2024-02-14', totalVisits: 60, totalSpend: 7200, avgSpend: 120, lastVisit: '2026-03-21', favouriteItem: 'Sauvignon Blanc', notes: ['Wine connoisseur', 'Only drinks NZ Sauvignon Blanc', 'Connected to several sommeliers'] },

  // ===== LAPSED (12) =====
  { id: 'c024', name: 'Ryan Fletcher', email: 'ryan.f@gmail.com', phone: '+44 7700 100224', segment: 'lapsed', memberSince: '2024-09-01', totalVisits: 28, totalSpend: 1120, avgSpend: 40, lastVisit: '2026-02-18', favouriteItem: 'Craft IPA', notes: ['Used to come weekly', 'Stopped after price increase?'] },
  { id: 'c025', name: 'Megan Cooper', email: 'megan.c@hotmail.com', phone: '+44 7700 100225', segment: 'lapsed', memberSince: '2024-07-20', totalVisits: 22, totalSpend: 990, avgSpend: 45, lastVisit: '2026-02-10', favouriteItem: 'Aperol Spritz', notes: ['Seasonal drinker — may return in summer'] },
  { id: 'c026', name: 'Liam O\'Brien', email: 'liam.ob@yahoo.com', phone: '+44 7700 100226', segment: 'lapsed', memberSince: '2024-06-15', totalVisits: 35, totalSpend: 1400, avgSpend: 40, lastVisit: '2026-02-05', favouriteItem: 'Guinness', notes: ['Moved to East London — distance issue'] },
  { id: 'c027', name: 'Emma Sinclair', email: 'emma.s@gmail.com', phone: '+44 7700 100227', segment: 'lapsed', memberSince: '2024-08-10', totalVisits: 18, totalSpend: 810, avgSpend: 45, lastVisit: '2026-01-28', favouriteItem: 'Pornstar Martini', notes: ['Had a complaint about service on last visit'] },
  { id: 'c028', name: 'Tom Nguyen', email: 'tom.n@proton.me', phone: '+44 7700 100228', segment: 'lapsed', memberSince: '2024-05-25', totalVisits: 40, totalSpend: 2000, avgSpend: 50, lastVisit: '2026-02-12', favouriteItem: 'Old Fashioned', notes: ['Freelancer — may have lost income'] },
  { id: 'c029', name: 'Sarah McDonald', email: 'sarah.mc@icloud.com', phone: '+44 7700 100229', segment: 'lapsed', memberSince: '2024-10-05', totalVisits: 15, totalSpend: 525, avgSpend: 35, lastVisit: '2026-02-20', favouriteItem: 'House White', notes: ['Came with a group that stopped coming'] },
  { id: 'c030', name: 'Callum Stewart', email: 'callum.s@outlook.com', phone: '+44 7700 100230', segment: 'lapsed', memberSince: '2024-04-12', totalVisits: 45, totalSpend: 1800, avgSpend: 40, lastVisit: '2026-01-15', favouriteItem: 'Moscow Mule', notes: ['Was a regular until January'] },
  { id: 'c031', name: 'Rachel Kim', email: 'rachel.k@gmail.com', phone: '+44 7700 100231', segment: 'lapsed', memberSince: '2024-11-20', totalVisits: 12, totalSpend: 540, avgSpend: 45, lastVisit: '2026-02-08', favouriteItem: 'Daiquiri', notes: ['New Year resolution — cutting back on drinking?'] },
  { id: 'c032', name: 'Ben Atkinson', email: 'ben.a@gmail.com', phone: '+44 7700 100232', segment: 'lapsed', memberSince: '2024-03-18', totalVisits: 52, totalSpend: 2340, avgSpend: 45, lastVisit: '2026-01-22', favouriteItem: 'G&T', notes: ['Long-time regular gone quiet', 'Worth a personal reach-out'] },
  { id: 'c033', name: 'Zara Hussain', email: 'zara.h@yahoo.co.uk', phone: '+44 7700 100233', segment: 'lapsed', memberSince: '2024-09-15', totalVisits: 20, totalSpend: 700, avgSpend: 35, lastVisit: '2026-02-15', favouriteItem: 'Mojito', notes: ['Student — term may have ended'] },
  { id: 'c034', name: 'Patrick O\'Connor', email: 'pat.oc@gmail.com', phone: '+44 7700 100234', segment: 'lapsed', memberSince: '2024-07-08', totalVisits: 30, totalSpend: 1350, avgSpend: 45, lastVisit: '2026-02-01', favouriteItem: 'Heineken', notes: ['Sports fan — came for match screenings'] },
  { id: 'c035', name: 'Natasha Volkov', email: 'natasha.v@outlook.com', phone: '+44 7700 100235', segment: 'lapsed', memberSince: '2024-08-25', totalVisits: 25, totalSpend: 1250, avgSpend: 50, lastVisit: '2026-02-22', favouriteItem: 'Cosmopolitan', notes: ['Russian expat', 'Used to come for cocktail hour Thursdays'] },

  // ===== NEW (10) =====
  { id: 'c036', name: 'Maya Fernandez', email: 'maya.f@gmail.com', phone: '+44 7700 100236', segment: 'new', memberSince: '2026-03-05', totalVisits: 3, totalSpend: 135, avgSpend: 45, lastVisit: '2026-03-22', favouriteItem: 'Margarita', notes: ['Found us on Instagram'] },
  { id: 'c037', name: 'Kai Tanaka', email: 'kai.t@yahoo.com', phone: '+44 7700 100237', segment: 'new', memberSince: '2026-03-10', totalVisits: 2, totalSpend: 110, avgSpend: 55, lastVisit: '2026-03-20', favouriteItem: 'Whisky Sour', notes: ['Japanese whisky fan — show premium selection'] },
  { id: 'c038', name: 'Chloe Anderson', email: 'chloe.a@gmail.com', phone: '+44 7700 100238', segment: 'new', memberSince: '2026-03-01', totalVisits: 4, totalSpend: 160, avgSpend: 40, lastVisit: '2026-03-24', favouriteItem: 'Aperol Spritz', notes: ['Referred by Charlotte Davies (c002)'] },
  { id: 'c039', name: 'Noah Williams', email: 'noah.w@hotmail.com', phone: '+44 7700 100239', segment: 'new', memberSince: '2026-03-08', totalVisits: 2, totalSpend: 80, avgSpend: 40, lastVisit: '2026-03-18', favouriteItem: 'Peroni', notes: ['Walk-in, lives nearby'] },
  { id: 'c040', name: 'Jasmine Osei', email: 'jasmine.o@gmail.com', phone: '+44 7700 100240', segment: 'new', memberSince: '2026-03-12', totalVisits: 3, totalSpend: 180, avgSpend: 60, lastVisit: '2026-03-25', favouriteItem: 'French 75', notes: ['Celebrating new job — high potential'] },
  { id: 'c041', name: 'Leo Zhang', email: 'leo.z@proton.me', phone: '+44 7700 100241', segment: 'new', memberSince: '2026-03-15', totalVisits: 1, totalSpend: 52, avgSpend: 52, lastVisit: '2026-03-15', favouriteItem: 'Craft IPA', notes: ['First visit — seemed impressed'] },
  { id: 'c042', name: 'Poppy Richardson', email: 'poppy.r@icloud.com', phone: '+44 7700 100242', segment: 'new', memberSince: '2026-03-03', totalVisits: 4, totalSpend: 200, avgSpend: 50, lastVisit: '2026-03-23', favouriteItem: 'Espresso Martini', notes: ['Came for brunch, stayed for cocktails'] },
  { id: 'c043', name: 'Adam El-Amin', email: 'adam.ea@outlook.com', phone: '+44 7700 100243', segment: 'new', memberSince: '2026-03-07', totalVisits: 3, totalSpend: 105, avgSpend: 35, lastVisit: '2026-03-21', favouriteItem: 'Moscow Mule', notes: ['Budget-conscious — responds to happy hour'] },
  { id: 'c044', name: 'Erin Murphy', email: 'erin.m@gmail.com', phone: '+44 7700 100244', segment: 'new', memberSince: '2026-03-18', totalVisits: 1, totalSpend: 48, avgSpend: 48, lastVisit: '2026-03-18', favouriteItem: 'Negroni', notes: ['Bartender at another venue — industry connection'] },
  { id: 'c045', name: 'Ravi Sharma', email: 'ravi.s@gmail.com', phone: '+44 7700 100245', segment: 'new', memberSince: '2026-03-02', totalVisits: 5, totalSpend: 275, avgSpend: 55, lastVisit: '2026-03-26', favouriteItem: 'Paloma', notes: ['Coming frequently — potential regular convert'] },

  // ===== NORMAL (5) =====
  { id: 'c046', name: 'Fiona Gallagher', email: 'fiona.g@yahoo.co.uk', phone: '+44 7700 100246', segment: 'normal', memberSince: '2025-06-10', totalVisits: 24, totalSpend: 960, avgSpend: 40, lastVisit: '2026-03-12', favouriteItem: 'House Red', notes: ['Comes for wine, not cocktails'] },
  { id: 'c047', name: 'David Park', email: 'david.p@gmail.com', phone: '+44 7700 100247', segment: 'normal', memberSince: '2025-04-22', totalVisits: 30, totalSpend: 1200, avgSpend: 40, lastVisit: '2026-03-08', favouriteItem: 'Heineken', notes: ['Occasional — comes with different groups'] },
  { id: 'c048', name: 'Hannah Moore', email: 'hannah.m@hotmail.com', phone: '+44 7700 100248', segment: 'normal', memberSince: '2025-08-15', totalVisits: 18, totalSpend: 810, avgSpend: 45, lastVisit: '2026-03-15', favouriteItem: 'Pinot Grigio', notes: ['Wine drinker', 'Quiet evenings only'] },
  { id: 'c049', name: 'Chris Taylor', email: 'chris.t@outlook.com', phone: '+44 7700 100249', segment: 'normal', memberSince: '2025-05-30', totalVisits: 26, totalSpend: 1170, avgSpend: 45, lastVisit: '2026-03-10', favouriteItem: 'Tom Collins', notes: ['Weekend visitor mainly'] },
  { id: 'c050', name: 'Aisha Begum', email: 'aisha.b@gmail.com', phone: '+44 7700 100250', segment: 'normal', memberSince: '2025-07-04', totalVisits: 20, totalSpend: 700, avgSpend: 35, lastVisit: '2026-03-14', favouriteItem: 'Malbec', notes: ['Non-drinker friends — always orders for the group'] },
]

// Generate visit history and monthly spend for each customer
CUSTOMERS.forEach(c => {
  c.visitHistory = generateVisitHistory(c.segment, c.avgSpend)
  c.monthlySpend = generateMonthlySpend(c.segment, c.avgSpend)
  c.favouriteItems = [
    { item: c.favouriteItem, count: Math.floor(c.totalVisits * 0.6) },
    { item: MENU_ITEMS[Math.floor(Math.random() * 10)], count: Math.floor(c.totalVisits * 0.3) },
    { item: MENU_ITEMS[10 + Math.floor(Math.random() * 10)], count: Math.floor(c.totalVisits * 0.2) },
    { item: MENU_ITEMS[20 + Math.floor(Math.random() * 10)], count: Math.floor(c.totalVisits * 0.1) },
    { item: MENU_ITEMS[Math.floor(Math.random() * 30)], count: Math.floor(c.totalVisits * 0.05) },
  ]
  // Loyalty
  c.loyaltyVisits = c.totalVisits % 10
  c.rewardsRedeemed = Math.floor(c.totalVisits / 10)
  // Segment reasoning
  if (c.segment === 'regular') c.segmentReason = `Visited ${c.totalVisits} times — averaging 3+ visits per week`
  else if (c.segment === 'high_spender') c.segmentReason = `Average spend £${c.avgSpend} — top 10% by transaction value`
  else if (c.segment === 'lapsed') c.segmentReason = `Last visit ${c.lastVisit} — no activity for 30+ days`
  else if (c.segment === 'new') c.segmentReason = `First visited ${c.memberSince} — ${c.totalVisits} visit${c.totalVisits > 1 ? 's' : ''} this month`
  else c.segmentReason = `${c.totalVisits} visits over ${Math.round((new Date(2026,2,26) - new Date(c.memberSince)) / 86400000 / 30)} months — moderate engagement`
})

// Campaign data
const CAMPAIGNS = [
  { id: 'camp001', name: 'We Miss You — March', segment: 'lapsed', status: 'sent', channel: 'email', sentDate: '2026-03-15', sent: 12, opened: 8, clicked: 5, redeemed: 2, message: 'Hey! We noticed you haven\'t visited in a while. Come back this week and enjoy 20% off your first round. We\'ve got some exciting new cocktails waiting for you.' },
  { id: 'camp002', name: 'Regular Appreciation', segment: 'regular', status: 'sent', channel: 'sms', sentDate: '2026-03-10', sent: 15, opened: 15, clicked: 12, redeemed: 8, message: 'Thanks for being one of our favourite regulars! Flash this text for a complimentary cocktail on your next visit. Valid until 31 March.' },
  { id: 'camp003', name: 'VIP Spring Tasting', segment: 'high_spender', status: 'scheduled', channel: 'email', sentDate: '2026-04-01', sent: 0, opened: 0, clicked: 0, redeemed: 0, message: 'You\'re invited to an exclusive spring cocktail tasting on April 5th. Limited to 20 guests. New menu preview, paired canapés, and a gift bag. RSVP required.' },
  { id: 'camp004', name: 'Welcome Series — Week 2', segment: 'new', status: 'draft', channel: 'email', sentDate: null, sent: 0, opened: 0, clicked: 0, redeemed: 0, message: 'Glad you found us! Here\'s a little something — 15% off your next visit when you bring a friend. Share the love.' },
  { id: 'camp005', name: 'Friday Night Kickoff', segment: 'regular', status: 'sent', channel: 'sms', sentDate: '2026-03-21', sent: 15, opened: 15, clicked: 10, redeemed: 6, message: 'TGIF! DJ set tonight from 9pm. Your usual spot is waiting. See you there?' },
  { id: 'camp006', name: 'Birthday Month — April', segment: 'regular', status: 'draft', channel: 'email', sentDate: null, sent: 0, opened: 0, clicked: 0, redeemed: 0, message: 'Happy Birthday month! Celebrate with us and enjoy a complimentary bottle of prosecco with any booking of 4+.' },
]

const TEMPLATES = [
  { id: 'tpl001', name: 'We Miss You', targetSegment: 'lapsed', channel: 'email', message: 'It\'s been a while! We\'d love to see you back. Enjoy [OFFER] on your next visit. Book a table or just walk in — we\'ve saved your favourite spot.' },
  { id: 'tpl002', name: 'Regular Appreciation', targetSegment: 'regular', channel: 'sms', message: 'Thanks for being a legend! Flash this message for [OFFER]. Valid this week only. See you soon!' },
  { id: 'tpl003', name: 'Birthday Special', targetSegment: 'all', channel: 'email', message: 'Happy Birthday! Celebrate with us and enjoy [OFFER]. Book for 4+ and we\'ll add a bottle of prosecco on the house.' },
  { id: 'tpl004', name: 'New Menu Launch', targetSegment: 'all', channel: 'email', message: 'Our new seasonal menu just dropped. Be one of the first to try it — [OFFER] on any new cocktail this week.' },
  { id: 'tpl005', name: 'Welcome Back', targetSegment: 'new', channel: 'email', message: 'Great to meet you! Come back this week and bring a friend — [OFFER] for both of you.' },
]

// Loyalty program settings
const LOYALTY_SETTINGS = {
  rewardThreshold: 10, // visits
  rewardType: 'Free cocktail of choice',
  expiry: '90 days from earning',
  active: true,
}

export { CUSTOMERS, CAMPAIGNS, TEMPLATES, LOYALTY_SETTINGS, SEGMENTS, MENU_ITEMS }
