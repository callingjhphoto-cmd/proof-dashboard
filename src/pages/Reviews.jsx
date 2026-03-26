import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import {
  Star, MessageSquare, ThumbsUp, ThumbsDown, Minus, AlertTriangle, Edit3,
  Search, Filter, TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  Zap, Eye, Clock, CheckCircle
} from 'lucide-react'

const C = {
  bg: '#0A0A0B', card: '#111113', cardHover: '#161618', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', orangeBg: 'rgba(249,115,22,0.08)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.08)',
  teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const ratingTrend = [
  { month: 'Apr 25', google: 4.3, trip: 4.1, combined: 4.2 },
  { month: 'May', google: 4.4, trip: 4.2, combined: 4.3 },
  { month: 'Jun', google: 4.3, trip: 4.1, combined: 4.2 },
  { month: 'Jul', google: 4.5, trip: 4.3, combined: 4.4 },
  { month: 'Aug', google: 4.4, trip: 4.2, combined: 4.3 },
  { month: 'Sep', google: 4.5, trip: 4.4, combined: 4.45 },
  { month: 'Oct', google: 4.6, trip: 4.3, combined: 4.45 },
  { month: 'Nov', google: 4.5, trip: 4.4, combined: 4.45 },
  { month: 'Dec', google: 4.4, trip: 4.2, combined: 4.3 },
  { month: 'Jan 26', google: 4.5, trip: 4.3, combined: 4.4 },
  { month: 'Feb', google: 4.6, trip: 4.4, combined: 4.5 },
  { month: 'Mar', google: 4.6, trip: 4.5, combined: 4.55 },
]

const keywordData = [
  { keyword: 'great cocktails', count: 28, sentiment: 'positive' },
  { keyword: 'slow service', count: 12, sentiment: 'negative' },
  { keyword: 'beautiful interior', count: 22, sentiment: 'positive' },
  { keyword: 'expensive', count: 15, sentiment: 'neutral' },
  { keyword: 'friendly staff', count: 19, sentiment: 'positive' },
  { keyword: 'noisy', count: 8, sentiment: 'negative' },
  { keyword: 'great atmosphere', count: 24, sentiment: 'positive' },
  { keyword: 'long wait', count: 9, sentiment: 'negative' },
  { keyword: 'amazing food', count: 16, sentiment: 'positive' },
  { keyword: 'overpriced', count: 7, sentiment: 'negative' },
]

