import { useState } from "react"
import { Star, MapPin, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, DollarSign, Brain, Eye } from "lucide-react"

const C = {
  bg: "#0A0A0B", card: "#111113", cardHover: "#161618", border: "#1E1E21",
  amber: "#D4A853", amberBg: "rgba(212,168,83,0.08)",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.08)",
  red: "#EF4444", redBg: "rgba(239,68,68,0.08)",
  orange: "#F97316", orangeBg: "rgba(249,115,22,0.08)",
  blue: "#3B82F6",
  text: "#E5E5E5", textMuted: "#888", textDim: "#555", ink: "#fff",
}

const competitors = [
  { name: "The Wolseley", type: "Grand Caf\u00e9", location: "Piccadilly, W1", distance: "0.4mi",
    google: { current: 4.1, previous: 4.4, reviews: 4820, trend: "declining" },
    ta: { score: 4.0, rank: 312 },
    prices: { peroni: 6.80, espresso: 16.00, gt: 14.50, wine: 9.50 },
    covers: { wd: 280, we: 340 },
    strengths: ["Iconic brand", "Loyal clientele", "Breakfast institution"],
    weaknesses: ["Service complaints rising", "Perceived as dated", "Price-quality gap widening"],
    reviews: [
      { rating: 2, text: "Waited 25 minutes for drinks. Staff seemed overwhelmed.", date: "12 Mar" },
      { rating: 3, text: "Food was fine but the magic has gone. Felt rushed.", date: "9 Mar" },
    ],
    ai: "Dropped 0.3 stars in 8 weeks (4.4 \u2192 4.1). Reviews cite slow service and disengaged staff \u2014 they appear to have cut floor staff. Their dissatisfied regulars (\u00A355-70/head) are your opportunity. Target with refined brunch/all-day offer." },
  { name: "Bob Bob Ricard", type: "Fine Dining", location: "Soho, W1", distance: "0.3mi",
    google: { current: 4.5, previous: 4.5, reviews: 3240, trend: "stable" },
    ta: { score: 4.5, rank: 86 },
    prices: { peroni: null, espresso: 18.00, gt: 16.00, wine: 12.00 },
    covers: { wd: 120, we: 160 },
    strengths: ["Press for Champagne concept", "Instagram-worthy interiors", "High spend (\u00A385+/head)"],
    weaknesses: ["Tourist-heavy", "Limited weekday covers", "Niche positioning"],
    reviews: [{ rating: 5, text: "Always a treat. The champagne button never gets old.", date: "14 Mar" }],
    ai: "Maintains strong ratings in a different niche (celebration dining, \u00A385+ spend). Not a direct competitor but worth monitoring. Their experiential concept drives 40%+ of social media mentions." },
  { name: "Dishoom", type: "Indian / All-Day", location: "King\u2019s Cross, N1", distance: "2.1mi",
    google: { current: 4.4, previous: 4.4, reviews: 12800, trend: "stable" },
    ta: { score: 4.5, rank: 42 },
    prices: { peroni: 5.80, espresso: 13.00, gt: 12.50, wine: 7.50 },
    covers: { wd: 320, we: 480 },
    strengths: ["Massive volume", "Strong brand loyalty", "Excellent value perception"],
    weaknesses: ["Always overcrowded", "45-90 min waits", "Quality inconsistency at scale"],
    reviews: [{ rating: 4, text: "Excellent food but waited 1 hour 10 minutes. Worth it though.", date: "15 Mar" }],
    ai: "Runs at extraordinary volume (320-480 covers/day, \u00A332 avg). Their weakness is the wait. Customers who cannot face the queue are your opportunity. Their pricing is 15-20% below yours \u2014 they compete on value." },
  { name: "The Delaunay", type: "Grand European Caf\u00e9", location: "Aldwych, WC2", distance: "1.2mi",
    google: { current: 4.3, previous: 4.3, reviews: 3680, trend: "stable" },
    ta: { score: 4.5, rank: 128 },
    prices: { peroni: 6.50, espresso: 15.50, gt: 14.00, wine: 8.50 },
    covers: { wd: 200, we: 260 },
    strengths: ["Corbin & King pedigree", "Theatre crowd capture", "Timeless design"],
    weaknesses: ["Post-restructuring uncertainty", "Safe menu", "Limited cocktail innovation"],
    reviews: [{ rating: 4, text: "Reliable as ever. Pre-theatre set menu is good value.", date: "10 Mar" }],
    ai: "Stable but not growing. Pre-theatre set menu captures significant weekday evening trade. Cocktail list unchanged in 6 months \u2014 not competing on bar innovation." },
  { name: "Caravan", type: "All-Day / Brunch", location: "King\u2019s Cross, N1", distance: "2.0mi",
    google: { current: 4.2, previous: 4.3, reviews: 5420, trend: "declining" },
    ta: { score: 4.0, rank: 580 },
    prices: { peroni: 5.50, espresso: 12.50, gt: 11.00, wine: 7.00 },
    covers: { wd: 180, we: 300 },
    strengths: ["Brunch king", "Coffee programme", "Casual vibe"],
    weaknesses: ["Declining score", "Noise complaints", "Weak evening trade"],
    reviews: [
      { rating: 3, text: "Nothing special anymore. So noisy you cannot hear your companion.", date: "11 Mar" },
      { rating: 2, text: "Gone downhill. Service was chaotic. Food arrived at different times.", date: "8 Mar" },
    ],
    ai: "Classic overextension symptoms: declining scores, noise complaints, inconsistent service. Brunch customers (\u00A328 avg) want a quieter, more refined experience \u2014 your opportunity if you do Sunday brunch well." },
  { name: "Hawksmoor Seven Dials", type: "Steakhouse / Bar", location: "Covent Garden, WC2", distance: "0.8mi",
    google: { current: 4.6, previous: 4.6, reviews: 6100, trend: "stable" },
    ta: { score: 4.5, rank: 28 },
    prices: { peroni: 6.20, espresso: 14.50, gt: 13.50, wine: 9.00 },
    covers: { wd: 160, we: 220 },
    strengths: ["Best steakhouse in London", "Exceptional bar programme", "Strong corporate trade"],
    weaknesses: ["High price limits frequency", "Not casual drop-in", "Booking essential"],
    reviews: [{ rating: 5, text: "Bone-in rib-eye was perfection. Cocktails equally good. Worth every penny.", date: "13 Mar" }],
    ai: "Gold standard \u2014 4.6 stars, stable, consistent. Learn from their bar programme: 65% pre-dinner cocktail capture rate (vs 30-35% industry avg). Their cocktails are priced 5-10% below yours despite higher quality." },
  { name: "The Ivy Soho Brasserie", type: "Brasserie", location: "Soho, W1", distance: "0.2mi",
    google: { current: 4.2, previous: 4.2, reviews: 2980, trend: "stable" },
    ta: { score: 4.0, rank: 420 },
    prices: { peroni: 6.30, espresso: 14.00, gt: 13.00, wine: 8.00 },
    covers: { wd: 150, we: 200 },
    strengths: ["Brand recognition", "Accessible price point", "Good location"],
    weaknesses: ["Brand dilution", "Mediocre reviews", "Feels corporate"],
    reviews: [{ rating: 3, text: "Perfectly acceptable but nothing memorable. Could be any chain.", date: "14 Mar" }],
    ai: "Brand is diluted. Customers call it corporate and chain-like. Pricing very close to yours. Differentiate by emphasising independent status, chef-led approach, personalised service \u2014 everything they have lost." },
  { name: "Bar Termini", type: "Italian Cocktail Bar", location: "Soho, W1", distance: "0.15mi",
    google: { current: 4.5, previous: 4.5, reviews: 1240, trend: "stable" },
    ta: { score: 4.5, rank: 95 },
    prices: { peroni: null, espresso: 15.00, gt: 14.00, wine: null },
    covers: { wd: 60, we: 90 },
    strengths: ["World-class cocktails", "50 Best Bars listed", "Negroni mastery"],
    weaknesses: ["Tiny venue (30 seats)", "No food", "Cannot scale"],
    reviews: [{ rating: 5, text: "Best Negroni in London. Possibly the world. Tiny but magical.", date: "16 Mar" }],
    ai: "Not a revenue competitor (30 seats) but a quality benchmark. Their Negroni recipe is worth studying. Consider a collaboration or shared event \u2014 their brand halo would benefit yours." },
]

