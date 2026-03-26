import { useState, useMemo } from 'react'
import { MapPin, PoundSterling, TrendingUp, Building2, Calculator, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const C = {
  bg: '#0A0A0B', card: '#111113', border: '#1E1E21',
  amber: '#D4A853', amberBg: 'rgba(212,168,83,0.08)',
  green: '#22C55E', greenBg: 'rgba(34,197,94,0.08)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.08)',
  orange: '#F97316', blue: '#3B82F6', teal: '#14B8A6',
  text: '#E5E5E5', textMuted: '#888', textDim: '#555', ink: '#fff',
}

const scenarios = [
  {
    name: 'Venue #6: Notting Hill', location: 'Notting Hill, W11', type: 'Cocktail Bar & Restaurant',
    setupCost: 480000, monthlyRent: 18000, staffCount: 14, monthlyLabour: 58000,
    projectedRevenue: 175000, breakEvenMonth: 8, projectedEbitda: 28000,
    yearOneROI: -12, yearTwoROI: 22, risk: 'medium',
    notes: 'High footfall area, strong weekend trade. Competition from 3 existing cocktail bars within 500m.',
    projection: Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`, revenue: Math.round(95000 + (i * 7500) + Math.random() * 10000),
      costs: Math.round(145000 - (i * 2000) + Math.random() * 5000),
    })),
  },
  {
    name: 'Venue #6: Shoreditch', location: 'Shoreditch, E1', type: 'Bar & Late-Night Venue',
    setupCost: 350000, monthlyRent: 14000, staffCount: 11, monthlyLabour: 44000,
    projectedRevenue: 155000, breakEvenMonth: 6, projectedEbitda: 32000,
    yearOneROI: 8, yearTwoROI: 35, risk: 'low',
    notes: 'Lower setup cost, strong late-night economy. Younger demographic with higher cocktail spend per head.',
    projection: Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`, revenue: Math.round(85000 + (i * 6500) + Math.random() * 8000),
      costs: Math.round(115000 - (i * 2500) + Math.random() * 4000),
    })),
  },
  {
    name: 'Venue #6: Richmond', location: 'Richmond, TW9', type: 'Restaurant & Terrace Bar',
    setupCost: 550000, monthlyRent: 22000, staffCount: 16, monthlyLabour: 66000,
    projectedRevenue: 195000, breakEvenMonth: 10, projectedEbitda: 24000,
    yearOneROI: -18, yearTwoROI: 15, risk: 'high',
    notes: 'Premium location with seasonal terrace trade. High setup cost but strong brand alignment. Winter months challenging.',
    projection: Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`, revenue: Math.round(100000 + (i * 8000) + Math.random() * 15000),
      costs: Math.round(165000 - (i * 1500) + Math.random() * 6000),
    })),
  },
]

const londonAreas = [
  {
    name: 'City of London', postcode: 'EC1-EC4',
    bestFor: ['Restaurant', 'Wine Bar', 'All-day Caf\u00e9'],
    rents: { 2021: 72, 2022: 78, 2023: 88, 2024: 95, 2025: 100 },
    vacancy: { 2021: 12.5, 2022: 9.8, 2023: 7.2, 2024: 5.8, 2025: 5.1 },
    leaseYears: 10, keyMoney: 150000, businessRates: 45000,
    footfall: 'high', hospitalityDensity: 320,
  },
  {
    name: 'Shoreditch', postcode: 'E1/EC2A',
    bestFor: ['Cocktail Bar', 'Late-Night Venue', 'Caf\u00e9'],
    rents: { 2021: 42, 2022: 48, 2023: 55, 2024: 62, 2025: 68 },
    vacancy: { 2021: 8.2, 2022: 6.1, 2023: 4.5, 2024: 3.8, 2025: 3.2 },
    leaseYears: 5, keyMoney: 80000, businessRates: 28000,
    footfall: 'high', hospitalityDensity: 285,
  },
  {
    name: 'Soho', postcode: 'W1D/W1F',
    bestFor: ['Cocktail Bar', 'Restaurant', 'Members Club'],
    rents: { 2021: 85, 2022: 95, 2023: 110, 2024: 125, 2025: 135 },
    vacancy: { 2021: 14.0, 2022: 10.5, 2023: 6.8, 2024: 4.2, 2025: 3.5 },
    leaseYears: 10, keyMoney: 250000, businessRates: 62000,
    footfall: 'high', hospitalityDensity: 410,
  },
  {
    name: 'Covent Garden', postcode: 'WC2',
    bestFor: ['Restaurant', 'Cocktail Bar', 'Wine Bar'],
    rents: { 2021: 90, 2022: 100, 2023: 115, 2024: 128, 2025: 140 },
    vacancy: { 2021: 15.2, 2022: 11.0, 2023: 7.5, 2024: 5.0, 2025: 3.8 },
    leaseYears: 10, keyMoney: 300000, businessRates: 70000,
    footfall: 'high', hospitalityDensity: 350,
  },
  {
    name: 'Mayfair', postcode: 'W1J/W1K',
    bestFor: ['Fine Dining', 'Members Club', 'Wine Bar'],
    rents: { 2021: 110, 2022: 120, 2023: 135, 2024: 145, 2025: 155 },
    vacancy: { 2021: 10.0, 2022: 7.5, 2023: 5.5, 2024: 4.0, 2025: 3.0 },
    leaseYears: 15, keyMoney: 500000, businessRates: 95000,
    footfall: 'medium', hospitalityDensity: 180,
  },
  {
    name: 'Marylebone', postcode: 'W1U',
    bestFor: ['Restaurant', 'Wine Bar', 'Caf\u00e9'],
    rents: { 2021: 65, 2022: 72, 2023: 80, 2024: 88, 2025: 92 },
    vacancy: { 2021: 9.0, 2022: 7.2, 2023: 5.8, 2024: 4.5, 2025: 4.0 },
    leaseYears: 10, keyMoney: 120000, businessRates: 38000,
    footfall: 'medium', hospitalityDensity: 145,
  },
  {
    name: 'Fitzrovia', postcode: 'W1T',
    bestFor: ['Restaurant', 'Cocktail Bar', 'All-day Caf\u00e9'],
    rents: { 2021: 58, 2022: 65, 2023: 74, 2024: 82, 2025: 88 },
    vacancy: { 2021: 10.5, 2022: 8.0, 2023: 6.0, 2024: 4.8, 2025: 4.2 },
    leaseYears: 10, keyMoney: 100000, businessRates: 35000,
    footfall: 'medium', hospitalityDensity: 165,
  },
  {
    name: "King's Cross", postcode: 'N1C',
    bestFor: ['Restaurant', 'All-day Caf\u00e9', 'Pub'],
    rents: { 2021: 48, 2022: 55, 2023: 65, 2024: 72, 2025: 78 },
    vacancy: { 2021: 7.5, 2022: 5.5, 2023: 4.0, 2024: 3.2, 2025: 2.8 },
    leaseYears: 10, keyMoney: 90000, businessRates: 32000,
    footfall: 'high', hospitalityDensity: 120,
  },
  {
    name: 'Clerkenwell', postcode: 'EC1R',
    bestFor: ['Cocktail Bar', 'Restaurant', 'Wine Bar'],
    rents: { 2021: 48, 2022: 55, 2023: 62, 2024: 68, 2025: 72 },
    vacancy: { 2021: 11.0, 2022: 8.5, 2023: 6.5, 2024: 5.2, 2025: 4.5 },
    leaseYears: 10, keyMoney: 85000, businessRates: 30000,
    footfall: 'medium', hospitalityDensity: 155,
  },
  {
    name: 'Bermondsey', postcode: 'SE1/SE16',
    bestFor: ['Wine Bar', 'Taproom', 'Restaurant'],
    rents: { 2021: 28, 2022: 32, 2023: 38, 2024: 44, 2025: 48 },
    vacancy: { 2021: 9.5, 2022: 7.0, 2023: 5.5, 2024: 4.2, 2025: 3.8 },
    leaseYears: 5, keyMoney: 40000, businessRates: 18000,
    footfall: 'medium', hospitalityDensity: 95,
  },
  {
    name: 'Brixton', postcode: 'SW9',
    bestFor: ['Bar', 'Street Food', 'Late-Night Venue'],
    rents: { 2021: 28, 2022: 32, 2023: 36, 2024: 40, 2025: 44 },
    vacancy: { 2021: 8.0, 2022: 6.5, 2023: 5.0, 2024: 4.5, 2025: 4.0 },
    leaseYears: 5, keyMoney: 35000, businessRates: 16000,
    footfall: 'high', hospitalityDensity: 110,
  },
  {
    name: 'Hackney', postcode: 'E8/E9',
    bestFor: ['Caf\u00e9', 'Cocktail Bar', 'Pub'],
    rents: { 2021: 32, 2022: 38, 2023: 44, 2024: 50, 2025: 55 },
    vacancy: { 2021: 7.5, 2022: 5.8, 2023: 4.2, 2024: 3.5, 2025: 3.0 },
    leaseYears: 5, keyMoney: 50000, businessRates: 20000,
    footfall: 'medium', hospitalityDensity: 175,
  },
  {
    name: 'Dalston', postcode: 'E8',
    bestFor: ['Late-Night Bar', 'Cocktail Bar', 'Pub'],
    rents: { 2021: 25, 2022: 30, 2023: 36, 2024: 42, 2025: 48 },
    vacancy: { 2021: 9.0, 2022: 7.0, 2023: 5.5, 2024: 4.0, 2025: 3.5 },
    leaseYears: 5, keyMoney: 35000, businessRates: 15000,
    footfall: 'medium', hospitalityDensity: 130,
  },
  {
    name: 'Peckham', postcode: 'SE15',
    bestFor: ['Rooftop Bar', 'Caf\u00e9', 'Street Food'],
    rents: { 2021: 22, 2022: 26, 2023: 32, 2024: 38, 2025: 42 },
    vacancy: { 2021: 10.0, 2022: 7.5, 2023: 5.5, 2024: 4.0, 2025: 3.5 },
    leaseYears: 5, keyMoney: 25000, businessRates: 14000,
    footfall: 'medium', hospitalityDensity: 85,
  },
  {
    name: 'Clapham', postcode: 'SW4',
    bestFor: ['Pub', 'Brunch Spot', 'Cocktail Bar'],
    rents: { 2021: 38, 2022: 42, 2023: 48, 2024: 52, 2025: 55 },
    vacancy: { 2021: 6.5, 2022: 5.0, 2023: 4.2, 2024: 3.8, 2025: 3.5 },
    leaseYears: 10, keyMoney: 65000, businessRates: 22000,
    footfall: 'high', hospitalityDensity: 160,
  },
  {
    name: 'Battersea', postcode: 'SW11',
    bestFor: ['Restaurant', 'All-day Caf\u00e9', 'Wine Bar'],
    rents: { 2021: 35, 2022: 40, 2023: 48, 2024: 55, 2025: 60 },
    vacancy: { 2021: 8.0, 2022: 6.0, 2023: 4.5, 2024: 3.5, 2025: 3.0 },
    leaseYears: 10, keyMoney: 70000, businessRates: 24000,
    footfall: 'medium', hospitalityDensity: 90,
  },
  {
    name: 'Notting Hill', postcode: 'W11',
    bestFor: ['Restaurant', 'Cocktail Bar', 'Wine Bar'],
    rents: { 2021: 68, 2022: 75, 2023: 85, 2024: 92, 2025: 98 },
    vacancy: { 2021: 9.5, 2022: 7.0, 2023: 5.0, 2024: 4.0, 2025: 3.5 },
    leaseYears: 10, keyMoney: 140000, businessRates: 40000,
    footfall: 'high', hospitalityDensity: 155,
  },
  {
    name: 'Camden', postcode: 'NW1',
    bestFor: ['Pub', 'Live Music Venue', 'Street Food'],
    rents: { 2021: 42, 2022: 48, 2023: 52, 2024: 56, 2025: 58 },
    vacancy: { 2021: 7.0, 2022: 5.5, 2023: 4.5, 2024: 4.0, 2025: 3.8 },
    leaseYears: 5, keyMoney: 55000, businessRates: 22000,
    footfall: 'high', hospitalityDensity: 195,
  },
  {
    name: 'Islington', postcode: 'N1',
    bestFor: ['Pub', 'Restaurant', 'Cocktail Bar'],
    rents: { 2021: 50, 2022: 56, 2023: 62, 2024: 68, 2025: 72 },
    vacancy: { 2021: 7.5, 2022: 6.0, 2023: 4.8, 2024: 4.0, 2025: 3.5 },
    leaseYears: 10, keyMoney: 80000, businessRates: 28000,
    footfall: 'high', hospitalityDensity: 175,
  },
  {
    name: 'Canary Wharf', postcode: 'E14',
    bestFor: ['Restaurant', 'Wine Bar', 'All-day Caf\u00e9'],
    rents: { 2021: 55, 2022: 50, 2023: 45, 2024: 42, 2025: 44 },
    vacancy: { 2021: 18.0, 2022: 15.5, 2023: 13.0, 2024: 11.5, 2025: 10.0 },
    leaseYears: 15, keyMoney: 60000, businessRates: 32000,
    footfall: 'medium', hospitalityDensity: 75,
  },
  {
    name: 'Stratford', postcode: 'E15/E20',
    bestFor: ['Restaurant', 'Pub', 'All-day Caf\u00e9'],
    rents: { 2021: 30, 2022: 34, 2023: 38, 2024: 42, 2025: 45 },
    vacancy: { 2021: 12.0, 2022: 9.5, 2023: 7.5, 2024: 6.0, 2025: 5.0 },
    leaseYears: 10, keyMoney: 40000, businessRates: 18000,
    footfall: 'high', hospitalityDensity: 65,
  },
  {
    name: 'Whitechapel', postcode: 'E1',
    bestFor: ['Caf\u00e9', 'Restaurant', 'Bar'],
    rents: { 2021: 28, 2022: 32, 2023: 38, 2024: 44, 2025: 50 },
    vacancy: { 2021: 10.5, 2022: 8.0, 2023: 6.0, 2024: 4.5, 2025: 3.8 },
    leaseYears: 5, keyMoney: 35000, businessRates: 16000,
    footfall: 'medium', hospitalityDensity: 100,
  },
  {
    name: 'Borough / London Bridge', postcode: 'SE1',
    bestFor: ['Restaurant', 'Wine Bar', 'All-day Caf\u00e9'],
    rents: { 2021: 55, 2022: 62, 2023: 72, 2024: 80, 2025: 88 },
    vacancy: { 2021: 11.0, 2022: 8.5, 2023: 6.0, 2024: 4.5, 2025: 3.8 },
    leaseYears: 10, keyMoney: 110000, businessRates: 36000,
    footfall: 'high', hospitalityDensity: 210,
  },
  {
    name: 'Victoria', postcode: 'SW1',
    bestFor: ['Restaurant', 'All-day Caf\u00e9', 'Pub'],
    rents: { 2021: 70, 2022: 78, 2023: 86, 2024: 92, 2025: 95 },
    vacancy: { 2021: 13.0, 2022: 10.0, 2023: 7.5, 2024: 5.5, 2025: 4.5 },
    leaseYears: 10, keyMoney: 130000, businessRates: 42000,
    footfall: 'high', hospitalityDensity: 130,
  },
  {
    name: 'Chelsea', postcode: 'SW3/SW10',
    bestFor: ['Fine Dining', 'Wine Bar', 'Brunch Spot'],
    rents: { 2021: 80, 2022: 88, 2023: 98, 2024: 108, 2025: 115 },
    vacancy: { 2021: 8.5, 2022: 6.5, 2023: 5.0, 2024: 4.0, 2025: 3.5 },
    leaseYears: 10, keyMoney: 200000, businessRates: 52000,
    footfall: 'medium', hospitalityDensity: 140,
  },
  {
    name: 'Fulham', postcode: 'SW6',
    bestFor: ['Pub', 'Brunch Spot', 'Wine Bar'],
    rents: { 2021: 40, 2022: 44, 2023: 50, 2024: 55, 2025: 58 },
    vacancy: { 2021: 7.0, 2022: 5.5, 2023: 4.5, 2024: 3.8, 2025: 3.5 },
    leaseYears: 10, keyMoney: 55000, businessRates: 20000,
    footfall: 'medium', hospitalityDensity: 120,
  },
  {
    name: "Shepherd's Bush", postcode: 'W12',
    bestFor: ['Pub', 'Restaurant', 'Late-Night Bar'],
    rents: { 2021: 35, 2022: 38, 2023: 42, 2024: 46, 2025: 48 },
    vacancy: { 2021: 8.5, 2022: 7.0, 2023: 5.5, 2024: 4.8, 2025: 4.2 },
    leaseYears: 5, keyMoney: 40000, businessRates: 18000,
    footfall: 'high', hospitalityDensity: 95,
  },
  {
    name: 'Balham', postcode: 'SW12',
    bestFor: ['Pub', 'Brunch Spot', 'Wine Bar'],
    rents: { 2021: 32, 2022: 36, 2023: 40, 2024: 44, 2025: 46 },
    vacancy: { 2021: 6.0, 2022: 5.0, 2023: 4.2, 2024: 3.8, 2025: 3.5 },
    leaseYears: 5, keyMoney: 35000, businessRates: 15000,
    footfall: 'medium', hospitalityDensity: 85,
  },
  {
    name: 'Tooting', postcode: 'SW17',
    bestFor: ['Caf\u00e9', 'Street Food', 'Pub'],
    rents: { 2021: 22, 2022: 26, 2023: 30, 2024: 34, 2025: 38 },
    vacancy: { 2021: 7.5, 2022: 6.0, 2023: 5.0, 2024: 4.2, 2025: 3.8 },
    leaseYears: 5, keyMoney: 20000, businessRates: 12000,
    footfall: 'high', hospitalityDensity: 75,
  },
  {
    name: 'Elephant & Castle', postcode: 'SE1/SE17',
    bestFor: ['Caf\u00e9', 'Restaurant', 'Bar'],
    rents: { 2021: 25, 2022: 30, 2023: 36, 2024: 42, 2025: 48 },
    vacancy: { 2021: 14.0, 2022: 11.0, 2023: 8.0, 2024: 6.0, 2025: 4.5 },
    leaseYears: 10, keyMoney: 30000, businessRates: 15000,
    footfall: 'high', hospitalityDensity: 60,
  },
]

function getAreaMetrics(area, year) {
  const rent = area.rents[year]
  const prevRent = area.rents[year - 1]
  const yoyChange = prevRent ? ((rent - prevRent) / prevRent * 100).toFixed(1) : null
  const fiveYearChange = area.rents[2021] ? ((area.rents[2025] - area.rents[2021]) / area.rents[2021] * 100).toFixed(1) : null
  return { rent, vacancy: area.vacancy[year], yoyChange, fiveYearChange }
}

function getLondonAggregates(year) {
  const rents = londonAreas.map(a => a.rents[year])
  const vacancies = londonAreas.map(a => a.vacancy[year])
  const avgRent = (rents.reduce((s, r) => s + r, 0) / rents.length).toFixed(0)
  const avgVacancy = (vacancies.reduce((s, v) => s + v, 0) / vacancies.length).toFixed(1)
  const cheapest = londonAreas.reduce((min, a) => a.rents[year] < min.rents[year] ? a : min, londonAreas[0])
  const mostExpensive = londonAreas.reduce((max, a) => a.rents[year] > max.rents[year] ? a : max, londonAreas[0])
  const fastestRising = londonAreas.reduce((best, a) => {
    const change = (a.rents[2025] - a.rents[2021]) / a.rents[2021]
    const bestChange = (best.rents[2025] - best.rents[2021]) / best.rents[2021]
    return change > bestChange ? a : best
  }, londonAreas[0])
  const fastestRisingPct = ((fastestRising.rents[2025] - fastestRising.rents[2021]) / fastestRising.rents[2021] * 100).toFixed(0)
  return { avgRent, avgVacancy, cheapest, mostExpensive, fastestRising, fastestRisingPct }
}

function getOpportunityColor(area, year) {
  const rent = area.rents[year]
  const footfallScore = area.footfall === 'high' ? 3 : area.footfall === 'medium' ? 2 : 1
  if (rent <= 50 && footfallScore >= 2) return C.green
  if (rent <= 70 && footfallScore >= 2) return C.amber
  if (rent > 100) return C.red
  return C.textMuted
}

const riskColors = { low: C.green, medium: C.orange, high: C.red }
const footfallColors = { high: C.green, medium: C.amber, low: C.red }
const TABS = ['Expansion Modelling', 'London Commercial Real Estate']

export default function Expansion() {
  const [activeTab, setActiveTab] = useState(1)
  const [selectedScenario, setSelectedScenario] = useState(0)
  const scenario = scenarios[selectedScenario]

  const [selectedYear, setSelectedYear] = useState(2025)
  const [sortField, setSortField] = useState('rent')
  const [sortDir, setSortDir] = useState('asc')
  const [budgetMax, setBudgetMax] = useState(200)
  const [expandedArea, setExpandedArea] = useState(null)
  const [chartAreas, setChartAreas] = useState(['Soho', 'Shoreditch', 'Brixton', 'Peckham', 'Canary Wharf'])
  const [showChartPicker, setShowChartPicker] = useState(false)

  const agg = useMemo(() => getLondonAggregates(selectedYear), [selectedYear])

  const filteredAreas = useMemo(() => {
    let areas = londonAreas.filter(a => a.rents[selectedYear] <= budgetMax)
    areas.sort((a, b) => {
      let va, vb
      if (sortField === 'rent') { va = a.rents[selectedYear]; vb = b.rents[selectedYear] }
      else if (sortField === 'vacancy') { va = a.vacancy[selectedYear]; vb = b.vacancy[selectedYear] }
      else if (sortField === 'footfall') {
        const scores = { high: 3, medium: 2, low: 1 }
        va = scores[a.footfall]; vb = scores[b.footfall]
      } else if (sortField === 'density') { va = a.hospitalityDensity; vb = b.hospitalityDensity }
      else if (sortField === 'name') { va = a.name; vb = b.name }
      else if (sortField === 'fiveYr') {
        va = (a.rents[2025] - a.rents[2021]) / a.rents[2021]
        vb = (b.rents[2025] - b.rents[2021]) / b.rents[2021]
      }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return areas
  }, [selectedYear, sortField, sortDir, budgetMax])

  const rentChartData = useMemo(() => {
    return [2021, 2022, 2023, 2024, 2025].map(year => {
      const point = { year: year.toString() }
      chartAreas.forEach(name => {
        const area = londonAreas.find(a => a.name === name)
        if (area) point[name] = area.rents[year]
      })
      return point
    })
  }, [chartAreas])

  const vacancyChartData = useMemo(() => {
    return [2021, 2022, 2023, 2024, 2025].map(year => {
      const avg = londonAreas.reduce((s, a) => s + a.vacancy[year], 0) / londonAreas.length
      return { year: year.toString(), average: parseFloat(avg.toFixed(1)) }
    })
  }, [])

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortHeader = ({ field, label }) => (
    <th onClick={() => handleSort(field)} style={{
      cursor: 'pointer', padding: '10px 8px', textAlign: 'left', fontSize: 11,
      fontWeight: 600, color: sortField === field ? C.amber : C.textMuted, borderBottom: `1px solid ${C.border}`,
      userSelect: 'none', whiteSpace: 'nowrap',
    }}>
      {label} {sortField === field ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
    </th>
  )

  const chartColors = [C.amber, C.teal, C.blue, C.green, C.orange, C.red, '#8B5CF6', '#EC4899']

  return (
    <div className="animate-in">
      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{
            padding: '12px 20px', fontSize: 13, fontWeight: activeTab === i ? 700 : 400,
            color: activeTab === i ? C.amber : C.textMuted, background: 'transparent', border: 'none',
            borderBottom: activeTab === i ? `2px solid ${C.amber}` : '2px solid transparent',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 6, fontFamily: 'Georgia, serif' }}>
            Expansion Modelling
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>
            What would venue #6 look like? Compare scenarios side-by-side.
          </div>

          <div className="grid-kpi" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
            {scenarios.map((s, i) => (
              <div key={i} onClick={() => setSelectedScenario(i)} style={{
                background: selectedScenario === i ? C.amberBg : C.card,
                border: `1px solid ${selectedScenario === i ? C.amber : C.border}`,
                borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{s.name}</div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    color: riskColors[s.risk], background: riskColors[s.risk] + '15', textTransform: 'uppercase',
                  }}>{s.risk} risk</span>
                </div>
                <div style={{ fontSize: 11, color: C.textDim, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  <MapPin size={10} />{s.location} &bull; {s.type}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                  <div><span style={{ color: C.textDim }}>Setup:</span> <span style={{ color: C.ink, fontWeight: 600 }}>{'\u00a3'}{(s.setupCost / 1000).toFixed(0)}k</span></div>
                  <div><span style={{ color: C.textDim }}>Break-even:</span> <span style={{ color: C.amber, fontWeight: 600 }}>Month {s.breakEvenMonth}</span></div>
                  <div><span style={{ color: C.textDim }}>EBITDA:</span> <span style={{ color: C.green, fontWeight: 600 }}>{'\u00a3'}{(s.projectedEbitda / 1000).toFixed(0)}k/mo</span></div>
                  <div><span style={{ color: C.textDim }}>Y2 ROI:</span> <span style={{ color: s.yearTwoROI > 0 ? C.green : C.red, fontWeight: 600 }}>{s.yearTwoROI}%</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2col" style={{ marginBottom: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>12-Month Revenue vs Costs Projection</div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={scenario.projection}>
                  <defs>
                    <linearGradient id="expGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.red} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
                  <XAxis dataKey="month" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00a3${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                    formatter={v => [`\u00a3${v.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="revenue" stroke={C.green} strokeWidth={2} fill="url(#expGreen)" name="Revenue" />
                  <Area type="monotone" dataKey="costs" stroke={C.red} strokeWidth={2} fill="url(#expRed)" name="Costs" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: C.amber }}>
                Break-even projected at month {scenario.breakEvenMonth}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>Financial Model: {scenario.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Total Setup Cost', value: `\u00a3${scenario.setupCost.toLocaleString()}`, icon: Building2 },
                  { label: 'Monthly Rent', value: `\u00a3${scenario.monthlyRent.toLocaleString()}`, icon: PoundSterling },
                  { label: 'Staff Required', value: `${scenario.staffCount} FTEs`, icon: Calculator },
                  { label: 'Monthly Labour', value: `\u00a3${scenario.monthlyLabour.toLocaleString()}`, icon: Calculator },
                  { label: 'Projected Monthly Revenue', value: `\u00a3${scenario.projectedRevenue.toLocaleString()}`, icon: TrendingUp },
                  { label: 'Projected Monthly EBITDA', value: `\u00a3${scenario.projectedEbitda.toLocaleString()}`, icon: TrendingUp },
                  { label: 'Year 1 ROI', value: `${scenario.yearOneROI}%`, icon: TrendingUp },
                  { label: 'Year 2 ROI', value: `${scenario.yearTwoROI}%`, icon: TrendingUp },
                ].map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.textMuted }}>
                      <m.icon size={14} color={C.textDim} />{m.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 14, padding: '12px 14px', borderRadius: 8, background: C.amberBg,
                borderLeft: `3px solid ${C.amber}`, fontSize: 12, color: C.text, lineHeight: 1.5,
              }}>
                {scenario.notes}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 6, fontFamily: 'Georgia, serif' }}>
            London Commercial Real Estate Intelligence
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>
            30 areas analysed &mdash; rent trends, vacancy rates, and opportunity scoring for hospitality operators.
          </div>

          {/* Year Selector */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
            {[2021, 2022, 2023, 2024, 2025].map(year => (
              <button key={year} onClick={() => setSelectedYear(year)} style={{
                padding: '8px 18px', fontSize: 12, fontWeight: selectedYear === year ? 700 : 400,
                color: selectedYear === year ? '#000' : C.textMuted,
                background: selectedYear === year ? C.amber : C.card,
                border: `1px solid ${selectedYear === year ? C.amber : C.border}`,
                borderRadius: year === 2021 ? '8px 0 0 8px' : year === 2025 ? '0 8px 8px 0' : 0,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{year}</button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid-kpi" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
            {[
              { label: 'Avg Commercial Rent', value: `\u00a3${agg.avgRent}/sq ft`, sub: `${selectedYear} average`, color: C.amber },
              { label: 'Avg Vacancy Rate', value: `${agg.avgVacancy}%`, sub: 'across 30 areas', color: parseFloat(agg.avgVacancy) > 8 ? C.red : parseFloat(agg.avgVacancy) > 5 ? C.orange : C.green },
              { label: 'Cheapest Area', value: agg.cheapest.name, sub: `\u00a3${agg.cheapest.rents[selectedYear]}/sq ft`, color: C.green },
              { label: 'Most Expensive', value: agg.mostExpensive.name, sub: `\u00a3${agg.mostExpensive.rents[selectedYear]}/sq ft`, color: C.red },
              { label: 'Fastest Rising (5yr)', value: agg.fastestRising.name, sub: `+${agg.fastestRisingPct}% since 2021`, color: C.orange },
            ].map((kpi, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
              }}>
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{kpi.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: kpi.color, marginBottom: 4 }}>{kpi.value}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid-2col" style={{ marginBottom: 24 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Commercial Rent Trends (2021-2025)</div>
                <button onClick={() => setShowChartPicker(!showChartPicker)} style={{
                  padding: '4px 10px', fontSize: 10, background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 6, color: C.textMuted, cursor: 'pointer',
                }}>
                  <Filter size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />Edit Areas
                </button>
              </div>
              {showChartPicker && (
                <div style={{
                  marginBottom: 12, padding: 12, background: C.bg, borderRadius: 8,
                  border: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 6,
                }}>
                  {londonAreas.map(a => (
                    <button key={a.name} onClick={() => {
                      setChartAreas(prev =>
                        prev.includes(a.name) ? prev.filter(n => n !== a.name) :
                        prev.length < 8 ? [...prev, a.name] : prev
                      )
                    }} style={{
                      padding: '3px 8px', fontSize: 10, borderRadius: 4, cursor: 'pointer',
                      background: chartAreas.includes(a.name) ? C.amberBg : 'transparent',
                      border: `1px solid ${chartAreas.includes(a.name) ? C.amber : C.border}`,
                      color: chartAreas.includes(a.name) ? C.amber : C.textDim,
                    }}>{a.name}</button>
                  ))}
                </div>
              )}
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
                  <XAxis dataKey="year" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00a3${v}`} />
                  <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                    formatter={(v, name) => [`\u00a3${v}/sq ft`, name]} />
                  <Legend wrapperStyle={{ fontSize: 10, color: C.textMuted }} />
                  {chartAreas.map((name, i) => (
                    <Line key={name} type="monotone" dataKey={name} stroke={chartColors[i % chartColors.length]}
                      strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: C.textDim }}>
                COVID recovery visible from 2021 low. Select up to 8 areas to compare.
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>London Average Vacancy Rate (2021-2025)</div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={vacancyChartData}>
                  <defs>
                    <linearGradient id="vacGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.teal} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
                  <XAxis dataKey="year" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 11 }}
                    formatter={v => [`${v}%`, 'Avg Vacancy']} />
                  <Area type="monotone" dataKey="average" stroke={C.teal} strokeWidth={2} fill="url(#vacGrad)" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Gentrification Watch: Fastest Risers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {londonAreas
                  .map(a => ({ name: a.name, change: ((a.rents[2025] - a.rents[2021]) / a.rents[2021] * 100).toFixed(0) }))
                  .sort((a, b) => b.change - a.change)
                  .slice(0, 5)
                  .map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, color: C.text }}>{a.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>+{a.change}%</span>
                    </div>
                  ))
                }
              </div>
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Stagnant / Declining</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {londonAreas
                  .map(a => ({ name: a.name, change: ((a.rents[2025] - a.rents[2021]) / a.rents[2021] * 100).toFixed(0) }))
                  .sort((a, b) => a.change - b.change)
                  .slice(0, 3)
                  .map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, color: C.text }}>{a.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: parseInt(a.change) < 0 ? C.red : C.textMuted }}>
                        {parseInt(a.change) >= 0 ? '+' : ''}{a.change}%
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Budget Filter */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={14} color={C.amber} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Max budget:</span>
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              {[40, 60, 80, 100, 150, 200].map(val => (
                <button key={val} onClick={() => setBudgetMax(val)} style={{
                  padding: '6px 12px', fontSize: 11, fontWeight: budgetMax === val ? 700 : 400,
                  color: budgetMax === val ? '#000' : C.textMuted,
                  background: budgetMax === val ? C.green : 'transparent',
                  border: `1px solid ${budgetMax === val ? C.green : C.border}`,
                  borderRadius: val === 40 ? '6px 0 0 6px' : val === 200 ? '0 6px 6px 0' : 0,
                  cursor: 'pointer',
                }}>{'\u00a3'}{val}{val === 200 ? '+' : ''}</button>
              ))}
            </div>
            <span style={{ fontSize: 11, color: C.textDim }}>
              Showing {filteredAreas.length} of {londonAreas.length} areas
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 10, color: C.textDim }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, display: 'inline-block' }} /> Opportunity</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber, display: 'inline-block' }} /> Mid-range</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, display: 'inline-block' }} /> Premium</span>
            </div>
          </div>

          {/* Main Data Table */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  <SortHeader field="name" label="Area" />
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>Postcode</th>
                  <SortHeader field="rent" label={`Rent (\u00a3/sqft) ${selectedYear}`} />
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>YoY %</th>
                  <SortHeader field="fiveYr" label="5yr Change" />
                  <SortHeader field="vacancy" label="Vacancy %" />
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>Lease</th>
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>Key Money</th>
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>Rates</th>
                  <SortHeader field="footfall" label="Footfall" />
                  <SortHeader field="density" label="Venues" />
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>Best For</th>
                  <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, textAlign: 'center', width: 30 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredAreas.map((area) => {
                  const metrics = getAreaMetrics(area, selectedYear)
                  const oppColor = getOpportunityColor(area, selectedYear)
                  const isExpanded = expandedArea === area.name
                  return (
                    <tr key={area.name} style={{ cursor: 'pointer' }} onClick={() => setExpandedArea(isExpanded ? null : area.name)}>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: oppColor, flexShrink: 0 }} />
                          <span style={{ color: C.ink, fontWeight: 600 }}>{area.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textDim }}>{area.postcode}</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.ink }}>{'\u00a3'}{metrics.rent}</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: metrics.yoyChange > 0 ? C.orange : C.green }}>
                        {metrics.yoyChange ? `${metrics.yoyChange > 0 ? '+' : ''}${metrics.yoyChange}%` : '\u2014'}
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: parseFloat(metrics.fiveYearChange) > 50 ? C.red : parseFloat(metrics.fiveYearChange) > 30 ? C.orange : C.green }}>
                        +{metrics.fiveYearChange}%
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: area.vacancy[selectedYear] > 8 ? C.red : area.vacancy[selectedYear] > 5 ? C.orange : C.green }}>
                        {metrics.vacancy}%
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted }}>{area.leaseYears}yr</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted }}>{'\u00a3'}{(area.keyMoney / 1000).toFixed(0)}k</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted }}>{'\u00a3'}{(area.businessRates / 1000).toFixed(0)}k</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, color: footfallColors[area.footfall], background: footfallColors[area.footfall] + '15', textTransform: 'uppercase' }}>
                          {area.footfall}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted }}>{area.hospitalityDensity}</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.textDim }}>{area.bestFor.join(', ')}</td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
                        {isExpanded ? <ChevronUp size={12} color={C.amber} /> : <ChevronDown size={12} color={C.textDim} />}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Expanded Area Detail */}
          {expandedArea && (() => {
            const area = londonAreas.find(a => a.name === expandedArea)
            if (!area) return null
            const rentHistory = [2021, 2022, 2023, 2024, 2025].map(y => ({
              year: y.toString(), rent: area.rents[y], vacancy: area.vacancy[y],
            }))
            return (
              <div style={{
                background: C.card, border: `1px solid ${C.amber}30`, borderRadius: 12, padding: 20,
                marginTop: -12, marginBottom: 24,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{area.name} Deep Dive</div>
                    <div style={{ fontSize: 11, color: C.textDim }}>{area.postcode} &bull; Best for: {area.bestFor.join(', ')}</div>
                  </div>
                  <button onClick={() => setExpandedArea(null)} style={{
                    padding: '6px 12px', fontSize: 11, background: C.bg, border: `1px solid ${C.border}`,
                    borderRadius: 6, color: C.textMuted, cursor: 'pointer',
                  }}>Close</button>
                </div>
                <div className="grid-2col">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Rent &amp; Vacancy History</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={rentHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E21" />
                        <XAxis dataKey="year" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `\u00a3${v}`} />
                        <YAxis yAxisId="right" orientation="right" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickFormatter={v => `${v}%`} />
                        <Tooltip contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 11 }} />
                        <Line yAxisId="left" type="monotone" dataKey="rent" stroke={C.amber} strokeWidth={2} name="Rent (\u00a3/sqft)" dot={{ r: 4 }} />
                        <Line yAxisId="right" type="monotone" dataKey="vacancy" stroke={C.teal} strokeWidth={2} name="Vacancy %" dot={{ r: 4 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Annual Cost Estimate (1,000 sq ft)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Annual Rent', value: `\u00a3${(area.rents[selectedYear] * 1000).toLocaleString()}`, color: C.amber },
                        { label: 'Business Rates', value: `\u00a3${area.businessRates.toLocaleString()}`, color: C.textMuted },
                        { label: 'Key Money / Premium', value: `\u00a3${area.keyMoney.toLocaleString()}`, color: C.textMuted },
                        { label: 'Total Year 1 Cost', value: `\u00a3${(area.rents[selectedYear] * 1000 + area.businessRates + area.keyMoney).toLocaleString()}`, color: C.ink },
                        { label: 'Typical Lease', value: `${area.leaseYears} years`, color: C.textDim },
                      ].map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 12px', background: C.bg, borderRadius: 6, border: `1px solid ${C.border}`,
                        }}>
                          <span style={{ fontSize: 12, color: C.textMuted }}>{item.label}</span>
                          <span style={{ fontSize: 13, fontWeight: i === 3 ? 700 : 500, color: item.color }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: 12, padding: '10px 14px', borderRadius: 8, background: C.amberBg,
                      borderLeft: `3px solid ${C.amber}`, fontSize: 11, color: C.text, lineHeight: 1.5,
                    }}>
                      <strong>Operator Insight:</strong> {area.name} has {area.hospitalityDensity} hospitality venues.
                      {' '}{area.footfall === 'high' ? 'High footfall makes this area strong for walk-in trade.' :
                        area.footfall === 'medium' ? 'Medium footfall \u2014 destination-driven concepts work best here.' :
                        'Lower footfall \u2014 strong branding and marketing essential.'}
                      {' '}Vacancy at {area.vacancy[selectedYear]}% in {selectedYear}
                      {area.vacancy[selectedYear] < 4 ? ' means competition for space is fierce.' :
                       area.vacancy[selectedYear] < 7 ? ' indicates a healthy market with some availability.' :
                       ' suggests good negotiating power on lease terms.'}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Year-on-Year Rent Changes</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[2022, 2023, 2024, 2025].map(y => {
                    const prev = area.rents[y - 1]
                    const curr = area.rents[y]
                    const change = ((curr - prev) / prev * 100).toFixed(1)
                    return (
                      <div key={y} style={{
                        padding: '8px 14px', background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`,
                        textAlign: 'center', minWidth: 80,
                      }}>
                        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{y - 1} &rarr; {y}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: change > 0 ? C.orange : C.green }}>
                          {change > 0 ? '+' : ''}{change}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Market Commentary */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Market Commentary: {selectedYear}</div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7 }}>
              {selectedYear === 2021 && (
                <>
                  <p style={{ marginBottom: 10 }}>2021 marked the nadir of London{'\u2019'}s commercial property market following the COVID-19 pandemic. Vacancy rates averaged over 9% across the 30 areas tracked, with prime locations like Covent Garden hitting 15.2% and the City of London at 12.5%. Rents fell 15-25% from pre-pandemic peaks in many areas, creating the best entry opportunity in a decade for hospitality operators willing to take on risk.</p>
                  <p style={{ marginBottom: 10 }}>Emerging areas like Peckham ({'\u00a3'}22/sq ft), Tooting ({'\u00a3'}22/sq ft), and Dalston ({'\u00a3'}25/sq ft) offered exceptional value for operators willing to bet on neighbourhood recovery. Canary Wharf began its structural decline in office occupancy, pushing commercial rents down despite the area{'\u2019'}s infrastructure quality.</p>
                  <p>The smart money moved early: operators who locked in 2021 leases in areas like Bermondsey, Brixton, and Elephant &amp; Castle captured 50-90% rent appreciation over the subsequent four years.</p>
                </>
              )}
              {selectedYear === 2022 && (
                <>
                  <p style={{ marginBottom: 10 }}>2022 saw the beginning of the recovery. Footfall returned to 75-85% of pre-pandemic levels in central London, and landlords began tightening terms. Vacancy rates dropped 2-3 percentage points across most areas. However, the cost-of-living crisis and energy price spike created new headwinds, particularly for independent operators.</p>
                  <p style={{ marginBottom: 10 }}>East London continued its structural outperformance: Shoreditch rents rose from {'\u00a3'}42 to {'\u00a3'}48/sq ft (+14.3%), while Hackney jumped from {'\u00a3'}32 to {'\u00a3'}38 (+18.8%). Gentrification accelerated in Peckham, Whitechapel, and Elephant &amp; Castle, with multiple new openings attracting media attention and further footfall.</p>
                  <p>Prime West End rents (Soho, Covent Garden, Mayfair) remained below 2019 peaks but showed clear upward momentum. Operators securing leases in this window still captured significant value.</p>
                </>
              )}
              {selectedYear === 2023 && (
                <>
                  <p style={{ marginBottom: 10 }}>2023 represented the inflection point. London hospitality vacancies dropped below 6% in most tracked areas, and rents surpassed pre-pandemic levels in 18 of 30 areas. The return of international tourism, combined with strong domestic demand for experiential dining and drinking, created fierce competition for A3/A4 units.</p>
                  <p style={{ marginBottom: 10 }}>Soho crossed the {'\u00a3'}110/sq ft threshold, up 29% from its 2021 low. Borough/London Bridge emerged as a top-tier hospitality destination, with rents rising 30% in two years. Meanwhile, Canary Wharf bucked the trend, continuing to decline as hybrid working permanently reduced weekday footfall.</p>
                  <p>The gentrification premium became undeniable: Elephant &amp; Castle rents jumped 44% in two years, driven by the regeneration around Elephant Park. Operators in emerging areas faced a narrowing window to secure space before pricing normalised.</p>
                </>
              )}
              {selectedYear === 2024 && (
                <>
                  <p style={{ marginBottom: 10 }}>2024 saw the London commercial market reach maturity in its post-COVID cycle. Vacancy rates fell to 3-5% in most prime and emerging areas, creating a landlord{'\u2019'}s market. Competition for new space intensified, with some units receiving 10+ applications. Key money and premiums rose significantly, adding {'\u00a3'}50k-{'\u00a3'}100k to entry costs in desirable locations.</p>
                  <p style={{ marginBottom: 10 }}>Rent growth moderated from the recovery-era spikes but remained positive across all areas except Canary Wharf. The spread between prime (Mayfair at {'\u00a3'}145, Covent Garden at {'\u00a3'}128) and emerging (Peckham at {'\u00a3'}38, Tooting at {'\u00a3'}34) widened to over {'\u00a3'}100/sq ft, the largest gap in a decade.</p>
                  <p>Smart operators pivoted to secondary locations within prime postcodes, seeking backstreet units in Soho and side roads off Upper Street in Islington, where rents were 30-40% lower than prime frontage.</p>
                </>
              )}
              {selectedYear === 2025 && (
                <>
                  <p style={{ marginBottom: 10 }}>2025 represents a mature market with limited entry points. London average commercial rent hit {'\u00a3'}{agg.avgRent}/sq ft with average vacancy at just {agg.avgVacancy}%. The best opportunities now exist in areas still completing their gentrification cycle: Elephant &amp; Castle ({'\u00a3'}48/sq ft, 4.5% vacancy), Stratford ({'\u00a3'}45/sq ft, high footfall from the Olympics legacy), and Tooting ({'\u00a3'}38/sq ft), which remains London{'\u2019'}s most undervalued high-footfall neighbourhood.</p>
                  <p style={{ marginBottom: 10 }}>The premium segment is fully priced: Mayfair at {'\u00a3'}155/sq ft and Covent Garden at {'\u00a3'}140/sq ft offer minimal margin upside unless the concept commands ultra-premium pricing. Operators seeking value must now look beyond Zone 1, targeting transport-connected neighbourhoods with strong residential density.</p>
                  <p>Canary Wharf presents a contrarian opportunity at {'\u00a3'}44/sq ft with 10% vacancy {'\u2014'} the highest in London. If the Wharf{'\u2019'}s pivot to mixed-use (adding 3,500 residential units by 2027) succeeds, today{'\u2019'}s rates may look like a bargain. However, the risk is significant and the area{'\u2019'}s hospitality track record remains weak.</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