// 30 realistic sample reviews
const REVIEWS = [
  { id: 1, platform: 'Google', author: 'Sarah K.', rating: 5, date: '2026-03-25', text: 'Absolutely stunning venue. The Espresso Martini was the best I\'ve had in London. Sarah behind the bar was incredibly knowledgeable and recommended a perfect Old Fashioned for my partner. Will definitely be back.', sentiment: 'positive', keywords: ['great cocktails', 'friendly staff'], responded: false, aiResponse: 'Thank you so much, Sarah! We\'re thrilled you enjoyed your experience, especially the Espresso Martini. Sarah is indeed a star behind the bar. We look forward to welcoming you back soon.' },
  { id: 2, platform: 'TripAdvisor', author: 'Mike R.', rating: 4, date: '2026-03-25', text: 'Really nice place, good food and drinks. Only reason for 4 stars instead of 5 is the wait time — took about 25 minutes for our cocktails during the Friday rush. Understandable but worth noting.', sentiment: 'positive', keywords: ['great cocktails', 'slow service'], responded: false, aiResponse: 'Thanks for the honest feedback, Mike. We\'re pleased you enjoyed the food and drinks. We\'re actively working on reducing wait times during peak hours — your feedback helps us improve. Hope to see you again.' },
  { id: 3, platform: 'Google', author: 'Emma T.', rating: 5, date: '2026-03-24', text: 'Came here for my birthday and the team went above and beyond. They arranged a special table, brought out a cake, and the bartender made a personalised cocktail for me. The attention to detail is phenomenal.', sentiment: 'positive', keywords: ['friendly staff', 'great atmosphere'], responded: true },
  { id: 4, platform: 'Google', author: 'David L.', rating: 2, date: '2026-03-24', text: 'Disappointing experience. Waited 40 minutes for a table despite having a booking. When we finally sat down, the server seemed disinterested and got our order wrong twice. The cocktails were good but the service really let it down.', sentiment: 'negative', keywords: ['slow service', 'long wait'], responded: false, aiResponse: 'David, we sincerely apologise for your experience. This falls well below our standards. We\'ve investigated and identified the issue — we were understaffed that evening due to a last-minute absence. We\'d love the opportunity to make it right. Please email us at gm@ivychelsea.co.uk and we\'ll arrange a complimentary visit.' },
  { id: 5, platform: 'TripAdvisor', author: 'Jennifer W.', rating: 5, date: '2026-03-24', text: 'The most beautiful bar I\'ve been to in Chelsea. The terrace is gorgeous in the evening light. Had the tasting menu paired with wines and every course was exceptional. Worth every penny.', sentiment: 'positive', keywords: ['beautiful interior', 'amazing food', 'great atmosphere'], responded: true },
  { id: 6, platform: 'Google', author: 'Tom H.', rating: 3, date: '2026-03-23', text: 'Nice enough place but felt overpriced for what you get. £16 for a cocktail is steep when the portions are small. The atmosphere was good though and the staff were friendly. Mixed feelings.', sentiment: 'neutral', keywords: ['expensive', 'overpriced', 'friendly staff'], responded: false, aiResponse: 'Thank you for your feedback, Tom. We understand pricing is an important factor. Our cocktails use premium spirits and fresh ingredients, which is reflected in the price. That said, we appreciate you noting our friendly team and atmosphere. We hope to see you again — perhaps try our Happy Hour specials for better value.' },
  { id: 7, platform: 'TripAdvisor', author: 'Aisha M.', rating: 5, date: '2026-03-23', text: 'Brought my mum here for afternoon tea and it was wonderful. The scones were fresh, the sandwiches delicate, and the champagne was chilled perfectly. Staff were attentive without being intrusive. A real treat.', sentiment: 'positive', keywords: ['amazing food', 'friendly staff'], responded: true },
  { id: 8, platform: 'Google', author: 'Chris P.', rating: 4, date: '2026-03-22', text: 'Great spot for after-work drinks. The bar menu is extensive and the bartenders know their stuff. Only slight issue was how noisy it got after 8pm — hard to have a conversation. But the drinks are top notch.', sentiment: 'positive', keywords: ['great cocktails', 'noisy'], responded: false, aiResponse: 'Thanks Chris! Glad you enjoyed the bar menu and our team\'s expertise. We hear you on the noise levels — we\'re looking into acoustic improvements for the main bar area. In the meantime, our terrace and private dining area offer a quieter setting.' },
  { id: 9, platform: 'Google', author: 'Lucy F.', rating: 1, date: '2026-03-22', text: 'Worst experience I\'ve had eating out in London. Booked for 7pm, wasn\'t seated until 7:45. Then the food was cold when it arrived. Asked for the manager who was dismissive. I expected much better from The Ivy brand. Won\'t be returning.', sentiment: 'negative', keywords: ['slow service', 'long wait'], responded: false, aiResponse: 'Lucy, we are deeply sorry for this unacceptable experience. This is not representative of the standard we hold ourselves to. Our General Manager would like to personally address this. We\'ve sent you a direct message with their contact details. We sincerely hope to have the opportunity to make this right.' },
  { id: 10, platform: 'TripAdvisor', author: 'James B.', rating: 4, date: '2026-03-21', text: 'Solid all round. Good cocktails, nice ambience, attentive service. A bit pricey but that\'s Chelsea for you. The Negroni was one of the best I\'ve had. Would recommend for a date night.', sentiment: 'positive', keywords: ['great cocktails', 'expensive', 'great atmosphere'], responded: true },
  { id: 11, platform: 'Google', author: 'Priya S.', rating: 5, date: '2026-03-21', text: 'Incredible venue for a girls\' night out. The cocktail menu is creative and the Pornstar Martini is a must-try. Staff made us feel special all evening. Already planning our next visit!', sentiment: 'positive', keywords: ['great cocktails', 'friendly staff', 'great atmosphere'], responded: true },
  { id: 12, platform: 'TripAdvisor', author: 'Robert G.', rating: 3, date: '2026-03-20', text: 'Decent enough but nothing spectacular. Service was fine, food was okay. For the prices they charge I expected something more memorable. It felt like they\'re coasting on the brand name.', sentiment: 'neutral', keywords: ['expensive', 'overpriced'], responded: false, aiResponse: 'Robert, thank you for your candid feedback. We take this seriously and are always looking to elevate our offering. We\'ve recently revamped our spring menu and would love for you to give us another try. We\'re confident the new dishes will exceed your expectations.' },
  { id: 13, platform: 'Google', author: 'Anna C.', rating: 5, date: '2026-03-20', text: 'My go-to spot in Chelsea. The staff know me by name now and always recommend something new from the menu. The attention to detail — from the garnishes to the glassware — is what sets this place apart.', sentiment: 'positive', keywords: ['friendly staff', 'great cocktails', 'beautiful interior'], responded: true },
  { id: 14, platform: 'Google', author: 'Daniel K.', rating: 4, date: '2026-03-19', text: 'Had a business lunch here. Private dining room was impressive and the service was professional. Wine list is excellent — our Bibendum rep would approve. Slightly let down by dessert but overall very good.', sentiment: 'positive', keywords: ['beautiful interior', 'great atmosphere'], responded: true },
  { id: 15, platform: 'TripAdvisor', author: 'Sophie L.', rating: 2, date: '2026-03-19', text: 'Reserved a table for our anniversary. The host was rude when we arrived 5 minutes late and made us wait another 20 minutes. The romantic evening was ruined from the start. Cocktails were fine but the damage was done.', sentiment: 'negative', keywords: ['long wait', 'slow service'], responded: false, aiResponse: 'Sophie, we\'re truly sorry your anniversary evening started so poorly. This is not the hospitality we pride ourselves on. We\'ve addressed this with our hosting team. Please reach out to us — we\'d love to host your next special occasion properly, on us.' },
  { id: 16, platform: 'Google', author: 'Matt W.', rating: 5, date: '2026-03-18', text: 'Just discovered this place and I\'m hooked. The Old Fashioned is perfect — they use a proper large ice cube and the right amount of orange peel. Bar staff clearly passionate about what they do.', sentiment: 'positive', keywords: ['great cocktails', 'friendly staff'], responded: true },
  { id: 17, platform: 'TripAdvisor', author: 'Rebecca H.', rating: 4, date: '2026-03-18', text: 'Lovely venue, great for people watching on the terrace. Food was very good — the truffle fries are addictive. Bit noisy inside but the outdoor space makes up for it. Would return.', sentiment: 'positive', keywords: ['beautiful interior', 'amazing food', 'noisy'], responded: true },
  { id: 18, platform: 'Google', author: 'Oliver P.', rating: 5, date: '2026-03-17', text: 'The spring menu preview was exceptional. Every dish was thoughtfully crafted and the wine pairings were spot on. Charlotte from Bibendum clearly knows her stuff. This is fine dining without the pretension.', sentiment: 'positive', keywords: ['amazing food', 'great atmosphere'], responded: true },
  { id: 19, platform: 'Google', author: 'Natalie B.', rating: 3, date: '2026-03-17', text: 'It\'s a nice place but the hype doesn\'t quite match reality. Cocktails are good but I\'ve had better at Connaught Bar. Service is pleasant but not exceptional. It\'s fine — just not worth the premium.', sentiment: 'neutral', keywords: ['expensive', 'great cocktails'], responded: false, aiResponse: 'Natalie, thank you for your thoughtful comparison. We always strive to improve and hearing honest perspectives helps. We\'d love to invite you for a tasting of our new spring cocktail menu — we think it might change your mind. DM us for details.' },
  { id: 20, platform: 'TripAdvisor', author: 'George M.', rating: 1, date: '2026-03-16', text: 'Hair in my soup. When I pointed it out, the waiter just apologised and offered to bring another one. No discount, no complimentary drink, nothing. For a place this expensive, the response was shocking. Never again.', sentiment: 'negative', keywords: ['overpriced'], responded: false, aiResponse: 'George, this is deeply concerning and we sincerely apologise. A hair in your food is unacceptable, and the response you received was inadequate. We\'ve re-briefed our entire team on complaint handling. Our GM would like to speak with you personally — please email gm@ivychelsea.co.uk. We take food safety extremely seriously.' },
  { id: 21, platform: 'Google', author: 'Hannah D.', rating: 5, date: '2026-03-15', text: 'Perfect brunch spot. The eggs benedict was beautifully presented and tasted even better. Bottomless prosecco for £35 is excellent value for Chelsea. The terrace in the morning sun is heaven.', sentiment: 'positive', keywords: ['amazing food', 'beautiful interior'], responded: true },
  { id: 22, platform: 'Google', author: 'Jack T.', rating: 4, date: '2026-03-14', text: 'Great date night spot. The lighting is perfect, music is just right. My partner loved the gin selection. Only minor gripe is the dessert menu could be more adventurous. But overall a lovely evening.', sentiment: 'positive', keywords: ['great atmosphere', 'great cocktails'], responded: true },
  { id: 23, platform: 'TripAdvisor', author: 'Claire R.', rating: 5, date: '2026-03-13', text: 'Took my team here for an end-of-quarter celebration. They handled our group of 15 flawlessly. Separate tabs, dietary requirements sorted, even a personalised cocktail for our top performer. Impressed.', sentiment: 'positive', keywords: ['friendly staff', 'great cocktails'], responded: true },
  { id: 24, platform: 'Google', author: 'Ben S.', rating: 2, date: '2026-03-12', text: 'Visited on a Saturday evening. Loud music, cramped tables, and slow service. Took 30 minutes to get drinks. When they arrived, one was wrong. The place looks great but the operations need work.', sentiment: 'negative', keywords: ['slow service', 'noisy', 'long wait'], responded: false, aiResponse: 'Ben, we appreciate you taking the time to share this. Saturday evenings are our busiest period and we clearly fell short on this occasion. We\'re adding an additional bartender to the Saturday rota and reviewing our table spacing. We hope you\'ll give us another chance.' },
  { id: 25, platform: 'TripAdvisor', author: 'Zara A.', rating: 4, date: '2026-03-11', text: 'A reliable choice in Chelsea. The steak was cooked perfectly and the wine recommendation was spot on. Service was smooth. It\'s not revolutionary but it\'s consistently good, which counts for a lot.', sentiment: 'positive', keywords: ['amazing food', 'friendly staff'], responded: true },
  { id: 26, platform: 'Google', author: 'Ryan M.', rating: 5, date: '2026-03-10', text: 'Best bar experience in a while. Sat at the bar and watched the team work — they\'re like a well-oiled machine. The Penicillin cocktail was phenomenal. This is what hospitality should be.', sentiment: 'positive', keywords: ['great cocktails', 'friendly staff', 'great atmosphere'], responded: true },
  { id: 27, platform: 'Google', author: 'Nina K.', rating: 3, date: '2026-03-09', text: 'Came with high expectations but left feeling underwhelmed. The food was adequate but not exciting. Service was polite but slow. It feels like a place resting on its reputation rather than pushing boundaries.', sentiment: 'neutral', keywords: ['slow service', 'expensive'], responded: false, aiResponse: 'Nina, thank you for this feedback. We take these comments to heart and are using them to push ourselves further. Our new spring menu launching next week represents a significant step forward in creativity. We\'d love for you to experience it.' },
  { id: 28, platform: 'TripAdvisor', author: 'Paul F.', rating: 5, date: '2026-03-08', text: 'Hidden gem in Chelsea. The terrace is magical in the evening. The espresso martini flight (3 variations) is genius. Staff are warm, knowledgeable, and genuinely seem to enjoy their work.', sentiment: 'positive', keywords: ['great cocktails', 'beautiful interior', 'friendly staff'], responded: true },
  { id: 29, platform: 'Google', author: 'Karen W.', rating: 4, date: '2026-03-07', text: 'Nice place for a casual dinner. Food was tasty, drinks were well-made. Only slight issue was the temperature — it was quite cold near the entrance. But the staff noticed and moved us. Good recovery.', sentiment: 'positive', keywords: ['friendly staff', 'amazing food'], responded: true },
  { id: 30, platform: 'Google', author: 'Alex D.', rating: 2, date: '2026-03-06', text: 'Overpriced and overhyped. £18 for a gin and tonic is daylight robbery, even for Chelsea. The portions were tiny and the whole experience felt transactional rather than hospitable. Won\'t be rushing back.', sentiment: 'negative', keywords: ['overpriced', 'expensive'], responded: false, aiResponse: 'Alex, we understand your frustration with pricing. Our G&Ts use premium spirits and Fever-Tree mixers with fresh garnishes, which is reflected in the price. However, we hear your feedback about the overall experience feeling transactional. We\'re retraining our team to ensure every guest feels genuinely cared for, regardless of what they order.' },
]