const yourPrices = { peroni: 6.20, espresso: 14.00, gt: 13.00, wine: 8.00 }

function SC({ title, icon: Icon, children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {title && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>{Icon && <Icon size={16} color={C.amber} />}<div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</div></div>}
      {children}
    </div>
  )
}

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(rating) ? "#FBBF24" : "none"} color={i < Math.floor(rating) ? "#FBBF24" : C.textDim} />)}
      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginLeft: 4, fontFamily: "'JetBrains Mono', monospace" }}>{rating.toFixed(1)}</span>
    </div>
  )
}

function CompCard({ comp, expanded, onToggle }) {
  const chg = comp.google.current - comp.google.previous
  return (
    <div style={{ background: expanded ? C.cardHover : C.card, border: `1px solid ${expanded ? C.amber + "30" : C.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div onClick={onToggle} style={{ padding: "16px 18px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{comp.name}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: C.bg, color: C.textMuted, border: `1px solid ${C.border}` }}>{comp.type}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: C.textMuted }}>
              <span><MapPin size={10} style={{ display: "inline", verticalAlign: "middle" }} /> {comp.location}</span>
              <span>{comp.distance}</span>
              <span>{comp.google.reviews.toLocaleString()} reviews</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <Stars rating={comp.google.current} />
              {chg !== 0 && <div style={{ fontSize: 10, color: chg < 0 ? C.red : C.green, marginTop: 2 }}>{chg > 0 ? "+" : ""}{chg.toFixed(1)} (was {comp.google.previous})</div>}
            </div>
            {expanded ? <ChevronUp size={16} color={C.textDim} /> : <ChevronDown size={16} color={C.textDim} />}
          </div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 18px 18px" }}>
          <div className="grid-kpi-4" style={{ marginBottom: 14 }}>
            {[["Weekday Covers", comp.covers.wd], ["Weekend Covers", comp.covers.we], ["TripAdvisor", `${comp.ta.score} (#${comp.ta.rank})`], ["Trend", comp.google.trend]].map(([label, val], i) => (
              <div key={i} style={{ background: C.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: i === 3 ? 12 : 18, fontWeight: i === 3 ? 600 : 700, color: i === 3 ? (val === "declining" ? C.red : val === "improving" ? C.green : C.orange) : C.ink, fontFamily: i < 3 ? "'JetBrains Mono', monospace" : "inherit", textTransform: i === 3 ? "capitalize" : "none" }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Price Comparison</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["Peroni", comp.prices.peroni, yourPrices.peroni], ["Espresso Martini", comp.prices.espresso, yourPrices.espresso], ["G&T", comp.prices.gt, yourPrices.gt], ["House Wine", comp.prices.wine, yourPrices.wine]].map(([label, theirs, yours], i) => {
                const diff = theirs ? ((theirs - yours) / yours * 100).toFixed(0) : null
                return (
                  <div key={i} style={{ flex: "1 1 120px", padding: "8px 10px", borderRadius: 6, background: C.bg, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>{label}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{theirs ? `\u00A3${theirs.toFixed(2)}` : "N/A"}</span>
                    {diff && <span style={{ fontSize: 10, color: parseFloat(diff) > 0 ? C.green : parseFloat(diff) < 0 ? C.red : C.textDim, marginLeft: 6 }}>{parseFloat(diff) > 0 ? "+" : ""}{diff}%</span>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="grid-2col" style={{ marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.green, textTransform: "uppercase", marginBottom: 6 }}>Strengths</div>
              {comp.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: C.text, padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: C.green }} />{s}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: "uppercase", marginBottom: 6 }}>Weaknesses</div>
              {comp.weaknesses.map((w, i) => <div key={i} style={{ fontSize: 12, color: C.text, padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: C.red }} />{w}</div>)}
            </div>
          </div>
          {comp.reviews.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Recent Reviews</div>
              {comp.reviews.map((r, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: C.bg, marginBottom: 6, borderLeft: `3px solid ${r.rating >= 4 ? C.green : r.rating >= 3 ? C.orange : C.red}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><Stars rating={r.rating} /><span style={{ fontSize: 10, color: C.textDim }}>{r.date}</span></div>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5, fontStyle: "italic" }}>&ldquo;{r.text}&rdquo;</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ padding: "12px 14px", borderRadius: 8, background: "linear-gradient(135deg, rgba(212,168,83,0.06), rgba(212,168,83,0.02))", border: "1px solid rgba(212,168,83,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Brain size={14} color={C.amber} /><span style={{ fontSize: 11, fontWeight: 600, color: C.amber }}>AI Competitive Insight</span></div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{comp.ai}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CompetitorWatch() {
  const [expandedIdx, setExpandedIdx] = useState(0)
  const withPeroni = competitors.filter(c => c.prices.peroni)
  const withEspresso = competitors.filter(c => c.prices.espresso)
  const avgEspresso = withEspresso.reduce((s, c) => s + c.prices.espresso, 0) / withEspresso.length
  const declining = competitors.filter(c => c.google.trend === "declining")

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>Competitor Watch</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Tracking {competitors.length} nearby venues &mdash; Updated weekly</div>
      </div>

      <div className="grid-kpi-4" style={{ marginBottom: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Venues Tracked</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{competitors.length}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Declining Ratings</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: declining.length > 0 ? C.amber : C.green, fontFamily: "'JetBrains Mono', monospace" }}>{declining.length}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{declining.map(c => c.name.split(" ").slice(0, 2).join(" ")).join(", ") || "None"}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Your Price Position</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Mid-Market</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Avg Espresso Martini: &pound;{avgEspresso.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: yourPrices.espresso < avgEspresso ? C.green : C.orange }}>You: &pound;{yourPrices.espresso.toFixed(2)}</div>
        </div>
        <div style={{ background: declining.length > 0 ? C.amberBg : C.card, border: `1px solid ${declining.length > 0 ? C.amber + "30" : C.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Opportunity</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.amber, lineHeight: 1.5 }}>
            {declining.length > 0 ? `${declining[0].name} dropped ${Math.abs(declining[0].google.current - declining[0].google.previous).toFixed(1)} stars. Capture their customers.` : "No immediate opportunities."}
          </div>
        </div>
      </div>

      <SC title="Price Benchmarking" icon={DollarSign} style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Venue", "Peroni", "Espresso Martini", "G&T", "House Wine", "Google"].map(h => <th key={h} style={{ textAlign: h === "Venue" ? "left" : "right", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
            <tbody>
              <tr style={{ background: C.amberBg }}>
                <td style={{ padding: "10px", fontSize: 12, fontWeight: 600, color: C.amber, borderBottom: `1px solid ${C.border}` }}>Your Venue</td>
                {["peroni", "espresso", "gt", "wine"].map(k => <td key={k} style={{ padding: "10px", fontSize: 12, textAlign: "right", fontWeight: 600, color: C.amber, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${C.border}` }}>&pound;{yourPrices[k].toFixed(2)}</td>)}
                <td style={{ padding: "10px", textAlign: "center", fontWeight: 600, color: C.amber, borderBottom: `1px solid ${C.border}` }}>4.3</td>
              </tr>
              {competitors.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", fontSize: 12, color: C.text, borderBottom: `1px solid ${C.border}` }}>{c.name}</td>
                  {["peroni", "espresso", "gt", "wine"].map(k => <td key={k} style={{ padding: "10px", fontSize: 12, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: c.prices[k] ? C.text : C.textDim, borderBottom: `1px solid ${C.border}` }}>{c.prices[k] ? `\u00A3${c.prices[k].toFixed(2)}` : "\u2014"}</td>)}
                  <td style={{ padding: "10px", textAlign: "center", fontWeight: 600, color: c.google.current >= 4.5 ? C.green : C.text, borderBottom: `1px solid ${C.border}` }}>{c.google.current}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.bg, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: C.amber }}>AI: </span>
          Your Espresso Martini at &pound;14.00 is below market average (&pound;{avgEspresso.toFixed(2)}). As your highest-margin item, a &pound;0.50 increase adds &pound;40/week with negligible demand impact. G&amp;T pricing is competitive. Peroni in line with market.
        </div>
      </SC>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {competitors.map((c, i) => <CompCard key={i} comp={c} expanded={expandedIdx === i} onToggle={() => setExpandedIdx(expandedIdx === i ? -1 : i)} />)}
      </div>

      <SC title="AI Competitive Summary" icon={Brain} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>
          <p style={{ marginBottom: 12 }}><strong style={{ color: C.ink }}>Market Position:</strong> You sit mid-market by pricing. Your Google 4.3 is competitive but not leading. Small service consistency improvements could push you to 4.5 \u2014 top quartile of your competitive set.</p>
          <p style={{ marginBottom: 12 }}><strong style={{ color: C.ink }}>Immediate Opportunity:</strong> The Wolseley (4.4 &rarr; 4.1) and Caravan are both declining. The Wolseley&apos;s customer profile matches your target: &pound;55-70/head, regular diners, experience-focused. Their service complaints suggest staffing cuts. Position yourself as the reliable alternative.</p>
          <p style={{ marginBottom: 12 }}><strong style={{ color: C.ink }}>Pricing Action:</strong> Room to increase Espresso Martini by &pound;0.50-1.00. At 81 units/week, &pound;0.50 = &pound;40.50/week (&pound;2,106/year) at nearly 100% margin.</p>
          <p><strong style={{ color: C.ink }}>Learning Point:</strong> Hawksmoor&apos;s 65% pre-dinner cocktail capture is best in class (your est: 35-40%). Matching it would add ~&pound;680-780/week in cocktail revenue. Requires: better bar seating, table-side menu presentation, staff trained to recommend before food ordering.</p>
        </div>
      </SC>
    </div>
  )
}