const sentimentColors = { positive: C.green, neutral: C.orange, negative: C.red }
const sentimentIcons = { positive: ThumbsUp, neutral: Minus, negative: ThumbsDown }

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= rating ? '#F59E0B' : 'transparent'} color={i <= rating ? '#F59E0B' : '#333'} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterSentiment, setFilterSentiment] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [expandedReview, setExpandedReview] = useState(null)
  const [editingResponse, setEditingResponse] = useState(null)
  const [responseText, setResponseText] = useState('')

  const filtered = useMemo(() => {
    return REVIEWS.filter(r => {
      if (filterPlatform !== 'all' && r.platform !== filterPlatform) return false
      if (filterSentiment !== 'all' && r.sentiment !== filterSentiment) return false
      if (filterRating !== 'all' && r.rating !== parseInt(filterRating)) return false
      return true
    })
  }, [filterPlatform, filterSentiment, filterRating])

  const avgGoogle = (REVIEWS.filter(r => r.platform === 'Google').reduce((s, r) => s + r.rating, 0) / REVIEWS.filter(r => r.platform === 'Google').length).toFixed(1)
  const avgTrip = (REVIEWS.filter(r => r.platform === 'TripAdvisor').reduce((s, r) => s + r.rating, 0) / REVIEWS.filter(r => r.platform === 'TripAdvisor').length).toFixed(1)
  const avgAll = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)
  const positiveCount = REVIEWS.filter(r => r.sentiment === 'positive').length
  const negativeCount = REVIEWS.filter(r => r.sentiment === 'negative').length
  const unrespondedCount = REVIEWS.filter(r => !r.responded && r.rating <= 3).length
  const underThreeCount = REVIEWS.filter(r => r.rating < 3).length

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MessageSquare size={22} color={C.amber} /> Review Aggregator
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>Google + TripAdvisor reviews in one place with AI-drafted responses</p>
      </div>

      {/* Alert for low ratings */}
      {underThreeCount > 0 && (
        <div style={{ background: C.redBg, border: `1px solid ${C.red}25`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={16} color={C.red} />
          <span style={{ fontSize: 13, color: C.text }}>{underThreeCount} review{underThreeCount > 1 ? 's' : ''} under 3 stars this month — {unrespondedCount} still need a response</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid-kpi-5" style={{ marginBottom: 20 }}>
        {[
          { label: 'Combined Rating', value: avgAll, sub: `${REVIEWS.length} reviews`, icon: Star },
          { label: 'Google', value: avgGoogle, sub: `${REVIEWS.filter(r => r.platform === 'Google').length} reviews`, icon: Star },
          { label: 'TripAdvisor', value: avgTrip, sub: `${REVIEWS.filter(r => r.platform === 'TripAdvisor').length} reviews`, icon: Star },
          { label: 'Positive', value: `${Math.round((positiveCount / REVIEWS.length) * 100)}%`, sub: `${positiveCount} reviews`, color: C.green, icon: ThumbsUp },
          { label: 'Need Response', value: unrespondedCount, sub: 'Under 3 stars', color: unrespondedCount > 0 ? C.red : C.green, icon: MessageSquare },
        ].map((k, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <k.icon size={16} color={C.textMuted} />
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color || C.ink, marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Rating Trend + Keywords */}
      <div className="grid-2col" style={{ marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Rating Trend (12 Months)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ratingTrend}>
              <XAxis dataKey="month" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 5]} stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="google" stroke={C.amber} strokeWidth={2} dot={false} name="Google" />
              <Line type="monotone" dataKey="trip" stroke={C.green} strokeWidth={2} dot={false} name="TripAdvisor" />
              <Line type="monotone" dataKey="combined" stroke={C.blue} strokeWidth={2} dot={{ r: 3, fill: C.blue }} name="Combined" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Keyword Extraction (Last 30 Days)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {keywordData.map((kw, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: C.text, width: 140 }}>{kw.keyword}</span>
                <div style={{ flex: 1, height: 8, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(kw.count / 30) * 100}%`, height: '100%', borderRadius: 4,
                    background: kw.sentiment === 'positive' ? C.green : kw.sentiment === 'negative' ? C.red : C.orange,
                  }} />
                </div>
                <span style={{ fontSize: 11, color: C.textMuted, width: 30, textAlign: 'right' }}>{kw.count}</span>
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 3,
                  background: sentimentColors[kw.sentiment] + '15', color: sentimentColors[kw.sentiment],
                  textTransform: 'uppercase', fontWeight: 600,
                }}>{kw.sentiment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'Google', 'TripAdvisor'].map(p => (
            <button key={p} onClick={() => setFilterPlatform(p)} style={{
              padding: '6px 14px', borderRadius: 6, border: `1px solid ${filterPlatform === p ? C.amber : C.border}`,
              background: filterPlatform === p ? C.amberBg : 'transparent', color: filterPlatform === p ? C.amber : C.textMuted,
              fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
            }}>{p === 'all' ? 'All Platforms' : p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'positive', 'neutral', 'negative'].map(s => (
            <button key={s} onClick={() => setFilterSentiment(s)} style={{
              padding: '6px 14px', borderRadius: 6, border: `1px solid ${filterSentiment === s ? (sentimentColors[s] || C.amber) : C.border}`,
              background: filterSentiment === s ? (sentimentColors[s] || C.amber) + '10' : 'transparent',
              color: filterSentiment === s ? (sentimentColors[s] || C.amber) : C.textMuted,
              fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
            }}>{s === 'all' ? 'All Sentiment' : s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', '5', '4', '3', '2', '1'].map(r => (
            <button key={r} onClick={() => setFilterRating(r)} style={{
              padding: '6px 10px', borderRadius: 6, border: `1px solid ${filterRating === r ? C.amber : C.border}`,
              background: filterRating === r ? C.amberBg : 'transparent', color: filterRating === r ? C.amber : C.textMuted,
              fontSize: 12, cursor: 'pointer',
            }}>{r === 'all' ? 'All' : `${r}\u2605`}</button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(r => {
          const SentIcon = sentimentIcons[r.sentiment]
          const isExpanded = expandedReview === r.id
          return (
            <div key={r.id} style={{
              background: C.card, border: `1px solid ${r.rating < 3 && !r.responded ? C.red + '40' : C.border}`,
              borderRadius: 12, padding: 18, transition: 'border-color 0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: r.platform === 'Google' ? C.blueBg : C.greenBg,
                    color: r.platform === 'Google' ? C.blue : C.green, fontSize: 12, fontWeight: 700,
                  }}>{r.author.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{r.author}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: r.platform === 'Google' ? C.blue : C.green, fontWeight: 600 }}>{r.platform}</span>
                      <span style={{ fontSize: 10, color: C.textDim }}>{r.date}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                    background: sentimentColors[r.sentiment] + '15', color: sentimentColors[r.sentiment],
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}><SentIcon size={10} /> {r.sentiment}</span>
                  <StarRating rating={r.rating} />
                  {r.responded && <CheckCircle size={14} color={C.green} />}
                </div>
              </div>

              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: '8px 0' }}>{r.text}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {r.keywords.map(kw => (
                  <span key={kw} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: C.bg, color: C.textMuted, border: `1px solid ${C.border}` }}>{kw}</span>
                ))}
              </div>

              {/* Actions */}
              {!r.responded && r.aiResponse && (
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => { setExpandedReview(isExpanded ? null : r.id); setEditingResponse(null) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6,
                      background: C.amberBg, border: `1px solid ${C.amber}30`, color: C.amber,
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    <Zap size={12} /> AI Draft Response {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {isExpanded && (
                    <div style={{ marginTop: 10, background: C.bg, borderRadius: 8, padding: 14, border: `1px solid ${C.border}` }}>
                      {editingResponse === r.id ? (
                        <>
                          <textarea
                            value={responseText}
                            onChange={e => setResponseText(e.target.value)}
                            style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 12, outline: 'none', resize: 'vertical' }}
                          />
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button style={{ padding: '6px 14px', borderRadius: 6, background: C.green, border: 'none', color: '#000', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                              Post Response
                            </button>
                            <button onClick={() => setEditingResponse(null)} style={{ padding: '6px 14px', borderRadius: 6, background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 11, cursor: 'pointer' }}>
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>{r.aiResponse}</p>
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button
                              onClick={() => { setEditingResponse(r.id); setResponseText(r.aiResponse) }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 6, background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 11, cursor: 'pointer' }}
                            >
                              <Edit3 size={11} /> Edit
                            </button>
                            <button style={{ padding: '6px 14px', borderRadius: 6, background: C.green, border: 'none', color: '#000', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                              Post as-is
                            </button>
                          </div>
                        </>
                      )}
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
